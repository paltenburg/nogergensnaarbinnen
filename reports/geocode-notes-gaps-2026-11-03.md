# Geocodes zonder onderzoeksnotitie — 2026-11-03

Statische controle van de actuele master (blob `f8aa3ea2abfcef93e6d5cf5d03756f4271f18b25`). **Geen externe BAG-query, geen geocodes toegevoegd.** Dit is een kwaliteits-/documentatiequeue, niet een lijst met bewezen exacte adressen.

- Totaal 768 records; 66 zonder marker.
- 27 expliciet geblokkeerd; 2 aliasrecords zonder eigen marker.
- **22 niet-geblokkeerde, niet-aliasrecords zonder geocode_notes**: voor deze records ontbreekt een vastgelegde reden of uitslag van een eerdere geocodepoging. Dat betekent niet dat nooit is gezocht.

| Regio | Plaats | Zaak | Adres | ID |
|---|---|---|---|---|
| utrecht | Utrecht | Brouwerij Maximus | Pratumplaats 2A | `brouwerij-maximus-f8e6ec6` |
| utrecht | Utrecht | Olivier | Achter Clarenburg 6a | `olivier-ad29c9c` |
| utrecht | Utrecht | Rum Club | Oudegracht aan de Werf 111 | `rum-club-623b9bd` |
| friesland | Leeuwarden | Bar Sybs | Oude Doelesteeg 2 | `bar-sybs-leeuwarden-71570c8` |
| friesland | Dokkum | Bar Dancing De Ponderosa | Oranjewal 48 | `bar-dancing-de-ponderosa-dokkum-6bf890f` |
| friesland | Wirdum | Hotel Eetcafé Duhoux | Greate Buorren 4-8 | `hotel-eetcafe-duhoux-wirdum-20261030` |
| friesland | Heeg | Eetcafé De Boeier | Harinxmastrjitte 69-73 | `eetcafe-de-boeier-heeg-20261030` |
| friesland | IJlst | Bar 't Kypmantsje | Popmawal 2-3 | `bar-t-kypmantsje-ijlst-20261031` |
| friesland | Driezum | Café Cafetaria Us Thús | Van Sytzemaweg 6 | `cafe-cafetaria-us-thus-driezum-20261031` |
| friesland | Anjum | Hotel Restaurant Toxopeus | De Singel 5 | `hotel-restaurant-toxopeus-anjum-20261031` |
| friesland | Anjum | Het Raadsel van de Wadden | Oostmahorn 31 | `het-raadsel-van-de-wadden-anjum-20261031` |
| friesland | Anjum | De Blije Dobber | Oostmahorn 29 | `de-blije-dobber-oostmahorn-20261031` |
| friesland | Lemmer | Restaurant De Brekken | Brekkenweg 10 | `restaurant-de-brekken-lemmer-20261031` |
| friesland | Lemmer | Club 24 | Kortestreek 24-25 | `club-24-lemmer-20261031` |
| friesland | Sloten | Restaurant Het Bolwerk | Voorstreek 116-117 | `restaurant-het-bolwerk-sloten-20261031` |
| friesland | Gaastmeer | Boppe de Golle | Munkedyk 2 | `boppe-de-golle-gaastmeer-20261031` |
| friesland | Appelscha | Restaurant De Bosberg | De Bosberg 3 | `restaurant-de-bosberg-appelscha-20261031` |
| friesland | Sint Jacobiparochie | Restaurant De Zwarte Haan | Nieuwebildtdijk 428 | `restaurant-de-zwarte-haan-sint-jacobiparochie-20261031` |
| friesland | Nes | Restaurant Mr Sandman | Strandweg 42 | `mr-sandman-nes-20261101` |
| friesland | Midsland Noord | Gastrobar Onder de Pannen | Heereweg 22 | `gastrobar-onder-de-pannen-midsland-noord-20261101` |
| friesland | Midsland aan Zee | Strandpaviljoen De Branding | Midsland aan Zee 457 | `strandpaviljoen-de-branding-midsland-aan-zee-20261101` |
| friesland | Jirnsum | Eetcafé 't Slûske (Jachthaven Sneekerhof) | Wjiteringswei 23 | `eetcafe-t-sluske-jirnsum-20261102` |

## Vervolg

Voor elk record: eerst BAG/PDOK exact adres en eventuele huisnummertoevoeging controleren. Bij geen exacte match `geocode_notes` vullen met echte datum, zoekterm en bron/uitkomst; alleen bij verifieerbare ingang `geo` toevoegen. **Geen** huisnummerreeks of strandadres stilzwijgend op één adrespunt plaatsen. Verwijder geen bestaande onzekerheidsmarkeringen. Controleer expliciet dat bestaande `duplicate_of`-aliases geen marker krijgen.
