# TODO — Nog ergens naar binnen

- [ ] **Friesland uitbreiden:** ontbrekende cafés en andere publiek toegankelijke alcoholhoreca per gemeente en dorp vinden en verifiëren, inclusief de Waddeneilanden.
- [ ] **Coördinaten aanvullen:** 59 Friese records zonder `geo` (18-11; 549 Friese locaties). [Werkrij van 7-11](reports/friesland-geocode-werkrij-2026-11-07.md) bevat 54; extra: De Walrus, Gudzekop, De Visserman (Stavoren), De Dining (Vlieland), Lazy Lemon. Adressen/publieksingangen verifiëren; niet gokken.
- [ ] **Sluitings- en laatste-toegangstijden aanvullen:** [Friese werklijst](reports/friesland-onbekende-sluituren-met-website-2026-11-07.md) afwerken, met prioriteit voor nachthoreca. Exacte sluituren bij o.a. Raadhuys, Kafee 8 en Njoy blijven onbekend; beginuren staan al in master.
- [ ] **Open gegevensconflicten oplossen:** Leeuwarden (Bar Sybs: master vermeldt nr. 2, externe bronnen bevestigen 2A (18-11); adrescorrectie en publieksingang nog verifiëren; De Doelebar/Bar Sybs: gedeeld adres 2A en afzonderlijke publieksingangen nog controleren; Café De Rus: 16:00 bevestigd, sluituren alleen derden), Drachten (Café-Bar 't Skûtsje: eigen sites blijven tegenstrijdig over woensdag — jouwweb wo–zo, intropagina do–zo; sluituur onbekend, geen aanname), Sneek ('t Singeltje, NOAH, 't Ouwe Vat).
- [ ] **Bar Bascule (Leeuwarden):** laatste toegang 03:00 staat al in master. APV Leeuwarden gebied 1 staat open tot 05:00 toe, maar bewijst geen feitelijk sluituur. Eigen site noemt 7 avonden, elders 6; rooster verifiëren (18-11-2026). https://www.barbascule.nl/deurbeleid
- [ ] **Broncontrole 18-11:** De Stee (Leeuwarden): tijdelijke sluiting staat al in master; heropening blijven controleren. De Skoffel (Heerenveen): beginuren staan al in master; sluituren onbekend, afwijkende oude zaterdagbron verifiëren. https://www.destee.nl/nieuwe-site/ · https://www.deskoffel.nl/

- [ ] **Gedeelde adressen:** Harlingen Voorstraat 64 (Rednick historisch; Gewoán Sven actueel — opvolging nog bevestigen); Leeuwarden Blokhuisplein 40 (Proefverlof, Café de Bak en Gudzekop: aparte concepten; exacte publieksingangen controleren). Grou Nieuwe Kade 1 en Sneek Wijde Noorderhorne 2 zijn in master al als verschillende functies/concepten onderbouwd; geen dubbelen.

- [ ] **Friesland D0 afronden:** dekkings- en datakwaliteit controleren en vaststellen wanneer landelijke uitbreiding kan beginnen.

- [ ] **Heropeningen controleren:** Le Journal, De Prediker, Club 1841, Fenix en Karaokebar de Nachtegaal.
- [ ] **Kaartprestaties en navigatie testen** bij uitbreiding naar meer regio's en duizenden locaties.
- [ ] **Landelijke uitbreiding:** regio-indeling uitwerken en horeca per provincie toevoegen zodra Friesland D0 is afgerond.

Controle 18-11: master via blob-SHA volledig gelezen (773 locaties: Friesland 549, Utrecht 224; 59 zonder geo; 6 gedeelde adresgroepen). `fetch_file` blijft leeg voor groot JSON; gebruik `fetch_blob` met SHA `d55ee6ac3da2d4425ed81e691605afe85b135b5f`. Geen brongeverifieerde locatiecorrecties; master ongewijzigd.

Controle 18-11 (vervolg): gedeelde adressen Vlieland Dorpsstraat 61 (ZeeVaert/'t Praethuys: twee aparte WestCord-zaken) en Nes Marten Janszenstraat 3 (De Brouwerij/De Lichtboei: café en discotheek) officieel bevestigd; beide geen dubbelen. Bestaande masterrecords en roosters kloppen met de gecontroleerde bronnen; geen wijziging in `data/venues.json`. Bronnen: https://westcordhotels.nl/hotel/hotel-de-wadden/ · https://www.delichtboei-ameland.nl/contact

Controle 18-11 (adresgroepen): alle 773 masterrecords via blob gelezen. Grou: openbaar Oostergoo versus besloten verhuurcafé d'Oude Oost. Sneek: Hanenburg en Bodega y Tapas afzonderlijke concepten. Blokhuisplein 40: drie verschillende formules, fysieke ingangen nog open. Harlingen: Rednick historisch versus actueel Gewoán Sven; opvolging niet bewezen. Geen masterwijzigingen.
