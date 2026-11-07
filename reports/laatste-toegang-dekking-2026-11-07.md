# Laatste-toegang-dekking — statische masteraudit 2026-11-07

Bron: actuele `data/venues.json`, blob `7f0bcef26d595e7dbbca3e97bdd812d34c7ccfae`. Dit is **geen externe verificatie van toegangstijden**. `selection` is een administratieve status, geen bewijs van openstelling. Alleen een expliciet `last_entry`-veld telt als geregistreerde laatste toegang; ontbrekend betekent onbekend, niet dat toegang tot sluiting mogelijk is.

| Regio | Records | Selectie niet expliciet uitgesloten* | Met last_entry | Zonder last_entry |
|---|---:|---:|---:|---:|
| Utrecht | 224 | 203 | 2 | 201 |
| Friesland | 544 | 422 | 4 | 418 |

*Exclusie voor deze telling: `Nee`, `Gesloten`, `Nog te controleren`; overige selectiestatussen zijn niet automatisch bevestigd openbaar.

## Vervolgcontrole

Controleer eerst de toegangspolicy van echte nacht-/feestcafés met officiële exploitantbron, apart van sluituur, en leg `last_entry_source`, `last_entry_checked_on` en eventuele evenementenuitzonderingen vast. APV-maximum is geen individuele toegangsregel. Controleer vervolgens andere selecteerbare venues per regio. **Geen enkele onbekende waarde automatisch gelijkstellen aan sluiting.**

## Uitgevoerde technische controle

768 JSON-objecten verwerkt; 768 records per actieve regio geclassificeerd. Geen masterwijziging, geen externe exploitantcontrole, geen CI-/Pages- of fysieke mobiele test in deze rapportbatch.
