# Statische marker- en BAG-adresconsistentie — 2026-11-07

Controle op actuele `data/venues.json` (geen externe BAG-aanroep of terreininspectie). **768** records, **702** met coördinaten, **66** zonder coördinaten. **701** markers waarvan `geo.matched_address` na normalisatie begint met het geregistreerde `address`. **1** niet-overeenkomende omschrijvingen; geen automatische correctie.

## Afwijkende omschrijving
- `strandpaviljoen-sjoerd-nes-ameland-8e2f7a9` — Strandpaviljoen Sjoerd, Nes: adres `Strand van Nes (postadres Strandweg 65, Buren)`; matched `Strandpaviljoen Sjoerd, strand van Nes, Ameland`; methode `Officiële website GPS`. Dit is een strandlocatie met officiële GPS-omschrijving, **geen aangetoonde fout**.

## Exact gedeelde coördinaten
**13** groepen, **27** records. Deze kunnen verschillende horecaformules op hetzelfde BAG-adres zijn; niet automatisch samenvoegen. IDs:
- Utrecht, Voorstraat 102: `bassment-7cf6c51`, `ulu-bar-20261026`
- Utrecht, Jaarbeursplein 6a: `beatrix-theater-royal-bar-6a50c76`, `restaurant-queens-4d55fcd`
- Utrecht, Concordiastraat 80: `de-ping-pong-club-3e4df3c`, `de-troef-spelletjescafe-7a45c78`
- Utrecht, Vredenburgkade 11: `het-gegeven-paard-b8698f6`, `kitchen-bar-danel-4c5a5ea`, `tivolivredenburg-869d218`
- Utrecht, Domplein 17: `lebowski-4b66c94`, `lebowskis-speakeasy-2a1a46d`
- Utrecht, Twijnstraat 15: `manners-cocktail-lounge-1a48ee6`, `papis-comfort-kitchen-bf4bc0e`
- Utrecht, Lucasbolwerk 24: `stadsschouwburg-utrecht-fc1adf8`, `zindering-3782b89`
- Utrecht, Oudegracht 158: `wijnbar-vino-ae6ef03`, `winkel-van-sinkel-27c2af5`
- Harlingen, Voorstraat 64: `cafe-rednick-harlingen-11c235b`, `cafe-gewoan-sven-harlingen-dccd931`
- Grou, Nieuwe Kade 1: `cafe-d-oude-oost-grou-006c9f7`, `hotel-restaurant-oostergoo-grou-20261031`
- Vlieland, Dorpsstraat 61: `zeevaert-bar-rotisserie-vlieland-a8283d7`, `eetcafe-t-praethuys-vlieland-20261030`
- Leeuwarden, Blokhuisplein 40: `drink-eetlokaal-proefverlof-leeuwarden-20261031`, `cafe-de-bak-leeuwarden-20261102`
- Nes, Marten Janszenstraat 3: `cafe-de-brouwerij-nes-20261101`, `discotheek-de-lichtboei-nes-20261101`

## Grenzen en vervolg
Dit controleert uitsluitend de interne consistentie van de opgeslagen strings/coördinaten. Het bewijst geen exacte fysieke ingang, actuele exploitatie, juiste bron of publieke toegankelijkheid. De gedeelde-adresgroepen overlappen met het eerdere rapport `reports/shared-address-audit-2026-11-07.md`; geen nieuwe doublures vastgesteld. **Volgende actie:** ontbrekende Friese markers tegen live BAG/PDOK en exploitantadres controleren; prioriteit Leeuwarden/Drachten/Sneek, vervolgens fysieke mobiele kaarttest. Geen masterdata aangepast.
