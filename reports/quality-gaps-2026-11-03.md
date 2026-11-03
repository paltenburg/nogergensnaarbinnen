# Datakwaliteit en bronconflicten — 3 november 2026

Bron: actuele `data/venues.json`, blob `d74ca9103f4432157dc3b904fc020bf1b9204d2b`. Interne inventarisatie van bestaande gegevens; **geen** nieuwe horeca-openingstijden vastgesteld. De tellingen zijn momentopnamen, geen bewezen foutaantallen.

| Regio | Records | Selectie 'Nog te controleren' | Zonder website | Zonder geo | Alle zeven sluitdagen onbekend |
|---|---:|---:|---:|---:|---:|
| Utrecht | 224 | 17 | 67 | 12 | 60 |
| Friesland | 544 | 110 | 117 | 54 | 271 |
| **Totaal** | **768** | **127** | **184** | **66** | **331** |

'Alle zeven sluitdagen onbekend' betekent dat het `closing`-object ontbreekt of uitsluitend `?`/null bevat. Het zegt niet dat de zaak open is. Zonder geo betekent geen `geo`-object, niet automatisch een foutieve geocode. Laatste toegang is niet uit generieke sluitingstijden afleidbaar.

## Adresconflicten opnieuw onderzocht (3 november 2026)

**Harlingen, Voorstraat 64 — Café Rednick / Café Gewoán Sven.** De actuele regionale bezoekersorganisatie beschrijft Gewoán Sven als eetcafé/sportsbar met publiek drankbezoek, adres Voorstraat 64 en weekrooster ma–do 12–22, vr/za 12–00, zo 12–20: https://www.harlingenwelkomaanzee.nl/nl/locaties/2163265506/cafe-gewoan-sven . KvK-afgeleide bron (bijgewerkt 12 februari 2026) bevestigt naam, SBI drinkgelegenheden en adres: https://www.compadex.com/nl/businesses/nl/cafe-gewoan-sven-57858616-27259390 . De gids https://fr.restaurantguru.com/Cafe-Gewoan-Sven-Harlingen-Friesland toont afwijkende weekuren (bijgewerkt mei 2026). Uitgaanskaart vermeldt nog Rednick op hetzelfde adres: https://uitgaanskaart.nl/cafe/harlingen . **Conclusie:** actuele zelfstandige Rednick-exploitatie niet bevestigd; Gewoán Sven is de onderbouwde actuele kandidaat. Geen tweede actuele zaak aannemen. VVV-uren niet overnemen als bedrijfseigen bevestigd; exploitantcontact nodig voor sluituur en laatste toegang. De master had dit conflict reeds correct als onzeker vastgelegd; daarom geen datamutatie.

**Utrecht, Voorstraat 102 — Bassment / ULU Bar.** Historische gemeentelijke nachtvisie beschrijft Bassment als verhuurbare discotheek zonder eigen programma: https://www.utrecht.nl/fileadmin/uploads/documenten/7.extern/wob/2023/2023-0208_Utrechtse_Nachtvisie_en_Nachtcultuur/Bijlagen_1_deelbesluit_2.pdf . https://www.allebiz.nl/bassment-utrecht-06-20803094 markeert de oude vermelding als gesloten; https://www.cylex.nl/bedrijf/bassment-utrecht-13021966.html toont desondanks oude reguliere uren. De huidige ULU-website https://ulubar.nl/ is al als officiële bron in de master opgenomen. **Conclusie:** historische Bassment-uren niet als actueel overnemen; afzonderlijke huidige Bassment-exploitatie of aparte verdieping niet bewezen. Geen records samenvoegen of verwijderen zonder exploitantbevestiging.

## Exact vervolg

1. Controleer actuele eigen communicatie/telefonische bevestiging van Gewoán Sven en ULU/Bassment over zelfstandige exploitatie, laatste toegang en sluitingstijden.
2. Prioriteer Friese 54 records zonder geo op exacte BAG-match en 110 niet-gevalideerde selecties; wijzig alleen op hard bewijs.
3. Verifieer de overige adresgroepen in `reports/address-collisions-2026-11-03.md`, te beginnen Twijnstraat 15 en Harlinger opvolgingsinformatie.
4. W45 is volgens actuele TODO al afgehandeld; W46 pas vanaf 9 november 2026 10:00 CET verschuldigd. Friesland D0 nog niet behaald. Geen live mobiele kaarttest in deze controle.
