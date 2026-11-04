# Statische BAG-huisnummercontrole — 2026-11-05

Dataset: actuele masterblob a461ea13b570b788af451e138c6b234124a9e2fd; 768 locaties. Vergeleken: 701 records met `geo.method == "PDOK BAG-adres"`.

- Exacte straat, huisnummer en huisletter in bronadres versus `geo.matched_address`: 701 overeenkomsten.
- Verschillen: 0.
- Niet automatisch parsebaar: 0.

**Beperking:** alleen tekstvergelijking van opgeslagen velden, geen actuele PDOK/BAG-opvraag en geen bewijs van correcte ingang, actuele exploitatie of huisnummertoevoeging in BAG. Geen coördinaten aangepast.

## Afwijkingen

Geen.

## Niet parsebaar

Geen.

## Vervolg

Afwijkingen en niet-parsebare adressen individueel met BAG/PDOK en exploitant verifiëren. Controleer daarnaast de daadwerkelijke ingang en BAG-huisnummertoevoeging; opgeslagen `matched_address` is daarvoor niet voldoende.
