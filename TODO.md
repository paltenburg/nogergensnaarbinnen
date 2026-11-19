# TODO — Nog ergens naar binnen

- [ ] **Friesland uitbreiden:** ontbrekende cafés en andere publiek toegankelijke alcoholhoreca per gemeente en dorp vinden en verifiëren, inclusief de Waddeneilanden.
- [ ] **Coördinaten aanvullen:** 59 Friese records zonder `geo` (19-11; 549 Friese locaties; Leeuwarden 9, Drachten 4, Sneek/Anjum elk 3). [Werkrij van 7-11](reports/friesland-geocode-werkrij-2026-11-07.md) bevat 54; extra: De Walrus, Gudzekop, De Visserman (Stavoren), De Dining (Vlieland), Lazy Lemon. Adressen/publieksingangen verifiëren; niet gokken.
- [ ] **Sluitings- en laatste-toegangstijden aanvullen:** [Friese werklijst](reports/friesland-onbekende-sluituren-met-website-2026-11-07.md) afwerken, met prioriteit voor nachthoreca. Exacte sluituren bij o.a. Raadhuys, Kafee 8 en Njoy blijven onbekend; beginuren staan al in master.
- [ ] **Open gegevensconflicten oplossen:** Leeuwarden (Bar Sybs/De Doelebar: beide adres 2A; afzonderlijke publieksingangen nog controleren; Café De Rus: 16:00 bevestigd, sluituren alleen derden), Drachten (Café-Bar 't Skûtsje: eigen sites blijven tegenstrijdig over woensdag — jouwweb wo–zo, intropagina do–zo; sluituur onbekend, geen aanname), Sneek ('t Singeltje, NOAH, 't Ouwe Vat).
- [ ] **Bar Bascule (Leeuwarden):** laatste toegang 03:00 staat al in master. APV Leeuwarden gebied 1 staat open tot 05:00 toe, maar bewijst geen feitelijk sluituur. Eigen site noemt 7 avonden, elders 6; rooster verifiëren (18-11-2026). https://www.barbascule.nl/deurbeleid
- [ ] **Broncontrole 18-11:** De Stee (Leeuwarden): tijdelijke sluiting staat al in master; heropening blijven controleren. De Skoffel (Heerenveen): beginuren staan al in master; sluituren onbekend, afwijkende oude zaterdagbron verifiëren. https://www.destee.nl/nieuwe-site/ · https://www.deskoffel.nl/

- [ ] **Gedeelde adressen:** Harlingen: Gewoán Sven huidig Voorstraat 64 (VVV/KvK 2026), Lanen 39 historisch bevestigd door gemeentelijke terrasaanvraag 2017; Rednick op Voorstraat 64 alleen gidsvermelding, actuele zelfstandigheid onduidelijk. Leeuwarden Blokhuisplein 40 (Proefverlof, Café de Bak en Gudzekop: aparte concepten; publieksingangen controleren). Grou en Sneek al als verschillende concepten onderbouwd; geen dubbelen.

- [ ] **Friesland D0 afronden:** dekkings- en datakwaliteit controleren en vaststellen wanneer landelijke uitbreiding kan beginnen.

- [ ] **Heropeningen controleren:** Le Journal, De Prediker, Club 1841, Fenix en Karaokebar de Nachtegaal.
- [ ] **Kaartprestaties en navigatie testen** bij uitbreiding naar meer regio's en duizenden locaties.
- [ ] **Landelijke uitbreiding:** regio-indeling uitwerken en horeca per provincie toevoegen zodra Friesland D0 is afgerond.

Controle 19-11: alle 773 masterrecords via actuele blob-SHA gecontroleerd (549 Friesland, 224 Utrecht); 59 Friese `geo` ontbreken. Geen dubbele IDs of Friese coördinaten buiten regiogrenzen gevonden. Historische controles ingekort; onopgeloste punten staan hierboven. `data/venues.json` ongewijzigd.
