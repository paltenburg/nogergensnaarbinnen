# Geocode-triage: blokkades en adresvormen — 2026-11-05

Statische inspectie van actuele master `data/venues.json` (blob `a461ea13b570b788af451e138c6b234124a9e2fd`). Geen externe BAG- of horecaverificatie uitgevoerd.

- Totaal: 768 locaties; 66 zonder numerieke marker.
- Expliciet `geocode_blocked`: 27; **niet automatisch geocoderen**.
- Niet geblokkeerd met huisnummerreeks: 14; de geocoder accepteert geen reeks als exact BAG-adres; eerst ingang/nummer verifiëren.
- Niet geblokkeerd met enkelvoudig adres of andere adresvorm: 25; afzonderlijk PDOK/BAG-match en ingang controleren.
- Friesland 54, Utrecht 12 zonder marker.

Deze triage is geen geocode-fix. Alle ontbrekende markers blijven onbekend.

## blocked (27)

| ID | Adres | Plaats | Regio |
|---|---|---|---|
| `bar-bet-039c462` | Wed 1 | Utrecht | utrecht |
| `bar-pleur-4b33634` | Kanaalweg 30 | Utrecht | utrecht |
| `grand-cafe-levels-harlingen-fe09531` | Grote Bredeplaats 24 | Harlingen | friesland |
| `grand-cafe-it-skippershus-koudum-04a6af3` | De Kuilart 1 | Koudum | friesland |
| `eetcafe-wever-oldeholtpade-83fe9b9` | Hoofdweg 124 | Oldeholtpade | friesland |
| `spoarke-blije-blije-0cf8177` | Farrewei 22 | Blije | friesland |
| `fryske-pub-echtenerbrug-20261031` | Hellingpad 5 | Echtenerbrug | friesland |
| `de-doelebar-leeuwarden-20261031` | Oude Doelesteeg 2A | Leeuwarden | friesland |
| `lekkernij-dokkum-20261031` | Waagstraat 9/11 | Dokkum | friesland |
| `enoteca-wine-and-bites-harlingen-20261101` | Grote Bredeplaats 5/5A | Harlingen | friesland |
| `zandzeebar-formerum-aan-zee-20261101` | Badweg Formerum 6 | Formerum aan Zee | friesland |
| `cafe-restaurant-beaufort-makkum-20261101` | De Holle Poarte 2 | Makkum | friesland |
| `de-tuinkamer-rinsma-gorredijk-20261101` | Lijnbaan 10 | Gorredijk | friesland |
| `bodega-y-tapas-sneek-20261101` | Wijde Noorderhorne 2 | Sneek | friesland |
| `noflik-by-zwigt-bosma-langweer-20261101` | Buorren 31 | Langweer | friesland |
| `bij-fier-sneek-20261102` | 1e Oosterkade 24 | Sneek | friesland |
| `cafe-de-peer-gorredijk-20261102` | Hoofdstraat 70 | Gorredijk | friesland |
| `sahara-food-vibes-drachten-20261102` | Zuidkade 73 | Drachten | friesland |
| `skybar-wtc-leeuwarden-20261102` | Heliconweg 32 | Leeuwarden | friesland |
| `grand-cafe-wrald-drachten-20261102` | Moleneind Noordzijde 4A | Drachten | friesland |
| `het-paviljoen-dokkum-oostrum-20261102` | Tichelwei 32E | Oostrum (bij Dokkum) | friesland |
| `bar-bascule-leeuwarden-20261102` | Ruiterskwartier 93 | Leeuwarden | friesland |
| `bar-cafe-cambuur-leeuwarden-20261102` | Insulindestraat 44 | Leeuwarden | friesland |
| `eetcafe-baba-bolsward-20261102` | Bargefenne 16 | Bolsward | friesland |
| `de-grillerije-franeker-20261102` | Groenmarkt 14 | Franeker | friesland |
| `cheung-kwong-franeker-20261102` | Zilverstraat 3-5 | Franeker | friesland |
| `eetcafe-de-meerpaal-earnewald-20261103` | Koaidyk 10 | Earnewâld | friesland |

## range (14)

