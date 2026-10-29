# Doorlopende takenlijst — Nog ergens naar binnen

**Bijgewerkt:** 2026-10-29  
**Masterdatabase:** `data/venues.json`  
**Status:** doorlopend; niet af. Deze lijst is bedoeld als hervatpunt bij **"ga door"**.

## Werkwijze bij grote opdrachten

1. Splits een grote opdracht in kleine, controleerbare stappen. Leg ze hier vast **voordat** werk onafgerond blijft.
2. Kies bij "ga door" de eerstvolgende open taak. Vraag niet opnieuw naar reeds bekende eisen.
3. Voer per beurt een afgebakende batch helemaal uit: onderzoek, gegevens vastleggen, GitHub-commit, validatie en deze takenlijst bijwerken.
4. Bewaar bij elke batch welke locaties/velden echt zijn geverifieerd, bron-URL's, controledatums, nog openstaande twijfel en eventuele fouten.
5. Markeer taken pas als voltooid na controle. Lukt een stap niet, documenteer het obstakel en ga zo nodig door met een onafhankelijke stap.
6. De actieve **uurlijkse TODO-automatisering** doet zowel doorlopende uitbreidingsbatches als de periodieke broncontroles hieronder. Er is geen tweede actieve wekelijkse schrijver. Bij handmatig 'ga door' wordt dezelfde lijst gebruikt. Elke uitvoering moet worden gevalideerd en hier worden vastgelegd.

## Huidige momentopname (29 oktober 2026)

- 408 locaties in de masterdatabase: 224 Utrecht, 184 Friesland.
- Friesland: **175/184** met kaartcoördinaten; **9** zonder exacte match.
- Friesland: **5/184** met websiteveld ingevuld; **11** met een bron voor sluitingsinformatie. Dit is **geen** garantie dat die bronnen of de uren volledig juist zijn.
- Friesland: **1** record met een bron voor laatste toegang.
- Nieuwe Friese records zijn grotendeels **onbevestigde gidsvermeldingen**. De bulkimport bewijst niet dat de genoemde zaken bestaan, nog open zijn, aan de vermelde adressen zitten of alcohol schenken.
- Periodieke controles zijn opgenomen in **de uurlijkse taak** met een wekelijkse controlefrequentie en **dynamische roulatie over alle actieve regio's** (momenteel Utrecht en Friesland). De aparte wekelijkse automatisering is uitgeschakeld. Het afgeleide bronnenregister bevat Friese vindplaatsen.

## Eerstvolgende uitvoerbare stap

**Sneek — eerste controlebatch van maximaal vijf locaties:** controleer
`Rock Café Sneek`, `NOAH Eetcafé Sneek`, `Club 1841`,
`Grand Café Het Plein` en `Café 't Singeltje`.

Voor **ieder** record: controleer of naam, adres en huidige exploitatie kloppen; zoek de officiële website; zoek het echte weekrooster, sluiting en eventuele uiterste toegang; noteer eigen/andere bronnen en controledatum; leg onbekenden als onbekend vast. Controleer ook eventuele hernoeming, verhuizing en duplicaten. Commit daarna de gecontroleerde wijzigingen naar `data/venues.json`, controleer of ze juist zijn opgeslagen, en vul hieronder de voortgang aan.

## Taken

### A. Kwaliteit en volledigheid van Friesland

- [ ] **A1. Sneek — pilotbatch (5 locaties)** zoals hierboven, inclusief verifieerbare brongegevens en status van eventuele niet-bestaande/verouderde records.
- [ ] **A2. Sneek — overige bestaande locaties** (kleine batches) controleren; ontbrekende cafés zoeken via officiële zaken, lokale gidsen en OSM-kandidaten.
- [ ] **A3. Leeuwarden** — huidige records controleren en ontbrekende uitgaanshoreca toevoegen, in batches.
- [ ] **A4. Heerenveen en Drachten** — verificatie en aanvullingen, in batches.
- [ ] **A5. Harlingen, Franeker, Bolsward en Dokkum** — verificatie en aanvullingen.
- [ ] **A6. Joure, Lemmer, Workum, Wolvega, Grou en overige plaatsen** — verificatie en aanvullingen.
- [ ] **A7. Alle vier de Friese Waddeneilanden** — controles per eiland, inclusief seizoensopening en eventafhankelijke horeca.
- [ ] **A8. Kleine dorpen en nog ontbrekende plaatsen** — systematische gemeentegewijze ontdekking, niet alleen de huidige 59 woonplaatsen.
- [ ] **A9. Alle 9 Friese locaties zonder exacte geocodering** — adres en bestaande zaak controleren; alleen echte BAG-/locatiematches toevoegen.
- [ ] **A10. Provinciebrede duplicaten, verouderde namen en gesloten zaken** — ook records met overeenkomend adres maar afwijkende naam onderzoeken.
- [ ] **A11. Vastgelegde bronkwaliteit** — per veld onderscheid maken tussen officiële bron, gidsvermelding en onbekend; controleer of URL's echt bij de zaak horen.

