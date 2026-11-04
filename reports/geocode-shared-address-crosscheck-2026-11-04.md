# Geocode crosscheck: exact gedeeld adres — 4 november 2026

## Methode
Actuele `data/venues.json` via GitHub Contents API ingelezen (768 records). Alle 66 records zonder numerieke `geo.lat` én `geo.lon` vergeleken met de overige records op **exact genormaliseerd adres + plaats + regio**. Er zijn **2 kandidaten**; dit zijn **geen** bewezen ontbrekende markers die zonder meer gekopieerd kunnen worden. Gecontroleerd op 2026-11-04 (Europe/Amsterdam). Geen externe BAG-API-bevraging gedaan.

## Friesland — Wijde Noorderhorne 2, Sneek
- Ontbrekende marker: `bodega-y-tapas-sneek-20261101`, Bodega y Tapas Sneek.
- Bestaande BAG-adresmarker: `hanenburg-stadscafe-sneek-20261031`, Hanenburg Stadscafé, 53.0332207 / 5.6579261; master vermeldt `Wijde Noorderhorne 2, 8601EB Sneek`.
- https://www.sneek.nl/zien-doen/bodega-y-tapas noemt Bodega op exact dit adres en biedt drankjes, sangria en cocktails aan; verwijst expliciet ook naar Hanenburg.
- https://www.sneek.nl/en/see-do/hanenburg-stadscafe beschrijft Hanenburg op hetzelfde adres als buur van Bodega.
- https://www.grootsneek.nl/nieuws/in-bedrijf/113705/iris-de-jong-opent-op-woensdag-9-juli-nieuwe-horecazaak-in-sn (28-06-2025) beschrijft twee verschillende publieksconcepten: Bodega links en Hanenburg rechts.
- **Besluit:** hetzelfde BAG-pand en twee afzonderlijke concepten zijn bronmatig bevestigd, maar **afzonderlijke ingang/markerpositie niet**. Geen identieke marker overgenomen: de bestaande `geocode_blocked`-notitie is bewust behouden. Geen sluituur of laatste toegang afgeleid. Eerst afzonderlijke ingangspositie of expliciet kaartbeleid voor gedeelde BAG-adresmarkers bepalen.

## Utrecht — Kanaalweg 30, Utrecht
- Ontbrekende marker: `bar-pleur-4b33634`, Bar Pleur.
- Bestaande BAG-adresmarker: `cafe-keet-b7e333b`, Café Keet, 52.0719708 / 5.1096777.
- https://www.cafekeet.nl/ en https://kanaal30.mom/ bevestigen Café Keet op Kanaalweg 30, inclusief bier en wijn; actuele opening ma–vr 09:00–18:00, zaterdag gesloten, zondag 13:00–18:00 volgens Kanaal30.
- In de actuele master is voor Bar Pleur reeds een **adresconflict Kanaalweg 30 versus 50** gedocumenteerd met https://maats.cc/collections/events/products/maats-x-pas-normal-studios-pas-ttt en https://www.debuik.nl/utrecht/top-10/nieuwe-horeca-in-het-najaar-van-2026-deze-utrechtse-zaken-gaan-of-zijn-net-open. Deze bronnen zijn hier niet als bevestiging van actuele exploitatie gebruikt.
- **Besluit:** **geen** Keet-marker aan Bar Pleur toekennen. Eerst de exploitant/ingang/adresnummer en actuele publieke alcoholhoreca verifiëren. `geocode_blocked` blijft terecht.

## Resultaat en vervolg
- 66 ontbrekende geocodes exact intern vergeleken; **2 adresmatches**, **0 bewezen geocodecorrecties**, **0 masterrecords gewijzigd**, **0 nieuwe locaties**, **0 wekelijkse auditlocaties**.
- Volgende geocodeactie: adressen zonder intern matchende marker tegen exacte PDOK/BAG-adresgegevens controleren, beginnend met Leeuwarden Eewal 50–52 / Oude Doelesteeg 2 en Drachten Noordkade 106b / Zuidkade 75. Geen afgeleide coördinaten gokken.
- W45 eerder afgerond volgens TODO; W46 vanaf 2026-11-09 10:00 CET verschuldigd. Friesland D0 blijft open. Geen live Pages- of mobiele kaartinteractie getest.
