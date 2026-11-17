# Niet-uurlijkse taken — Nog ergens naar binnen

Dit bestand bevat eenmalige, gebeurtenisafhankelijke en latere werkzaamheden. De **wekelijkse bron-/regioaudit wordt al door een aparte geplande taak uitgevoerd** en wordt hier niet als tweede audit ingericht. De uurlijkse uitvoerder werkt uitsluitend de concrete onderzoekstaken uit [TODO.md](TODO.md) af.

## Eenmalig of handmatig testen

- [ ] **Echte mobiele browsertest:** pan/zoom naar Sneek moet naar Friesland schakelen; zichtbaar regiolabel, scrollbare resultaten en Nu-knop (juiste Nederlandse datum/tijd en zichtbare feedback) testen. Automatische JavaScript-tests bewijzen dit niet. Bij geconstateerde bug een concrete reparatietaak in TODO.md zetten.
- [ ] **Live UI- en performancetest:** kaart, tijdfilters en toegankelijkheid op mobiel/desktop beoordelen wanneer er een testomgeving/browser beschikbaar is. Bij substantiële groei naar duizenden locaties: laden/renderen op kaartbereik en regiokeuze, stabiele grensoverschrijdende regiowissel en lijstsnelheid beoordelen.

## Op gebeurtenis controleren, niet elk uur

- [ ] **Aangekondigde (her)openingen:** alleen opnieuw onderzoeken zodra er een concrete nieuwe openingsbron of de afzonderlijke weekaudit aanleiding geeft. Utrecht: Le Journal, De Prediker. Sneek: Club 1841, Fenix, Karaokebar de Nachtegaal. Een aangekondigde datum is geen bewijs van feitelijke publieke exploitatie; adres/ingang en openingsuren afzonderlijk verifiëren.
- **Publicatiecontrole na wijzigingen:** bij relevante GitHub-commits de bijbehorende Actions/Pages-run controleren; dat is onderdeel van het afronden van die wijziging, geen losse controle ieder uur. Een echte browsercontrole blijft een afzonderlijke test.

## Volgende projectfase — pas na Friesland D0

- [ ] **D0-besluit Friesland:** pas landelijke uitbreiding starten zodra alle Friese gemeenten, kleine kernen en vier bewoonde Waddeneilanden systematisch aan bod zijn gekomen, circa 80% van de Friese records op identiteit/adres/exploitatie aantoonbaar is geverifieerd en geen kritieke kaart-/filter-/datakwaliteitsfouten blokkeren. Volledige sluituren zijn geen voorwaarde.
- [ ] **Landelijke uitrol:** eerst provincie-indeling en kaartgrenzen testen, daarna Groningen/Drenthe, Overijssel/Flevoland, Gelderland, Noord-Holland, Zuid-Holland, Zeeland, Noord-Brabant/Limburg en provincie Utrecht buiten Utrecht-stad. Bestaande `friesland`- en `utrecht`-links en venue-IDs behouden; geen lege regio's publiceren. Per gemeente ook kleine plaatsen meenemen. Nieuwe actieve regio's laten opnemen door de afzonderlijke weekaudit.

## Al apart gepland

De **wekelijkse bron- en regioaudit** heeft een eigen schedule. Geen W46/W47-checkbox of wekelijks auditlog toevoegen aan de uurlijkse TODO. Voortgang en volgende geografische deelgebieden horen bij die afzonderlijke uitvoering.