### B. App en datalogica

- [x] **B1. Wisselende sluitingstijden met bekende laatste toegang:** filter ondersteunt nu een geverifieerde sluitingsmarge in `closing_range` (per dag `earliest`/`latest`) en gebruikt de bekende laatste toegang als afzonderlijke, harde grens. Café Fokk's toont `02:00–04:00` en prominent `Binnen tot 02:00`; vóór 02:00 wordt het café meegenomen, vanaf 02:00 uitgesloten. Onbekende sluiting zonder aantoonbare laatste toegang blijft bij een tijdsfilter uitgesloten. JS-syntax en tijdgrensgevallen getest op 29-10-2026; live-browsercontrole blijft een aparte B2/B4-taak.
- [ ] **B2. Verificatie van regio-automatiek op de live site** in plaats van alleen code- en geografische functietests; ook overgang in beide richtingen en terugscrollen testen.
- [ ] **B3. Datakwaliteitsrapport per regio**: website ontbreekt, sluiting onbekend, laatste toegang onbekend, geen exacte coördinaten, leeftijd van broncontrole en mogelijke duplicaten.
- [ ] **B4. Publicatiecontrole na grotere datasets**: workflowstatus, geocoder-meldingen, kaartweergave en performance mobiel/desktop.
- [ ] **B5. Beoordeel of de regio-indeling op termijn per gemeente/stad of dynamisch op kaartzicht moet werken**, zodat Friesland niet één enorme lijst wordt.

## Periodieke broncontrole — uitgevoerd door dezelfde uurlijkse taak

Er is **geen afzonderlijke wekelijkse automatisering meer**. De uurlijkse taak is de enige eigenaar van **alle handmatige wijzigingen** aan `data/venues.json`, `TODO.md` en het bronregister. De oude wekelijkse taak is op 29 oktober 2026 uitgeschakeld. Alle onderstaande terugkerende controles blijven echter onderdeel van de werkzaamheden.

**Reikwijdte:** de periodieke controle geldt voor **alle regio's met opgenomen horecalocaties in de actuele masterdatabase** `data/venues.json`; dus niet alleen Utrecht en Friesland. Leid bij het begin van iedere audit automatisch de actieve regio-ID's af uit de aanwezige locaties en `db.regions`. Nieuwe provincies/gemeenten/steden vallen **onmiddellijk bij de volgende wekelijkse audit** binnen de scope, zonder handmatige update van de automatisering. Regio's zonder locaties hoeven nog niet op actuele zaken gecontroleerd te worden, maar blijven wel kandidaat voor het aparte uitbreidingswerk.

**Frequentieregel:** vanaf **maandag 2 november 2026 om 10:00 Nederlandse tijd** is per ISO-week een auditronde verschuldigd. De uurlijkse taak moet vaststellen of de huidige weekaudit nog openstaat. Maak aan het begin een **regiolijst op basis van de actuele database**, met voor elke regio een uitvoerbare, roulerende geografische auditdeelbatch. Voer per uur bij voorrang één open auditdeelbatch uit, leg per regio de status vast en werk vervolgens de volgende af; een audit is pas volledig als **alle actieve regio's** die week een daadwerkelijk onderzochte batch hebben gehad. Nieuwe regio die gedurende de week wordt toegevoegd: voeg die aan de nog openstaande auditscope toe, ook als de ronde eerder als klaar was vastgelegd. Raakt de uitvoering overbelast, verdeel de audit in extra uurlijkse batches en behoud capaciteit voor urgente fouten en verdere uitbreiding; documenteer achterstand en geef geen vals 'voltooid' signaal.

