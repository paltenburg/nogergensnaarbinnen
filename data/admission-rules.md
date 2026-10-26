# Uiterste toegang versus sluitingstijd

De **enige masterdatabase** blijft [venues.json](venues.json). Dit document beschrijft de velden en de regels; het is geen tweede database.

## Per locatie

De bestaande `closing` en eventuele `opening` blijven aparte weekroosters met `ma`, `di`, `wo`, `do`, `vr`, `za`, `zo`. Nieuw/bekrachtigd: het afzonderlijke optionele rooster `last_entry` met exact dezelfde dagen.

- `closing`: wanneer de zaak sluit of het evenement eindigt.
- `last_entry`: tot wanneer nieuwe bezoekers uiterlijk worden binnengelaten (niet het moment waarop aanwezige bezoekers moeten vertrekken).
- `last_entry_source`, `last_entry_checked_on`, `last_entry_quality`, `last_entry_notes`: herleidbaarheid en onzekerheid.
- `last_entry_typical_days`: dagen waarop de toegangstijd **gebruikelijk** is in plaats van gegarandeerd, bijvoorbeeld `["vr","za"]`.
- `admission_policy_id`: optionele verwijzing naar een expliciet gecontroleerde regel onder `admission_policies` in hetzelfde JSON-bestand.

Tijden horen bij de gekozen **uitgaansavond**: zaterdag `02:00` betekent zondagochtend 02:00. Betekenis van bijzondere waarden: `?` onbekend, `—` gesloten of geen toegang, `Event` per evenement, `Varieert` geen vaste tijd. Als `last_entry` ontbreekt, is de uiterste toegang **onbekend**, en niet stilzwijgend gelijk aan de sluitingstijd.

Een rechtstreeks geverifieerde locatieregel kan eerder zijn dan de gemeentelijke bovengrens. De applicatie gebruikt, wanneer beide expliciet van toepassing zijn, de vroegste van beide. Een wettelijke bovengrens wordt nooit automatisch toegepast op alle zaken in een stad of op basis van de naam van een categorie.

## Weergave en filteren

Wanneer `last_entry` eerder valt dan `closing`, staat bij de zaak zichtbaar **Binnen tot 02:00 · sluit 04:00**. Bij een gebruikelijke tijd staat het benaderingsteken **≈**. De kaarttooltip toont dezelfde informatie. Als beide tijden samenvallen, staat er geen overbodige dubbele tijdsvermelding.

Bij een geselecteerde aankomsttijd moeten **beide grenzen** strikt later liggen dan de aankomsttijd: op de uiterste toegangstijd zelf wordt de locatie niet meer aanbevolen. Als de uiterste toegang onbekend is, filtert de applicatie nog steeds op bekende sluitingstijd, maar belooft geen toegang.

Voorbeelden uit de Utrechtse database:
- [BASIS](https://clubbasis.nl/events/): gebruikelijke vrijdag- en zaterdagclubnachten tot **≈06:00**, deuren meestal tot **≈04:00** ([FAQ](https://clubbasis.nl/faq/)). **Per evenement afhankelijk**.
- [Café Biljart Cobus](https://cafecobus.nl/wie-zijn-wij/): op vrijdag en zaterdag sluiting **00:00** en uiterste toegang **22:00**; op dinsdag vallen beide op **20:00** en verschijnt de extra waarschuwing dus niet.

## Sneek en de gemeente Súdwest-Fryslân

De op 26 oktober 2026 geldige [Algemene Plaatselijke Verordening 2021 Súdwest-Fryslân, artikel 2:29 lid 2a](https://lokaleregelgeving.overheid.nl/CVDR619964) geeft voor **natte nachthoreca** een uiterste toelatingstijd van **02:00** en een maximale sluitingstijd van **04:00**. Het gaat om **maxima** die van gemeentelijke voorschriften en individuele ontheffingen afhankelijk zijn, niet om vastgestelde werkelijke sluitingstijden van iedere zaak. Controle: 26 oktober 2026.

Ook [Café Neighbours Sneek](https://www.neighbourssneek.nl/homepagina/) vermeldt expliciet geen nieuwe bezoekers na **02:00** en zaterdag een sluiting van **03:45**. Dit is een voorbeeld uit Sneek, **geen toegevoegd record**: de huidige locatiedatabase bevat nog uitsluitend locaties uit regio Utrecht.

De bron en toepassingsbeperking zijn bewaard als `admission_policies.sudwest-fryslan-natte-nachthoreca`. Een toekomstig Sneeks café krijgt die regel **alleen na bevestiging** van de juridische horecacategorie en bijzondere vergunningsvoorwaarden. Zo voorkomen we dat een gemeentelijke uitzondering ten onrechte voor alle cafés geldt.

## Checklist voor volgende onderzoeksrondes

1. Controleer zowel de laatste toelating als het einde van de avond op de officiële website / evenementpagina, en leg afzonderlijke bron-URL's en datums vast.
2. Let op `early entry`-tickets: een ticketprijsvoordeel tot 23:30 is niet automatisch de laatste toegang.
3. Bij overheidsregels: registreer gemeente, categorie, actuele rechtsbron en afwijkingsmogelijkheden; koppel pas na classificatie aan specifieke locaties.
4. Wijzig eerder vastgelegde sluitingstijden niet alleen omdat een uiterste-toegangstijd gevonden is.
5. Markeer benaderingen en evenementafhankelijke afwijkingen expliciet; bij tegenstrijdigheid is geen gegarandeerde toegang bekend.
