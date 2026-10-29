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
6. Geen achtergrondverwerking veronderstellen: vervolgwerk gebeurt in nieuwe beurten wanneer de gebruiker daarom vraagt. De wekelijkse geplande databasecheck is een aparte, bestaande taak.

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

- **2026-10-29 — Startlijst aangemaakt** op basis van de reeds gedane GitHub-wijzigingen en resterende fouten. Eerste vervolgstap: **A1**.