**Per regio per wekelijkse ronde:**
1. **Geografische roulatie en ontdekking:** onderzoek een haalbare selectie steden/dorpen/wijken/locaties; wissel deze iedere week volgens het voorgaande auditlog, zodat het onderzoek op termijn de hele regio omvat (ook kleine kernen en eilanden). Zoek nieuwe, heropende, hernoemde en gesloten publiek toegankelijke cafés, pubs, bars, clubs en soortgelijke horeca waar alcohol verkrijgbaar is; vergelijk officiële sites, lokale gidsen, actueel nieuws en waar nodig OSM-kandidaten.
2. **Gegevens controleren:** verifieer adres, naam, actuele exploitatie, officiële website, dagrooster, werkelijke sluiting, uiterste toegang, seizoens- en evenementenafwijkingen, geocodes en duplicaten. Noteer bron-URL en werkelijke controledatum; vul geen onbekenden met aannames of APV-maxima.
3. **Bijzondere vervolgpunten:** blijf de Utrechtse aangekondigde heropeningen van Le Journal (2 november 2026), Nomono (30 oktober) en De Prediker (half november) volgen zolang relevant, zonder een aankondiging als reeds geopende zaak aan te merken. Frieslands gemeenten en vier Waddeneilanden blijven expliciet onderdeel van de roulatie; andere provincies krijgen zodra ze records hebben **dezelfde** aandacht.
4. **Opslaan:** de uurlijkse taak is de enige geplande schrijver naar `data/venues.json`; schrijf uitsluitend geverifieerde correcties via GitHub, telkens op basis van de recentste versie en SHA. De bestaande GitHub Actions kunnen het afgeleide bronnenregister regenereren. Bij conflicten opnieuw inlezen en reconciliëren; nooit blind overschrijven.
5. **Loggen:** noteer **per actieve regio en per ISO-week** gecontroleerde plaatsen/deelgebieden, brondomeinen/URL's, aantal nagekeken/gewijzigd/toegevoegd/afgewezen, onzekerheden en commit-SHA. Bewaar tevens de **volgende** geografische roulatiestap. Zet voor onafgeronde regio's 'open' of 'in behandeling', nooit 'afgerond'. Een afgeronde weekronde betekent niet dat alle horecalocaties van die regio opnieuw zijn nagekeken; uitsluitend de afgesproken roulerende steekproef/auditbatch.

**Voorbeeld huidige scope (2026-10-29):** Utrecht-stad en Friesland, omdat dit de enige twee regio's in de database zijn. Zodra Groningen, Drenthe of een andere regio daadwerkelijk wordt toegevoegd, verschijnt deze automatisch in de auditplanning. Een aparte wijziging van het schema is daarvoor niet vereist.

**Auditstatus bij inrichting (2026-10-29):**
- Laatst volledig afgeronde auditweek: **geen geregistreerd**.
- Eerstvolgende audit: **ISO-week 2026-W45**, vanaf **2026-11-02 10:00 Europe/Amsterdam**.
- Roulatiestatus per actieve regio: **nog niet gestart** — maak de huidige regiolijst bij de eerstvolgende audit aan, registreer per regio werkelijk onderzochte plaatsen en houd de volgende deelgebieden bij.
- Geen audit als 'afgerond' markeren zonder werkelijk uitgevoerde controles.

### Auditlog (aanvullen na iedere ronde)

- Nog geen volledig uitgevoerde ronde.

### C. Utrecht en terugkerende checks

- [ ] **C1. Utrechtse bestaande records blijven roulerend op actualiteit controleren**.
- [ ] **C2. Controle aangekondigde (her)openingen in Utrecht op de werkelijke openingsdatum**, niet op basis van aankondigingen automatisch als open markeren.
- [ ] **C3. Periodieke ontdekking van nieuwe horecalocaties in álle actieve regio's** (aanvankelijk Utrecht en Friesland), met bronregister en directe GitHub-updates van bevestigde wijzigingen.

## D. Uitbreiden naar heel Nederland — **ná voldoende controle van Friesland**

**Besluit gebruiker (29 oktober 2026):** breid het horecaproject uit naar de **rest van Nederland** zodra Friesland *zo'n beetje klaar* is. Dit is expliciet een **vervolgfase**, dus nu geen ongecontroleerde nationale bulkimport. Regio-indeling mag voorlopig pragmatisch worden gekozen en later op aanwijzing van de gebruiker worden aangepast. Ook na de landelijke start blijft Friesland in de reguliere kwaliteits- en updatecyclus.

