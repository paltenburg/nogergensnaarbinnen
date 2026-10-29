#!/usr/bin/env python3
"""Build an update-check source register from venue records and research notes.

This script does NOT browse or revalidate pages. Dates reflect recorded
field checks, not the current status of a website.
"""
from collections import defaultdict
from datetime import datetime
import json
from pathlib import Path
import re
from urllib.parse import urlsplit, urlunsplit
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
TODAY = datetime.now(ZoneInfo("Europe/Amsterdam")).date().isoformat()
JSON_PATH = DATA / "source-register.json"
MD_PATH = DATA / "source-register.md"
ROLE_FIELDS = [
    ("website", "website", "website_checked_on"),
    ("closing_source", "sluitingstijden", "checked_on"),
    ("opening_source", "openingstijden", "opening_checked_on"),
    ("last_entry_source", "laatste_toegang", "last_entry_checked_on"),
    ("other_sources", "achtergrond", None),
]
SEED_SITES = [
    ("Centrum Utrecht", "https://centrumutrecht.nl/", "Horecagids binnenstad; nieuwe of gesloten zaken, openingstijden"),
    ("Ontdek Utrecht", "https://www.ontdek-utrecht.nl/", "Toeristische gids; bestaande en nieuwe cafés, uren"),
    ("Uit Utrecht", "https://www.uitutrecht.com/uitgaan/", "Uitgaansgelegenheden, evenementen"),
    ("Uitagenda Utrecht", "https://www.uitagenda.nl/index.php/utrecht", "Uitgaansagenda, clubs en podia"),
    ("De Buik Utrecht", "https://www.debuik.nl/utrecht", "Nieuws over nieuw, heropend en gesloten"),
    ("PuurOost", "https://www.puuroost-utrecht.nl/", "Wijkbedrijven Utrecht Oost"),
    ("Verse Uitjes", "https://verseuitjes.nl/uit-in/utrecht/nieuwe-horeca/1/nomono", "Nieuwe horecazaken en aangekondigde openingen"),
    ("Universiteit Utrecht catering", "https://www.uu.nl/organisatie/praktische-zaken/facilitair/catering", "Campuslocaties en toegang"),
    ("Uitgaanskaart Fryslân", "https://uitgaanskaart.nl/provincie/friesland", "Provinciebrede gids; controle op ontbrekende kroegen, bars, clubs, nieuwe of gesloten adressen; naam/adres verifiëren"),
    ("Friesland.nl horeca", "https://www.friesland.nl/nl/plannen/eten-en-drinken/eet-cafes", "Friese toeristische gids, dorpshoreca en expliciete weekroosters"),
    ("Waterland van Friesland cafés", "https://www.waterlandvanfriesland.nl/nl/plan-je-bezoek/eten-en-drinken/cafes-en-bars", "Zuidwest-Friesland inclusief Sneek, Bolsward, Lemmer, Woudsend en de meren"),
    ("Visit Leeuwarden uitgaan", "https://visitleeuwarden.com/doen/uitgaan/", "Cafés, muziekcafés en clubs Leeuwarden; openingen, sluitingen en adressen"),
    ("Agenda Leeuwarden", "https://agendaleeuwarden.nl/hotspots/?soort=cafes-uitgaan", "Lokale uitgaanslocaties en openingsnieuws"),
    ("Dokkum horeca", "https://dokkum.nl/eten-en-drinken/", "Nieuw en bestaand horecaanbod Dokkum"),
    ("Visit Wadden", "https://www.visitwadden.nl/nl/bezoeken/", "Wadden, eilanden en noordelijke kustplaatsen"),
    ("ZuidoostFriesland horeca", "https://www.zuidoostfriesland.nl/bezoeken/eten-drinken/alle-horecagelegenheden", "Drachten, Heerenveen, Wolvega, Appelscha en overige zuidoostelijke plaatsen"),
    ("Bolsward horeca", "https://www.bolsward.nl/winkelen-en-horeca/eten-en-drinken/", "Nieuwe of gesloten cafés rond Bargefenne en binnenstad"),
    ("Uitagenda Drachten", "https://www.uitagenda.nl/drachten", "Locaties Drachten, cafés en uitgaanscentra"),
    ("Uitagenda Dokkum", "https://www.uitagenda.nl/dokkum", "Kroegen en evenementlocaties Dokkum"),
    ("Uit Sneek uitgaan", "https://uitsneek.com/uitgaan/", "Sneekse horeca; gids is niet zelf voldoende bewijs voor openingstijden"),
    ("Uit Leeuwarden uitgaan", "https://uitleeuwarden.com/uitgaan/", "Horecagids Leeuwarden; verifieer status en adres onafhankelijk"),
    ("Uit Heerenveen uitgaan", "https://uitheerenveen.com/uitgaan/", "Heerenveense uitgaanslocaties; actuele status en adres afzonderlijk controleren"),
]
URL_RE = re.compile(r"https?://[^\s<>'\"|;,]+")
NOTE_RE = re.compile(r"\]\((https?://[^)]+)\)")
CONFLICT_RE = re.compile(
    r"tegenstrijd|conflict|wijkt af|afwijkend|heropen|verbouw|"
    r"achterhaald|geen vaste sluitingstijd|laatste toegang|controleer",
    re.IGNORECASE
)


