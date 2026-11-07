# Gedeelde adressen: controle 7 november 2026

## Methode
Statische scan van de actuele `data/venues.json` (768 records) op exact dezelfde genormaliseerde combinatie regio, plaats en adres. **Een gedeeld adres is geen bewezen duplicaat**: horecaonderdelen, opvolgers en afzonderlijke publieksingangen kunnen hetzelfde BAG-adres gebruiken. Deze scan vergelijkt de huidige records; geen nieuwe BAG-opvraging, fysieke toegangstest of live deploymentcontrole.

**Uitkomst:** 15 adresgroepen met 31 records (Utrecht 9 groepen / 19 records, Friesland 6 groepen / 12 records). 768 unieke venue-IDs; 66 records zonder geo-object/coördinaten (Friesland 54, Utrecht 12). Geen automatisch samenvoegen of hernoemen.

## Friese gedeelde adressen (prioriteit)
| Plaats en adres | Venue-IDs | Uitkomst / eerstvolgende actie |
|---|---|---|
| Harlingen, Voorstraat 64 | `cafe-rednick-harlingen-11c235b`; `cafe-gewoan-sven-harlingen-dccd931` | Mogelijke opvolging, niet bewezen als twee huidige exploitanten. Vraag gedateerd exploitantbewijs en opvolgingsdatum; laat Rednick voorlopig onzeker. |
| Grou, Nieuwe Kade 1 | `cafe-d-oude-oost-grou-006c9f7`; `hotel-restaurant-oostergoo-grou-20261031` | Eigen https://oostergoo.nl/ noemt Café d'Oude Oost als te huren ruimte; eigen https://oostergoo.nl/praktische-info/ noemt restaurant dagelijks 08–22. **Restauranturen niet op besloten café toepassen**. Gedeeld adres verklaarbaar; zelfstandige vrije café-inloop onbevestigd. |
| Vlieland, Dorpsstraat 61 | `zeevaert-bar-rotisserie-vlieland-a8283d7`; `eetcafe-t-praethuys-vlieland-20261030` | Twee horecaconcepten van WestCord. Eigen sites https://westcordhotels.nl/restaurants/zeevaert-bar-pizza/ en https://westcordhotels.nl/restaurants/praethuys/ zijn afzonderlijk; VVV https://vlieland.net/nl/bedrijf/t-praethuys noemt voor Praethuys **Dorpsstraat 59**, terwijl master/eigen bron 61 gebruiken. BAG/publieksingang afzonderlijk vaststellen, niet op basis van gids verplaatsen. |
| Sneek, Wijde Noorderhorne 2 | `hanenburg-stadscafe-sneek-20261031`; `bodega-y-tapas-sneek-20261101` | Twee concepten onder één dak met eigen links/rechts; bericht van 7 juli 2025 https://www.grootsneek.nl/nieuws/in-bedrijf/114882/feestelijke-opening-van-hanenburg-stadscafe-en-bodega-y-tapas en actuele lokale gidsen https://www.sneek.nl/zien-doen/bodega-y-tapas en https://www.friesland.nl/nl/locaties/4056358571/hanenburg-stadscafe ondersteunen afzonderlijke concepten. Niet als duplicaat verwijderen. |
| Leeuwarden, Blokhuisplein 40 | `drink-eetlokaal-proefverlof-leeuwarden-20261031`; `cafe-de-bak-leeuwarden-20261102` | Gedeeld complex; exacte publieksingang, zelfstandige opening en overlap verifiëren. |
| Nes, Marten Janszenstraat 3 | `cafe-de-brouwerij-nes-20261101`; `discotheek-de-lichtboei-nes-20261101` | Gedeeld adres; bevestig afzonderlijke exploitatie en feitelijke toegangsvoorwaarden, geen samenvoeging zonder bewijs. |

## Utrecht (9 gedeelde adressen)
- Kanaalweg 30: Bar Pleur / Café Keet — opvolging of verschillende concepten controleren.
- Voorstraat 102: Bassment / ULU Bar — opvolging of verschillende concepten controleren.
- Jaarbeursplein 6A: Beatrix Theater (Royal Bar) / Restaurant Queen’s — theaterbar versus zelfstandig publiek restaurant controleren.
- Concordiastraat 80: De Ping Pong Club / De Troef spelletjescafé — publieksingangen controleren.
- Vredenburgkade 11: Het Gegeven Paard / Kitchen Bar Danel / TivoliVredenburg — drie concepten, geen automatische duplicaatconclusie.
- Domplein 17: Lebowski / Lebowski’s Speakeasy — afzonderlijke toegang en reserveringsvereisten controleren.
- Twijnstraat 15: Manners Cocktail Lounge / Papi’s Comfort Kitchen — twee horecaconcepten in één pand.
- Lucasbolwerk 24: Stadsschouwburg Utrecht / Zindering — theater en horecaonderdeel.
- Oudegracht 158: Wijnbar VINO / Winkel van Sinkel — afzonderlijke exploitatie en uren controleren.

## Status en vervolg
Dit is een **statische volledigheids- en overlapcontrole** plus drie Friese externe bronvergelijkingen (Grou, Vlieland, Sneek), **geen weekaudit**. Op 7 november is W46 nog niet verschuldigd (vanaf maandag 9 november 10:00 CET). **0 records toegevoegd, gewijzigd of verwijderd; 0 geocodes toegekend.** Geen code- of CI-test nodig voor dit rapport; echte mobiele interactie en Pages-deployment niet gecontroleerd.

Volgende: 1) Friese gedeelde adressen Harlingen, Leeuwarden en Nes met actuele primaire exploitantbronnen; 2) Vlieland 59/61 met exacte BAG-adressen en ingangen; 3) 54 Friese geocodegaten met PDOK/BAG, zonder benaderde coördinaten; 4) W46 roulerende controles per actieve regio vanaf 9 november 10:00.
