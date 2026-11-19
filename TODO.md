# TODO — Nog ergens naar binnen

- [ ] **Friesland uitbreiden:** ontbrekende cafés en andere publiek toegankelijke alcoholhoreca per gemeente en dorp vinden en verifiëren, inclusief de Waddeneilanden.
- [ ] **Coördinaten aanvullen:** 59 Friese records zonder `geo` (18-11; 549 Friese locaties). [Werkrij van 7-11](reports/friesland-geocode-werkrij-2026-11-07.md) bevat 54; extra: De Walrus, Gudzekop, De Visserman (Stavoren), De Dining (Vlieland), Lazy Lemon. Adressen/publieksingangen verifiëren; niet gokken.
- [ ] **Sluitings- en laatste-toegangstijden aanvullen:** [Friese werklijst](reports/friesland-onbekende-sluituren-met-website-2026-11-07.md) afwerken, met prioriteit voor nachthoreca. Exacte sluituren bij o.a. Raadhuys, Kafee 8 en Njoy blijven onbekend; beginuren staan al in master.
- [ ] **Open gegevensconflicten oplossen:** Leeuwarden (Bar Sybs/De Doelebar: beide adres 2A; afzonderlijke publieksingangen nog controleren; Café De Rus: 16:00 bevestigd, sluituren alleen derden), Drachten (Café-Bar 't Skûtsje: eigen sites blijven tegenstrijdig over woensdag — jouwweb wo–zo, intropagina do–zo; sluituur onbekend, geen aanname), Sneek ('t Singeltje, NOAH, 't Ouwe Vat).
- [ ] **Bar Bascule (Leeuwarden):** laatste toegang 03:00 staat al in master. APV Leeuwarden gebied 1 staat open tot 05:00 toe, maar bewijst geen feitelijk sluituur. Eigen site noemt 7 avonden, elders 6; rooster verifiëren (18-11-2026). https://www.barbascule.nl/deurbeleid
- [ ] **Broncontrole 18-11:** De Stee (Leeuwarden): tijdelijke sluiting staat al in master; heropening blijven controleren. De Skoffel (Heerenveen): beginuren staan al in master; sluituren onbekend, afwijkende oude zaterdagbron verifiëren. https://www.destee.nl/nieuwe-site/ · https://www.deskoffel.nl/

- [ ] **Gedeelde adressen:** Harlingen: Gewoán Sven huidig Voorstraat 64 (VVV/KvK 2026), Lanen 39 historisch bevestigd door gemeentelijke terrasaanvraag 2017; Rednick op Voorstraat 64 alleen gidsvermelding, actuele zelfstandigheid onduidelijk. Leeuwarden Blokhuisplein 40 (Proefverlof, Café de Bak en Gudzekop: aparte concepten; publieksingangen controleren). Grou en Sneek al als verschillende concepten onderbouwd; geen dubbelen.

- [ ] **Friesland D0 afronden:** dekkings- en datakwaliteit controleren en vaststellen wanneer landelijke uitbreiding kan beginnen.

- [ ] **Heropeningen controleren:** Le Journal, De Prediker, Club 1841, Fenix en Karaokebar de Nachtegaal.
- [ ] **Kaartprestaties en navigatie testen** bij uitbreiding naar meer regio's en duizenden locaties.
- [ ] **Landelijke uitbreiding:** regio-indeling uitwerken en horeca per provincie toevoegen zodra Friesland D0 is afgerond.

Controle 18-11: master via blob-SHA volledig gelezen (773 locaties: Friesland 549, Utrecht 224; 59 zonder geo; 6 gedeelde adresgroepen). `fetch_file` blijft leeg voor groot JSON; gebruik `fetch_blob` met SHA `d55ee6ac3da2d4425ed81e691605afe85b135b5f`. Geen brongeverifieerde locatiecorrecties; master ongewijzigd.

Controle 18-11 (vervolg): gedeelde adressen Vlieland Dorpsstraat 61 (ZeeVaert/'t Praethuys: twee aparte WestCord-zaken) en Nes Marten Janszenstraat 3 (De Brouwerij/De Lichtboei: café en discotheek) officieel bevestigd; beide geen dubbelen. Bestaande masterrecords en roosters kloppen met de gecontroleerde bronnen; geen wijziging in `data/venues.json`. Bronnen: https://westcordhotels.nl/hotel/hotel-de-wadden/ · https://www.delichtboei-ameland.nl/contact

Controle 18-11 (adresgroepen): alle 773 masterrecords via blob gelezen. Grou: openbaar Oostergoo versus besloten verhuurcafé d'Oude Oost. Sneek: Hanenburg en Bodega y Tapas afzonderlijke concepten. Blokhuisplein 40: drie verschillende formules, fysieke ingangen nog open. Harlingen: Rednick historisch versus actueel Gewoán Sven; opvolging niet bewezen. Geen masterwijzigingen.

Controle 19-11: Bar Sybs-adres in master gecorrigeerd van Oude Doelesteeg 2 naar 2a (Visit Leeuwarden + actuele KvK-vermelding; overheidslijst uit 2023 vermeldt nog 2). Publieksingang niet vastgesteld. Harlingen: recente gids plaatst Gewoán Sven op Lanen 39, niet Voorstraat 64; opvolgingsclaim daarom niet bevestigd. Bronnen: https://www.visitleeuwarden.com/en/locaties/1361140994/bar-sybs · https://www.compadex.com/nl/businesses/nl/bar-sybs-97008966-62281399 · https://uitgaanskaart.nl/cafe/harlingen

Controle 19-11 (Harlingen): alle 773 records via actuele blob-SHA gelezen. Gewoán Sven staat correct op Voorstraat 64; gemeenteblad 2017 bevestigt Lanen 39 als ouder adres, gemeenteblad 2020 en VVV 2026 bevestigen Voorstraat 64. VVV publiceert ma–do 12–22, vr/za 12–00, zo 12–20, maar derden tonen afwijkende uren: nog niet in master overgenomen. Rednick blijft onbevestigd. Bronnen: https://www.harlingenwelkomaanzee.nl/nl/locaties/2163265506/cafe-gewoan-sven · https://repository.officiele-overheidspublicaties.nl/externebijlagen/exb-2017-10160/1/bijlage/exb-2017-10160.pdf · https://zoek.officielebekendmakingen.nl/gmb-2020-283120.pdf
