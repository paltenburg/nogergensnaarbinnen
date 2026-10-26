# Onderzoeksronde Utrechtse cafés – 26 oktober 2026

## Samenvatting

- Masterbestand: [venues.json](venues.json)
- 212 locaties, inclusief 17 bij deze ronde nieuw gevonden cafés, bars, proeflokalen en borrelgelegenheden (195 -> 212).
- 133 locaties hebben een directe, vastgelegde website-URL; 79 nog niet.
- 72 locaties hebben `opening` per uitgaansdag, 1 heeft `last_entry`.
- Stand bij laatste controle: 174 locaties met coördinaten. GitHub Actions verwerkt adressen via PDOK opnieuw na elke database-update.
- 78 locaties hebben op vrijdag een onbekende sluitingstijd. Onbekende tijden mogen niet als "na X uur open" worden geïnterpreteerd.

## Selectie nieuw toegevoegde zaken

ULU Bar, Eetcafé De Vingerhoed, The Grand Shuffle, Rooie Nel, Le French Café, Wijnbar Hemel & Aarde, Margie’s Streetkitchen & Bar, Bar en Bistro Le Clochard, Grand Café LIVING Utrecht, Bar Barak, Cerveceria Boulevard, Café Elize Mariaplaats, Café Elize Wagenstraat, Loft 88 Utrecht, Science Café HideOut, Grand Café de Beuntjes, Het Oude Tolhuys.

De data is een onderzoeksregister, geen garantie van actuele opening of van toegang zonder reservering/ticket.

## Belangrijkste controles en afwijkingen

- **Le Journal** – gesloten sinds januari wegens verbouwing; heropening begin november 2026 aangekondigd. Tijdelijk uitgesloten met `selection: Nee`. [Eigen website](https://www.lejournal.nl/verbouwing) en [De Buik](https://www.debuik.nl/utrecht/nieuws/aftellen-voor-het-nieuwe-cafe-le-journal-is-begonnen).
- **Nomono** – verplaatst naar Bemuurde Weerd Oostzijde 13; alleen proefopening 23/24 oktober gemeld, volledig vanaf 30 oktober verwacht. `Nog te controleren`; [eigen website](https://www.nomono-utrecht.nl/) en [nieuws](https://verseuitjes.nl/uit-in/utrecht/nieuwe-horeca/1/nomono).
- **Bar Patine** – eigenaar publiceert uitdrukkelijk *geen vaste sluitingstijd*. Tijd teruggezet naar `Varieert` ondanks vaste tijden in andere gidsen. [Eigen website](https://barpatine.nl/contact/).
- **Café Biljart Cobus** – melding van na 22:00 geen nieuwe klanten. `last_entry` apart van `closing`; [eigen website](https://cafecobus.nl/wie-zijn-wij/).
- **Café Voortuin** – [Ontdek Utrecht](https://www.ontdek-utrecht.nl/locatie/cafe-voortuin/) noemt sluiting 02:00–03:30, [Centrum Utrecht](https://centrumutrecht.nl/company/cafe-voortuin/) noemt 22:00. Opgenomen met expliciete waarschuwing; [eigen site](https://www.cafevoortuin.nl/) toont openingsuren maar geen sluitingsuren.
- **Café Tilt** – [eigen site](https://cafetilt.nl/contact/) noemt 01:00/02:00, [Ontdek Utrecht](https://www.ontdek-utrecht.nl/locatie/cafe-tilt) noemt 02:00/04:00. De eigen site kreeg voorrang.
- **Café De Potdeksel** – [eigen site](https://www.cafedepotdeksel.nl/) vermeldt Lucasbolwerk 23 en woensdag/zaterdag 01:00/03:00, anders dan oude [Centrum Utrecht-data](https://centrumutrecht.nl/company/cafe-de-potdeksel/).
- **Oproer Biercafé** – officiële nieuwe uren: wo 12–22, do–za 12–00, zo 12–21, ma/di gesloten; [eigen site](https://www.oproerbrouwerij.nl/pages/oproer-biercafe-utrecht).
- **Bar Pakhuis** – eigen website onder nieuwe naam [barpakhuis.nl](https://barpakhuis.nl/), Janskerkhof 21, vanaf 16:00 op ma–do, vanaf 14:00 vr–zo; sluiting nog niet rechtstreeks bevestigd. Historische 04:00 mogelijk achterhaald.
- **Eetcafé De Vingerhoed**, **The Grand Shuffle**, **Brothers in Law Taphouse**, **The Boules Club**, **Kaasbar**, **Wijnbar Kurk**, **Café Keet**, **De Luifel**, **Talud9**, **Le French Café**, **Bar Barak** en **De Postillon**: officiële websites of Utrechtse toeristische/ondernemersbronnen geraadpleegd.

## Vervolgcontrole

1. Zoek de 79 ontbrekende officiële websites, maar leg geen zoekresultaten vast als directe websites.
2. Controleer 78 onbekende vrijdag-sluitingstijden, vooral cafés met veel bezoekers. Vergelijk ten minste twee bronnen indien de eigen website geen tijd vermeldt.
3. Controleer conflictgevallen Café Voortuin, Café Tilt, Le Journal, Nomono en Bar Pakhuis eerst opnieuw.
4. Registreer naast openen en sluiten ook **laatste toegang** wanneer expliciet genoemd. Een latere sluiting betekent niet automatisch dat je nog binnenkomt.
5. Controleer datums en evenementen/seasonal exceptions. Onzekere gegevens niet zonder toelichting als definitief presenteren.