| ID | Adres | Plaats | Regio |
|---|---|---|---|
| `bar-patine-917d047` | Oudegracht 101-103 | Utrecht | utrecht |
| `bierlokaal-de-luifel-5c5dab3` | Neude 35-36 | Utrecht | utrecht |
| `cafe-de-beurs-d9ec97a` | Neude 37-39 | Utrecht | utrecht |
| `het-oude-tolhuys-20261026` | Weg naar Rhijnauwen 13-15 | Utrecht | utrecht |
| `kabul-a-gogo-c3390cf` | Gietijzerstraat 3-5 | Utrecht | utrecht |
| `le-french-cafe-20261026` | Voorstraat 16-18 | Utrecht | utrecht |
| `le-journal-1b1cfeb` | Neude 32-34 | Utrecht | utrecht |
| `eetcafe-spinoza-leeuwarden-0c56246` | Eewal 50-52 | Leeuwarden | friesland |
| `cafe-restaurant-de-smidte-workum-f7236eb` | Súd 106-108 | Workum | friesland |
| `hotel-eetcafe-duhoux-wirdum-20261030` | Greate Buorren 4-8 | Wirdum | friesland |
| `eetcafe-de-boeier-heeg-20261030` | Harinxmastrjitte 69-73 | Heeg | friesland |
| `bar-t-kypmantsje-ijlst-20261031` | Popmawal 2-3 | IJlst | friesland |
| `club-24-lemmer-20261031` | Kortestreek 24-25 | Lemmer | friesland |
| `restaurant-het-bolwerk-sloten-20261031` | Voorstreek 116-117 | Sloten | friesland |

## single (25)

| ID | Adres | Plaats | Regio |
|---|---|---|---|
| `brouwerij-maximus-f8e6ec6` | Pratumplaats 2A | Utrecht | utrecht |
| `olivier-ad29c9c` | Achter Clarenburg 6a | Utrecht | utrecht |
| `rum-club-623b9bd` | Oudegracht aan de Werf 111 | Utrecht | utrecht |
| `bar-sybs-leeuwarden-71570c8` | Oude Doelesteeg 2 | Leeuwarden | friesland |
| `cafe-bar-t-skutsje-drachten-7164f2f` | Noordkade 106b | Drachten | friesland |
| `grand-cafe-bowling-de-kaden-drachten-be2b006` | Zuidkade 75 | Drachten | friesland |
| `bar-dancing-de-ponderosa-dokkum-6bf890f` | Oranjewal 48 | Dokkum | friesland |
| `wijn-tap-eethuis-amicaal-grou-090fbca` | Halbertsmaplein 14 | Grou | friesland |
| `eetcafe-de-pleats-woudsend-0d71b79` | Weachswal 2 | Woudsend | friesland |
| `it-reade-hynder-wommels-0121f4b` | ’t Noard 6 | Wommels | friesland |
| `karaokebar-de-nachtegaal-sneek` | Kleine Kerkstraat 4 | Sneek | friesland |
| `cafe-cafetaria-us-thus-driezum-20261031` | Van Sytzemaweg 6 | Driezum | friesland |
| `hotel-restaurant-toxopeus-anjum-20261031` | De Singel 5 | Anjum | friesland |
| `het-raadsel-van-de-wadden-anjum-20261031` | Oostmahorn 31 | Anjum | friesland |
| `de-blije-dobber-oostmahorn-20261031` | Oostmahorn 29 | Anjum | friesland |
| `restaurant-de-brekken-lemmer-20261031` | Brekkenweg 10 | Lemmer | friesland |
| `boppe-de-golle-gaastmeer-20261031` | Munkedyk 2 | Gaastmeer | friesland |
| `restaurant-de-bosberg-appelscha-20261031` | De Bosberg 3 | Appelscha | friesland |
| `restaurant-de-zwarte-haan-sint-jacobiparochie-20261031` | Nieuwebildtdijk 428 | Sint Jacobiparochie | friesland |
| `mr-sandman-nes-20261101` | Strandweg 42 | Nes | friesland |
| `de-groene-weide-hoorn-terschelling-20261101` | Dorpsstraat 81 | Hoorn | friesland |
| `gastrobar-onder-de-pannen-midsland-noord-20261101` | Heereweg 22 | Midsland Noord | friesland |
| `strandpaviljoen-kaap-hoorn-20261101` | Badweg Hoorn 16 | Hoorn | friesland |
| `strandpaviljoen-de-branding-midsland-aan-zee-20261101` | Midsland aan Zee 457 | Midsland aan Zee | friesland |
| `eetcafe-t-sluske-jirnsum-20261102` | Wjiteringswei 23 | Jirnsum | friesland |

Volgende actie: controleer eerst de enkelvoudige niet-geblokkeerde Friese adressen met live BAG/PDOK én de exploitantingang; controleer de reeksadressen op het exacte ingangsnummer; hef expliciete blokkades alleen op met bewijs. Geen coördinaten uit nabijgelegen zaken kopiëren.
