# Boekhouding — Janne en Popke

Statische website op GitHub Pages; de enige bron van bedragen is de bestaande Google Sheet.

## Privacy en beveiliging

**Verplicht vóór gebruik:**

1. Open het bestaande spreadsheet in Google Sheets.
2. Kies **Delen → Algemene toegang → Beperkte toegang**.
3. Deel het document rechtstreeks met de twee bedoelde Google-accounts. Geef ze de rol **Bewerker**.
4. Controleer dat er geen openbare, organisatiebrede of andere onbedoelde toestemming overblijft.

De oorspronkelijke Sheet stond op **iedereen met de link: bewerker**. OAuth alleen maakt die link **niet** privé. De app kan de Google-deelrechten niet wijzigen of afdwingen.

GitHub Pages serveert HTML/CSS/JS openbaar. Bezoekers zien pas financiële gegevens als de Google Sheets API een toegangstoken met geldige machtiging accepteert. De toegangscontrole gebeurt door Google **op het document**; het openbare JavaScript of de OAuth-client-ID zijn geen geheimen.

### Google Cloud eenmalig configureren

1. Open https://console.cloud.google.com/ en maak of selecteer een project.
2. Schakel Google Sheets API in: https://console.cloud.google.com/apis/library/sheets.googleapis.com
3. Configureer Google Auth Platform → Branding en Audience. Kies External bij particuliere Google-accounts; gebruik eventueel Testing en voeg beide Google-accounts toe als testgebruikers.
4. Ga naar https://console.cloud.google.com/auth/clients en maak een OAuth-client van type Web application.
5. Zet bij Authorized JavaScript origins precies https://paltenburg.github.io (geen pad of laatste /).
6. Kopieer alleen de publieke Client ID (eindigt op .apps.googleusercontent.com), niet de client secret.
7. Open https://paltenburg.github.io/nogergensnaarbinnen/boekhouding/ en vul de client-ID plus de bestaande spreadsheetlink in.
8. Klik op Inloggen met Google. Google vraagt toestemming voor het bewerken van Google Spreadsheets.
9. Je partner voert de client-ID en spreadsheetlink ook eenmalig op haar eigen apparaat in en logt in met haar eigen Google-account.

**Let op:** de scope https://www.googleapis.com/auth/spreadsheets geeft deze app, tijdens de sessie, toestemming om Google Spreadsheets van het ingelogde account te lezen en te wijzigen, niet uitsluitend het gekozen spreadsheet. Google ondersteunt geen bestandspecifieke Sheets-scope voor deze eenvoudige bestaande-Sheet-integratie. De app gebruikt die toestemming uitsluitend voor het ingevoerde spreadsheet-ID.

Geen client secret opnemen in GitHub. Er worden geen toegangstokens in localStorage opgeslagen. Alleen de client-ID en het spreadsheet-ID worden op het betreffende apparaat bewaard.

## Functionaliteit en beperkingen

- Leest bestaande posten uit Sheet1!C1:G999 (kolommen Datum, Omschrijving, Van, Naar, Bedrag).
- Toont totaal van alle bedragen, plus een richtingssaldo Janne → Popke / Popke → Janne. Ontbrekende richting telt niet mee in het richtingssaldo.
- Bewerkt uitsluitend de betreffende rij in C:G. De bestaande totaalformule in kolom B blijft intact.
- Voegt nieuwe regels via de Sheets API toe met INSERT_ROWS, zodat bestaande regels niet worden overschreven.
- Een rij verwijderen wist C:G zonder de overige rijen te verschuiven; bestaande celdata in deze kolommen gaat dan verloren.
- Controleert vóór een wijziging of de rij sinds het laatste ophalen is veranderd. Gelijktijdige wijzigingen binnen de tijd tussen controle en schrijven zijn nog niet transactioneel beveiligd.
- Geen lokale kopie van uitgaven, offline modus, server, automatische achtergrondsynchronisatie of herstelgeschiedenis binnen de app. Google Sheets heeft wel eigen versiegeschiedenis.
- De app bewaart de OAuth-access token alleen tijdens de geopende browsersessie en vraagt opnieuw toestemming na afloop. Token blijft in JavaScript-geheugen.
- De tabbladnaam Sheet1 en maximale bereikrij 999 zijn voorlopig op de huidige spreadsheet afgestemd.

## Ontwikkeling

Controleer de JavaScript-syntax en rekenlogica met:

- node --check boekhouding/app.js
- node tests/test_boekhouding.js

De .github/workflows/pages.yml publiceert boekhouding/** samen met de bestaande horecawebsite.
