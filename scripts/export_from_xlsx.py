"""One-time import of the 2026-10-25 Utrecht spreadsheet into venue JSON.
Usage: python scripts/export_from_xlsx.py /path/to/file.xlsx
Requires artifact_tool. Existing geocodes are preserved by stable place IDs.
"""
import json, re, sys, unicodedata, hashlib
from pathlib import Path
from artifact_tool import Blob, SpreadsheetFile

ROOT = Path(__file__).resolve().parents[1]
DAYS = ['ma','di','wo','do','vr','za','zo']

def text(value):
    return str(value).strip() if value is not None else ''

def slug(s):
    norm=unicodedata.normalize('NFKD',s)
    return re.sub(r'[^a-z0-9]+','-',norm.encode('ascii','ignore').decode().lower()).strip('-')[:48]

def closing(v):
    if isinstance(v,(int,float)) and not isinstance(v,bool):
        minute=round(float(v)*1440)
        return f'{(minute // 60)%24:02d}:{minute%60:02d}'
    s=text(v)
    if re.fullmatch(r'\d{1,2}:\d\d(?::\d\d)?',s):
        h,m=map(int,s.split(':')[:2]);return f'{h:02d}:{m:02d}'
    return s or '?'

def run(infile):
    out=ROOT/'data/venues.json'
    cache={}
    if out.exists():
        try:cache={x['id']: x.get('geo') for x in json.loads(out.read_text(encoding='utf-8'))['places']}
        except (ValueError,KeyError):pass
    wb=SpreadsheetFile.import_xlsx(Blob.load(str(infile)))
    rows=wb.worksheets.get_item('Locaties').get_range('A1:U196').values
    header=rows[0]
    assert [text(c) for c in header[:3]] == ['Naam','Type','Adres Utrecht']
    places=[]
    for row in rows[1:]:
        if not text(row[0]):continue
        name=text(row[0]); addr=text(row[2])
        key=slug(name)+'-'+hashlib.sha1((name+'|Utrecht|'+addr).encode('utf-8')).hexdigest()[:7]
        source_names = [x.strip() for x in text(row[19]).split(';') if x.strip()]
        url=text(row[18]); url=url if url.startswith(('https://','http://')) else ''
        obj={
            'id':key,'name':name,'type':text(row[1]),'address':addr,
            'city':'Utrecht','region':'utrecht','country':'Nederland',
            'access':text(row[3]),'alcohol':text(row[4]),'selection':text(row[5]),
            'closing':{d:closing(row[6+i]) for i,d in enumerate(DAYS)},
            'closing_quality':text(row[13]),'closing_source':text(row[14]),
            'checked_on':text(row[15]),'closing_notes':text(row[16]),
            'features':text(row[17]),'website':url,'other_sources':source_names,
            'original_status':text(row[20]),'geo':cache.get(key),
        }
        places.append(obj)
    payload={'schema_version':1,'last_data_review':'2026-10-25',
        'disclaimer':'Sluitingstijden niet live gecontroleerd. ? betekent onbekend, — volgens bron gesloten, Event/Varieert wisselend. Openingstijden ontbreken. Geen garantie dat een zaak nu open is.',
        'regions':[{'id':'utrecht','name':'Utrecht','center':[52.0907,5.1214],'zoom':13}],
        'places':places}
    out.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f'Exported {len(places)} places, {sum(bool(x["address"]) for x in places)} with addresses; output {out}')

if __name__=='__main__':
    if len(sys.argv)<2:sys.exit('Usage: python scripts/export_from_xlsx.py file.xlsx')
    run(Path(sys.argv[1]))