def extract_urls(value):
    if not value:
        return []
    if isinstance(value, list):
        return list(dict.fromkeys(u for element in value for u in extract_urls(element)))
    result = []
    for match in URL_RE.findall(str(value)):
        candidate = match.rstrip(".,)]}")
        parsed = urlsplit(candidate)
        if parsed.scheme not in ("http", "https") or not parsed.hostname:
            continue
        candidate = urlunsplit((parsed.scheme.lower(), parsed.netloc.lower(), parsed.path, parsed.query, ""))
        if candidate not in result:
            result.append(candidate)
    return result


def host_name(url):
    return urlsplit(url).hostname.lower().removeprefix("www.")


def main():
    dataset = json.loads((DATA / "venues.json").read_text(encoding="utf-8"))
    venues = dataset["places"]
    old_items = {}
    if JSON_PATH.exists():
        previous = json.loads(JSON_PATH.read_text(encoding="utf-8"))
        old_items = {item["url"]: item for item in previous.get("sources", [])}
    sources = {}

    def register(url, role=None, venue=None, check_date=None):
        if url not in sources:
            previous = old_items.get(url, {})
            sources[url] = {
                "url": url, "domain": host_name(url),
                "first_registered_on": previous.get("first_registered_on", TODAY),
                "last_manual_page_check_on": previous.get("last_manual_page_check_on"),
                "manual_review_note": previous.get("manual_review_note", ""),
                "roles": set(), "venues": {},
            }
        entry = sources[url]
        if role:
            entry["roles"].add(role)
        if venue:
            key = venue["id"]
            if key not in entry["venues"]:
                entry["venues"][key] = {
                    "id": key, "name": venue["name"],
                    "roles": set(), "checked_on": {},
                    "needs_review": bool(
                        CONFLICT_RE.search(venue.get("closing_notes", ""))
                        or venue.get("selection") in ("Nee", "Nog te controleren")
                    ),
                }
            linked = entry["venues"][key]
            linked["roles"].add(role)
            if check_date and re.fullmatch(r"\d{4}-\d{2}-\d{2}", str(check_date)):
                linked["checked_on"][role] = check_date

    for venue in venues:
        for field, role, date_field in ROLE_FIELDS:
            for url in extract_urls(venue.get(field)):
                register(url, role, venue, venue.get(date_field) if date_field else None)

    # Municipal rules are separate provenance, not inferred per venue.
    # Only sites explicitly assigned admission_policy_id receive these limits.
    for policy in dataset.get("admission_policies", []):
        for url in extract_urls(policy.get("source")):
            register(url, "gemeentelijke_toegangsregel")
    
    for note_file in sorted(DATA.glob("research-notes-*.md")):
        for found in NOTE_RE.findall(note_file.read_text(encoding="utf-8")):
            for url in extract_urls(found):
                register(url, "onderzoeksnotitie")

    for name, url, reason in SEED_SITES:
        for parsed in extract_urls(url):
            register(parsed, "terugkerende_vindplaats")

    records = []
    for item in sources.values():
        linked = []
        for venue in sorted(item["venues"].values(), key=lambda x: x["name"].casefold()):
            venue["roles"] = sorted(venue["roles"])
            linked.append(venue)
        dates = [dt for v in linked for dt in v["checked_on"].values()]
        item["roles"] = sorted(item["roles"])
        item["venues"] = linked
        item["last_data_field_checked_on"] = max(dates) if dates else None
        item["linked_venue_count"] = len(linked)
        item["needs_review"] = any(v["needs_review"] for v in linked)
        records.append(item)
    records.sort(key=lambda item: (item["domain"], item["url"]))

    domains = defaultdict(lambda: {"pages": 0, "venues": set()})
    for record in records:
        domains[record["domain"]]["pages"] += 1
        domains[record["domain"]]["venues"].update(v["id"] for v in record["venues"])
    domain_list = sorted(
        [{"domain": host, "source_pages": values["pages"], "linked_venues": len(values["venues"])}
         for host, values in domains.items()],
        key=lambda item: (-item["source_pages"], item["domain"]),
    )

    missing_sites = sorted(
        [{"id": p["id"], "name": p["name"]} for p in venues if not p.get("website")],
        key=lambda x: x["name"].casefold(),
    )
    unknown_friday = sorted(
        [{"id": p["id"], "name": p["name"]}
         for p in venues if p.get("closing", {}).get("vr") in (None, "?")],
        key=lambda x: x["name"].casefold(),
    )
    attention = sorted(
        [{"id": p["id"], "name": p["name"], "reason": p.get("closing_notes", "")}
         for p in venues if CONFLICT_RE.search(p.get("closing_notes", ""))],
        key=lambda x: x["name"].casefold(),
    )
    registry = {
        "schema_version": 1,
        "generated_on": TODAY,
        "disclaimer": "Inventory only; this script does not visit websites. A checked-on date comes only from stored field provenance.",
        "counts": {"venues": len(venues), "source_urls": len(records), "domains": len(domain_list),
                   "direct_website_fields": len(venues) - len(missing_sites)},
        "discovery_sites": [
            {"name": name, "url": url, "recheck_for": reason, "last_exhaustive_check_on": None}
            for name, url, reason in SEED_SITES
        ],
        "domains": domain_list,
        "sources": records,
        "next_review": {
            "missing_websites": missing_sites,
            "unknown_friday_closing": unknown_friday,
            "possible_conflicts_or_closures": attention,
        },
    }
    JSON_PATH.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Bronnenregister nogergensnaarbinnen",
        "",
        "Gegenereerd op " + TODAY + " uit de locatiedatabase en onderzoeksverslagen.",
        "",
        "**" + str(len(records)) + " geregistreerde bron-URL's**, " + str(len(domain_list)) +
        " domeinen; gekoppeld aan **" + str(len(venues)) + " locaties**.",
        "",
        "Dit is een inventaris, GEEN controle van live websites of tijden. "
        "Een eerdere controledatum is overgenomen uit de betreffende databasevelden.",
        "",
        "## Vindplaatsen voor nieuwe zaken en wijzigingen",
        "",
    ]
    for name, url, reason in SEED_SITES:
        lines.append("- [" + name + "](" + url + ") — " + reason)
    lines.extend([
        "",
        "## Bij de volgende controle",
        "",
        "1. Controleer eerst de vindplaatsen hierboven op nieuwe zaken, sluitingen en gewijzigde namen.",
        "2. Controleer vervolgens de officiële websites uit de volledige URL-lijst hieronder.",
        "3. Noteer nieuwe uren, laatste toegang, officiële bron-URL en datum in de locatiedatabase.",
        "4. Begin bij conflicten en ontbrekende websites in het JSON-register.",
        "5. Genereer dit overzicht opnieuw met het Python-script na een databankupdate.",
        "",
        "## Dekking per domein",
        "",
        "| Domein | Bron-URL's | Locaties |",
        "|---|---:|---:|",
    ])
    for info in domain_list:
        lines.append("| " + info["domain"] + " | " + str(info["source_pages"]) + " | " +
                     str(info["linked_venues"]) + " |")
    lines.extend(["", "## Alle opgeslagen bron-URL's", ""])
    last_domain = ""
    for source in records:
        if source["domain"] != last_domain:
            last_domain = source["domain"]
            lines.extend(["", "### " + last_domain, ""])
        names = ", ".join(v["name"] for v in source["venues"][:5])
        if len(source["venues"]) > 5:
            names += " (+ " + str(len(source["venues"]) - 5) + " meer)"
        lines.append("- [" + source["url"] + "](" + source["url"] + ") — " +
                     ", ".join(source["roles"]) + "; " +
                     (names if names else "algemene bron") + "; bronveld gecontroleerd: " +
                     (source["last_data_field_checked_on"] or "onbekend"))
    lines.extend([
        "",
        "Handmatig gecontroleerde pagina's kunnen in JSON worden voorzien van "
        "last_manual_page_check_on en manual_review_note. Deze blijven bewaard na regeneratie.",
        "Het register vergelijkt webpagina's NIET automatisch en verstuurt geen updates.",
        "",
    ])
    MD_PATH.write_text("\n".join(lines), encoding="utf-8")
    print("Bronnen: " + str(len(records)) + " URL's, " + str(len(domains)) + " domeinen, " +
          str(len(venues)) + " locaties.")


if __name__ == "__main__":
    main()
