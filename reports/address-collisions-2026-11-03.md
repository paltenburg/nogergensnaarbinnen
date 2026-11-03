# Adrescollisies in masterdatabase — structurele controle 2026-11-03

Bron: `data/venues.json`, blob `d74ca9103f4432157dc3b904fc020bf1b9204d2b`. Controle op exact genormaliseerde combinatie `region|city|address` (lowercase/trim). **768 records, 702 met geo-object, 66 zonder.** Dit is een interne datacontrole, **geen** nieuwe externe bronverificatie en geen bewijs van dubbele ondernemingen.

**16 adresparen** (dezelfde straat-/huisnummertekst). Geen IDs of markers automatisch samengevoegd.

| Regio | Adres | Records | Vervolg |
|---|---|---|---|
| Utrecht | Kanaalweg 30 | Bar Pleur / Café Keet | afzonderlijke exploitatie en ingang toetsen |
| Utrecht | Concordiastraat 80 | De Ping Pong Club / De Troef Spelletjescafé | concepten/ingangen toetsen |
| Utrecht | Vredenburgkade 11 | Het Gegeven Paard / Kitchen Bar Danel / TivoliVredenburg | drie concepten op één adres; gedeelde marker en toegangsvoorwaarden toetsen |
| Utrecht | Domplein 17 | Lebowski / Lebowski's Speakeasy | afzonderlijke toegang/uren toetsen |
| Utrecht | Twijnstraat 15 | Manners Cocktail Lounge / Papi's Comfort Kitchen | opeenvolgende versus gelijktijdige exploitatie toetsen |
| Utrecht | Jaarbeursplein 6A | Beatrix Theater Royal Bar / Restaurant Queens | afzonderlijke exploitatie/toegang toetsen |
| Utrecht | Voorstraat 102 | Bassment / ULU Bar | opeenvolgende versus gelijktijdige exploitatie toetsen |
| Utrecht | Oudegracht 158 | Wijnbar Vino / Winkel van Sinkel | afzonderlijke ruimte/ingang toetsen |
| Utrecht | Lucasbolwerk 24 | Stadsschouwburg Utrecht / Zindering | afzonderlijke concepten/toegang toetsen |
| Friesland | Harlingen, Voorstraat 64 | Café Rednick / Café Gewoán Sven | **prioriteit**: Rednick historisch, Gewoán Sven actuele VVV/KvK volgens bestaande recordnotities; niet als twee actuele cafés tellen zonder bewijs |
| Friesland | Vlieland, Dorpsstraat 61 | ZeeVaert Bistrobar / Eetcafé 't Praethuys | verschillende WestCord-concepten, exacte ingangen toetsen |
| Friesland | Grou, Nieuwe Kade 1 | Café d'Oude Oost / Hotel Restaurant Oostergoo | café volgens bestaande notitie mogelijk alleen zaalhuur; reguliere vrije inloop toetsen |
| Friesland | Nes, Marten Janszenstraat 3 | Café De Brouwerij / Discotheek De Lichtboei | exploitant presenteert afzonderlijk café en disco; niet blind samenvoegen |
| Friesland | Sneek, Wijde Noorderhorne 2 | Hanenburg Stadscafé / Bodega y Tapas | afzonderlijke concepten; Bodega zonder geo-object |
| Friesland | Leeuwarden, Blokhuisplein 40 | Proefverlof / Café de Bak | afzonderlijke ruimtes/ingangen op complex toetsen |

**Interpretatie:** 16 extra records boven de unieke adresgroepen; 15 adresgroepen met meer dan één record (Vredenburgkade heeft drie). Hetzelfde adres is geen bewijs van een fout: gedeelde gebouwen en afzonderlijke horecaconcepten zijn mogelijk. Controleer per paar primaire exploitant, actuele naam, eigen publieksingang en exacte marker vóór een datamutatie. Geen horecagegevens of geocodes gewijzigd.

**Overige controle:** alle aanwezige `date_closures` hebben `start <= end`, `source` en `checked_on`; nul structurele overtredingen gevonden. W45-audit volgens actuele TODO reeds afgerond, W46 nog niet verschuldigd (09-11-2026 10:00 CET). Friesland D0 blijft open.

**Hervatten:** eerst Harlingen Rednick/Gewoán Sven en Utrecht Bassment/ULU als mogelijke opvolgingsparen met primaire actuele bronnen; daarna de overige adresparen, en de openstaande Meerpaal BAG-unit. Dit rapport is geen bewijs dat die verificaties al zijn uitgevoerd.
