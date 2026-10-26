"""Geocode ungeocoded Dutch street addresses using the free PDOK Locatieserver.
Only exact city, street and house-number matches are accepted. No guessed points.
Run on GitHub Actions before the Pages deployment.
"""
import difflib, json, re, time, unicodedata
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'data/venues.json'
REPORT=ROOT/'data/geocode-report.json'
API='https://api.pdok.nl/bzk/locatieserver/search/v3_1/free'

def norm(s):
    s=unicodedata.normalize('NFKD',str(s or '')).encode('ascii','ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+',' ',s).strip()

def addr_parts(s):
    s=s.strip().split(',',1)[0].strip()
    # Supports number and common single-letter addition. No street-only guesses.
    match=re.match(r'^(.+?)\s+(\d+)\s*([a-zA-Z]?)\s*$',s)
    return (match.group(1),int(match.group(2)),match.group(3).lower()) if match else None

def extract_point(wkt):
    m=re.match(r'^POINT\s*\(\s*([-+\d.]+)\s+([-+\d.]+)\s*\)$',str(wkt or ''),flags=re.I)
    if not m:return None
    lon,lat=map(float,m.groups())
    return [round(lat,7),round(lon,7)] if 50.0 < lat < 54.0 and 3.0 < lon < 8.0 else None

def request(q):
    url=API+'?'+urlencode({'q':q,'rows':8,'fq':'type:adres'})
    for attempt in range(3):
        try:
            req=Request(url,headers={'User-Agent':'nogergensnaarbinnen/0.1 (public open-data map)', 'Accept':'application/json'})
            with urlopen(req,timeout=24) as res: return json.load(res).get('response',{}).get('docs',[])
        except (HTTPError,URLError,TimeoutError,ValueError) as e:
            print('PDOK request failed:',str(e)[:180]);time.sleep(2*(attempt+1))
    return []

def geo(place):
    parts=addr_parts(place.get('address',''))
    if not parts:return None,'no-number-or-unparseable-address'
    street,number,suffix=parts
    docs=request(f'{street} {number}{suffix} {place["city"]}')
    for obj in docs:
        if norm(obj.get('woonplaatsnaam')) != norm(place['city']): continue
        if str(obj.get('type','')).lower()!='adres':continue
        try:docnumber=int(obj.get('huisnummer'))
        except (ValueError,TypeError):continue
        if docnumber!=number:continue
        observed=norm(obj.get('straatnaam',''))
        expected=norm(street)
        if observed!=expected and difflib.SequenceMatcher(None,observed,expected).ratio()<0.93:continue
        point=extract_point(obj.get('centroide_ll'))
        if point:
            return {'lat':point[0],'lon':point[1],'method':'PDOK BAG-adres',
                    'matched_address':obj.get('weergavenaam','')},'ok'
    return None,'no-exact-PDOK-match'

def main():
    payload=json.loads(DATA.read_text(encoding='utf-8'))
    updated=0; failures=[]
    for i,p in enumerate(payload['places'],1):
        if p.get('geo') and isinstance(p['geo'],dict) and p['geo'].get('lat') and p['geo'].get('lon'):
            continue
        if not p.get('address'):
            failures.append({'name':p['name'],'address':'','reason':'missing-address'})
            continue
        g,reason=geo(p)
        if g:
            p['geo']=g;updated+=1
        else:failures.append({'name':p['name'],'address':p['address'],'reason':reason})
        if i % 20==0:print(f'{i}/{len(payload["places"])} checked; geocoded {updated}')
        time.sleep(0.3)
    DATA.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    count=sum(bool(p.get('geo')) for p in payload['places'])
    report={'total':len(payload['places']),'with_coordinates':count,
            'without_coordinates':len(payload['places'])-count,'added_in_this_run':updated,'unmatched':failures}
    REPORT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f'Geocoded {count}/{len(payload["places"])}; {len(failures)} unmatched (no approximate pins).')

if __name__=='__main__':main()