### D0. Startcriterium / oplevermoment Friesland

Leg in een voortgangsnotitie vast of de volgende voorwaarden zijn gehaald:

- [ ] Iedere Friese gemeente, plus de vier bewoonde Waddeneilanden, is ten minste één keer systematisch onderzocht op ontbrekende publieke uitgaanshoreca (ook kleine kernen).
- [ ] Van **minstens circa 80%** van de Friese bestaande records zijn de identiteit, het adres en de actuele exploitatiestatus met een passende, aantoonbare bron gecontroleerd. De overige records zijn expliciet als onbevestigd of voor hercontrole gemarkeerd; vermoedelijk gesloten of foutief is niet gelijk aan geverifieerd.
- [ ] Voor **alle** Friese records is een gerichte poging gedaan de eigen officiële site te vinden; gevonden sites zijn bevestigd op naam/adres, niet slechts overgenomen van een zoekhit. Ontbrekende sites blijven expliciet onbekend.
- [ ] Sluitings- en laatste-toegangstijden zijn waar beschikbaar **per locatie** nagezocht, met bron en controledatum; onbekende tijden zijn niet ingevuld op basis van vergunningen, categorieën of aannames. De belangrijke B1-tijdsfilterfout (bekende uiterste toegang, wisselende sluiting) is onderzocht en opgelost of als gedocumenteerde beperking veilig afgehandeld.
- [ ] Geconstateerde structurele fouten in kaart, filtering, duplicaten en data-import zijn opgelost, of er is een concrete veilige aanpak en een aparte open taak. Er zijn geen kritieke fouten die nationale uitbreiding onbruikbaar maken.

**Startbesluit:** wanneer deze criteria in hoofdzaak zijn gehaald, registreer in het voortgangslog **"Friesland voldoende afgerond voor landelijke uitbreiding"**, met aantallen en resterende risico's. Dit vereist **geen volledige dekking of 100% bekende openingstijden**. Laat de bestaande Friese onderhoudstaken doorlopen. Begin daarna zelfstandig aan D1. Als een criterium de voortgang onredelijk blokkeert, noteer waarom en kies een onderbouwde afwijking; niet stilzwijgend overslaan.

### D1. Voorlopige regio-indeling

- [ ] **D1. Regiostructuur ontwerpen en testen.** Gebruik initieel **provincies** als hanteerbare landelijke regio's, en splits bij behoefte uit naar steden/gemeenten. Behoud bestaande IDs en deeplinks: `friesland` blijft heel Friesland, `utrecht` blijft **Utrecht-stad**; voor het **overige deel van provincie Utrecht** kan `utrecht-provincie` worden toegevoegd. Migratie of hernoemen alleen inclusief URL-compatibiliteit. Nog geen lege regio's publiceren.
- [ ] **D1a. Kaartnavigatie geschikt maken voor nabijgelegen regio's.** De huidige automatische regiokeuze via dichtstbijzijnde locatie/18 km is ontworpen voor Utrecht versus Friesland en kan rond aangrenzende provinciegrenzen onrustig schakelen. Evalueer grenzen, zichtbaar kaartgebied, hysterese en schaal; voorkom schommelingen en kaartterugsprongen. Zorg dat gebruikers op de kaart van het ene gebied naar het andere kunnen blijven pannen, ook over een grens heen.
- [ ] **D1b. Beperk omvang van lijsten en kaartmarkers.** Test de performance bij duizenden records op mobiel en desktop; laad of render op kaartbereik en gekozen regio, zonder dat de aankomsttijdlogica wordt aangetast.

### D2. Landelijke ontdekkings- en controlebatches

- [ ] **D2a. Groningen en Drenthe** — bronneninventaris, stads- en dorpsdekking, officiële sites, individuele weekroosters en laatste toegang; kleine controleerbare batches.
- [ ] **D2b. Overijssel en Flevoland** — idem.
- [ ] **D2c. Gelderland** — idem, inclusief steden én kleine plaatsen.
- [ ] **D2d. Noord-Holland** — idem, inclusief Texel; bij omvangrijke stedelijke clusters in kleine batches werken.
- [ ] **D2e. Zuid-Holland** — idem.
- [ ] **D2f. Zeeland** — idem, inclusief eilanden en seizoenszaken.
- [ ] **D2g. Noord-Brabant en Limburg** — idem.
- [ ] **D2h. Provincie Utrecht buiten Utrecht-stad** — idem; voorkom duplicatie met al opgenomen Utrechtse records.
- [ ] **D2i. Landelijke dekkingsaudit** — controleer dat alle twaalf provincies, gemeenten, bewoonde eilanden en ook kleinere plaatsen systematisch aan bod zijn gekomen; documenteer ontbrekende delen.

