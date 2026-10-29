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
6. De actieve **uurlijkse TODO-automatisering** kan kleine batches zelfstandig hervatten; bij handmatig 'ga door' gebeurt dat eveneens. Elke uitvoering moet worden gevalideerd en hier worden vastgelegd. De wekelijkse databasecheck is een afzonderlijke taak. Voeg toekomstige fasen aan de lijst toe in plaats van grote verzoeken stilzwijgend af te breken.

## Huidige momentopname (29 oktober 2026)

- 408 locaties in de masterdatabase: 224 Utrecht, 184 Friesland.
- Friesland: **175/184** met kaartcoördinaten; **9** zonder exacte match.
- Friesland: **5/184** met websiteveld ingevuld; **11** met een bron voor sluitingsinformatie. Dit is **geen** garantie dat die bronnen of de uren volledig juist zijn.
- Friesland: **1** record met een bron voor laatste toegang.
- Nieuwe Friese records zijn grotendeels **onbevestigde gidsvermeldingen**. De bulkimport bewijst niet dat de genoemde zaken bestaan, nog open zijn, aan de vermelde adressen zitten of alcohol schenken.
- De automatische wekelijkse controle is op Utrecht én heel Friesland ingesteld, met regionale roulatie; het afgeleide bronnenregister bevat Friese vindplaatsen.

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

- [ ] **B1. Wisselende sluitingstijden met bekende laatste toegang:** onderzoek en herstel de tijdsfilterlogica. Voorbeeld: Café Fokk's heeft expliciete uiterste toegang 02:00, maar geen vaste sluiting per dag; momenteel verdwijnt het café bij actieve tijdsfilters. Toon geen gegarandeerde opening zonder onderbouwing.
- [ ] **B2. Verificatie van regio-automatiek op de live site** in plaats van alleen code- en geografische functietests; ook overgang in beide richtingen en terugscrollen testen.
- [ ] **B3. Datakwaliteitsrapport per regio**: website ontbreekt, sluiting onbekend, laatste toegang onbekend, geen exacte coördinaten, leeftijd van broncontrole en mogelijke duplicaten.
- [ ] **B4. Publicatiecontrole na grotere datasets**: workflowstatus, geocoder-meldingen, kaartweergave en performance mobiel/desktop.
- [ ] **B5. Beoordeel of de regio-indeling op termijn per gemeente/stad of dynamisch op kaartzicht moet werken**, zodat Friesland niet één enorme lijst wordt.

### C. Utrecht en terugkerende checks

- [ ] **C1. Utrechtse bestaande records blijven roulerend op actualiteit controleren**.
- [ ] **C2. Controle aangekondigde (her)openingen in Utrecht op de werkelijke openingsdatum**, niet op basis van aankondigingen automatisch als open markeren.
- [ ] **C3. Periodieke ontdekking van nieuwe horecalocaties in Friesland en Utrecht**, met bronregister en directe GitHub-updates van bevestigde wijzigingen.

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

- [ ] **D3. Pas de wekelijkse controle-automatisering aan zodra uitbreiding echt is gestart** zodat ook nieuwe Nederlandse regio's in een gedocumenteerde roulatie komen. Behoud hercontroles van Utrecht en Friesland; voorkom overlap/conflicten met de uurlijkse TODO-automatisering.
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

- **2026-10-29 — Landelijke vervolgfase gepland:** na het halen van D0 eerst landelijke regio-indeling D1, daarna D2 per provincie, vervolgens D3 landelijke updatechecks. Er zijn door dit besluit nog geen nieuwe provincies of locaties toegevoegd.
- **2026-10-29 — Startlijst aangemaakt** op basis van de reeds gedane GitHub-wijzigingen en resterende fouten. Eerste vervolgstap: **A1**.
