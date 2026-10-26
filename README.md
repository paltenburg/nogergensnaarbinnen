# nogergensnaarbinnen

Gratis, zelfstandige interactieve horecakaart. **Utrecht is de eerste regio**, maar de naam en gegevensstructuur zijn niet aan Utrecht gebonden.

## Vermelding van AI-inhoud

**Alle teksten, beschrijvingen en samengestelde locatie-informatie op de website zijn met AI gegenereerd of verwerkt.** Het register is mede op externe bronnen gebaseerd, maar niet alle gegevens zijn onafhankelijk of actueel gecontroleerd. Controleer praktische informatie bij de betreffende locatie. Deze melding staat zichtbaar bij de filters en ook in de detailvensters op de kaart.

## Gegevens

De **masterdatabase** is [`data/venues.json`](data/venues.json). Ze bevat aanvankelijk **195 locaties** uit het projectbestand *Utrecht_horeca_alcohol_sluitingstijden_2026-10-25.xlsx*, onderzocht op 25 oktober 2026. Van **33 locaties ontbrak een adres** in die bron. De data is niet uitputtend, en openingstijden zijn niet beschikbaar; alleen sluitingstijden zijn opgenomen. Zonder openingstijden kan de app **geen 'nu open'** garanderen.

Sluitingstijd onder openingsdag: **vrijdag 02:00 betekent zaterdagochtend 02:00**. Speciale waarden: `?` onbekend, `—` gesloten volgens bron, `Event` eventafhankelijk, `Varieert` geen vaste tijd. Onzekere locaties zijn gemarkeerd. De applicatie sluit expliciet besloten locaties standaard uit.

## Filter op aankomsttijd

De hoofdvraag is: **waar kunnen we nog naar binnen?** Kies de uitgaansavond en het tijdstip waarop je wilt aankomen, of klik **Nu** om de actuele Nederlandse tijd te gebruiken. De filtering is **strikt later dan** de gekozen tijd: bij 04:00 valt een locatie met sluitingstijd 04:00 af; 05:00 blijft staan.

Tijdstippen na middernacht horen bij de ochtend na de gekozen uitgaansavond: *vrijdagavond, 04:00* betekent zaterdagochtend 04:00. De Nu-knop kiest voor tijdstippen vóór 12:00 de voorgaande uitgaansavond.

**Belangrijke beperking:** met alleen sluitingstijden kunnen we niet garanderen dat een zaak op dat moment daadwerkelijk open is of dat bezoekers dan nog worden toegelaten. Daarvoor zijn ook openingsuren en laatste-toegangstijden nodig. Onbekende sluitingstijden worden bij een actief tijdsfilter niet als open weergegeven.

## Publiceren via GitHub Pages (gratis)

1. Maak een **openbare** repository `nogergensnaarbinnen` op https://github.com/new (zonder eigen domein nodig).
2. Plaats de inhoud van deze map in de root van de `main`-branch. Geen extra build of Node.js nodig.
3. Ga naar **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. De workflow **nogergensnaarbinnen publiceren** draait bij wijzigingen op `main`. Zo nodig start je die handmatig onder **Actions → nogergensnaarbinnen publiceren → Run workflow**. Eerst worden straatadressen via de gratis Nederlandse PDOK Locatieserver opgezocht; alleen matches met juiste stad, straat en huisnummer worden opgeslagen. Daarna wordt de statische site gepubliceerd.
5. De openbare URL wordt `https://<gebruikersnaam>.github.io/nogergensnaarbinnen/` (bijvoorbeeld `https://paltenburg.github.io/nogergensnaarbinnen/`).

**Let op:** GitHub Actions moet `contents: write` mogen gebruiken om gecontroleerde coördinaten naar `data/venues.json` te committen. De workflow vraagt deze permissie aan. Als een repository-instelling dit tegenhoudt, ontbreken nog sommige kaartmarkers totdat de geocodes elders zijn opgeslagen.

## Lokaal openen

In de map van deze repository:

```bash
python -m http.server 8000
```

Open `http://localhost:8000/` in de browser. Bij een lokale eerste run zijn nog geen coördinaten beschikbaar, totdat `python scripts/geocode.py` via een internetverbinding is uitgevoerd.

## Uitbreiden naar andere steden

Voeg in `data/venues.json` een regio toe in `regions` en locaties met `region` gelijk aan die regio-ID en de juiste `city`, `country` en `address`. De viewer laat vervolgens automatisch meerdere regio's zien. Het geocodescript ondersteunt Nederlandse adressen via PDOK; voor buitenlandse regio's is een aparte geocoder nodig.

## Bronverversing

Het oorspronkelijke XLSX-bestand blijft als projectbron beschikbaar. Een nieuwe import kan met `python scripts/export_from_xlsx.py /pad/naar/bron.xlsx`; hiervoor is `artifact_tool` nodig. Bestaande geocodes met dezelfde stabiele locatie-ID blijven behouden. Meer praktisch: bijgewerkte locaties kunnen rechtstreeks in `data/venues.json` worden aangepast, daarna opnieuw gepubliceerd.

## Techniek / gebruik

- Static HTML/CSS/JavaScript + [Leaflet](https://leafletjs.com/) en kaarttegels van [OpenStreetMap](https://www.openstreetmap.org/copyright), met zichtbare attributie.
- Gratis Nederland-geocodering via [PDOK Locatieserver](https://www.pdok.nl/pdok-locatieserver), uitsluitend bij het publiceren, **niet bij iedere bezoeker**.
- De site is openbaar en heeft geen login, analytics, serverbackend of betaalde API-sleutels.
- Gebruik de OpenStreetMap-tegels volgens hun [Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/).

Dit is een eerste versie; er is nog geen productie-geocodingrun of echte GitHub Pages-publicatie uitgevoerd in de ZIP.