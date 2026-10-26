# Feedbackregistratie (gratis)

## Waarom een extra dienst?

GitHub Pages is alleen statische hosting. Het kan niet zelfstandig meldingen van bezoekers opslaan. Deze Google Apps Script-webapp registreert anonieme klikmeldingen in een privé Google Sheet. Het script staat volledig in [Code.gs](Code.gs).

## Eenmalig aanzetten

1. Open [Google Apps Script](https://script.google.com/home/projects/create) met je Google-account.
2. Vervang de inhoud van **Code.gs** door die van [ons Code.gs-bestand](Code.gs) en sla op.
3. Selecteer bovenin de functie **setup** en klik **Run / Uitvoeren**. Google vraagt eenmalig toestemming om een spreadsheet te maken. Het logboek heet **nogergensnaarbinnen - meldingen**.
4. Klik **Deploy / Implementeren → New deployment / Nieuwe implementatie → Web app**. Kies **Execute as: Me** en **Who has access: Anyone** (ook zonder Google-account). Implementeer.
5. Kopieer de **web app URL**, die eindigt op `/exec`. Geef die URL door in de ChatGPT-projectthread; dan kan de URL in `index.html` worden ingesteld bij `FEEDBACK_ENDPOINT`. Een GitHub Pages-publicatie volgt automatisch.
6. Test op de site een melding en controleer of deze in het Google Sheet verschijnt.

Zolang stap 5 niet af is, werkt de knop **Klopt niet** uitsluitend via een vooraf ingevulde GitHub Issue. De bezoeker moet de issue zelf versturen en daarvoor een GitHub-account hebben. De website beweert niet dat deze fallback een melding heeft opgeslagen.

## Werking

- Iedere klik geeft de locatie-ID, locatienaam, regio en een willekeurig request-ID door aan Apps Script.
- De server voegt een regel toe met tijdstip en status **Nog controleren**.
- De bezoeker krijgt **“Oke, we gaan er naar kijken!”** alleen als de server bevestigt dat de melding is opgeslagen.
- Bij een fout komt er een foutmelding en kan de gebruiker opnieuw proberen.
- De willekeurige request-ID voorkomt dat herhaalde verzending van hetzelfde verzoek meerdere regels oplevert (binnen de caching-periode).
- Er worden geen persoonsnamen, e-mailadressen, IP-adressen of browserfingerprints opgeslagen. Iedereen kan wel meldingen doen; vandaar dat spam mogelijk is. Ga bij de volgende controle op locatie-ID filteren en tel het aantal meldingen.
- Het endpoint is publiek, omdat bezoekers zonder account moeten kunnen melden. Houd de Sheet privé, en gebruik geen persoonlijke toegangstokens in de website.

**Technisch:** Apps Script Content Service retourneert een strikt gevalideerde JSONP-callback. Hiermee ontvangt de statische site een bevestiging zonder CORS-workaround. Het endpoint schrijft data bij een GET-verzoek; het is uitsluitend bedoeld als eenvoudig kliklogboek en geen algemene API.