**Regel per batch:** niet alleen namen importeren. Controleer per zaak naam + adres, werkelijke status, alcoholaanbod/toegang, officiële website, sluiting, laatste toegang, bron en datum. Leg onbekenden vast als onbekend. Gebruik alleen `data/venues.json` als master; werk het afgeleide bronnenregister bij. Rapporteer expliciet volledigheid van de batch. Vermijd dubbeltellingen en schat nooit dat alles is gevonden.

### D3. Landelijke periodieke actualisatie

- [x] **D3. Koppel wekelijkse controleroulatie dynamisch aan alle actieve regio's in de database.** Iedere toegevoegde regio wordt vanzelf onderdeel van de volgende weekaudit; er is geen tweede schrijvende automatisering. Controleer de werking bij de eerstvolgende daadwerkelijke nieuwe regio en behoud de normale checks op Utrecht en Friesland.
- [ ] **D3a. Houd per regio/gemeente bij** wanneer een ontdekkings- en actualiteitsronde echt is uitgevoerd, welke bronnen gecontroleerd zijn en waar nog hiaten zijn.

## Al afgerond (beperkte betekenis)

- [x] Één masterdatabase `data/venues.json` voor beide regio's.
- [x] Eerste bulkimport van 184 *voorlopige* Friese records; nadrukkelijk geen volledige onderzoekscontrole.
- [x] Bronregister uitgebreid met Friese vindplaatsen en weekcheck aangepast.
- [x] Geocodescript gerepareerd; 175 Friese records hebben coördinaten.
- [x] Regio wisselt bij kaartnavigatie automatisch mee, zonder dat het kaartbeeld opnieuw wordt ingepast (codecontrole en geografische tests).
- [x] Café Fokk's (Sneek): officiële website, vermeld weekbeginuur en uiterste toegang vastgelegd; de wisselende eindtijd bewust niet als vaste sluiting vastgelegd.

## Bijwerken na elke batch

Voeg hieronder een korte regel toe, bijvoorbeeld:
`2026-10-29 | A1 | 5 bekeken, 3 geverifieerd, 1 gesloten, 1 onzeker | commit <SHA> | volgende: A2`.

### Voortgangslog

- **2026-10-29 — B1 afgerond (logische tests):** Café Fokk's bron https://cafefokks.nl/info/ geeft open vanaf 21:00, sluit tussen 02:00 en 04:00, laatste toegang 02:00. Tijdgrenzen 20:30, 21:00, 23:30, 00:30, 01:30, 01:59, 02:00, 02:30 en 03:30 getest; één bestaand record met exacte sluiting opnieuw getest. Wijzigingen index.html commit `8067adbaf57f2c8d17c38fa472e335af5df5970a` en data/venues.json commit `ac0a275cee88ba46c51e9e966ae54962eaf1703c`. Live UI-verificatie niet uitgevoerd.
- **2026-10-29 — Auditscope gegeneraliseerd:** de weekaudit controleert voortaan alle actieve database-regio's en voegt nieuwe regio's automatisch toe; niet hardcoded Utrecht/Friesland. Per regio een geografische deelbatch en weeklog; D3-configuratie afgerond, eerste echte uitvoering nog niet getest.
- **2026-10-29 — Automatiseringen samengevoegd:** de aparte wekelijkse databasecheck is uitgeschakeld; de uurlijkse uitvoering beheert voortaan ook de wekelijkse audit en houdt het auditlog bij. 
- **2026-10-29 — Landelijke vervolgfase gepland:** na het halen van D0 eerst landelijke regio-indeling D1, daarna D2 per provincie, vervolgens D3 landelijke updatechecks. Er zijn door dit besluit nog geen nieuwe provincies of locaties toegevoegd.
- **2026-10-29 — Startlijst aangemaakt** op basis van de reeds gedane GitHub-wijzigingen en resterende fouten. Eerste vervolgstap: **A1**.
