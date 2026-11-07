# TODO — Nog ergens naar binnen

Alleen **open werk**. Verwijder een taak zodra deze echt klaar is. Geen voortgangslog, afgeronde taken of uurlijkse checkpoints: de Git-geschiedenis bewaart de wijzigingen. `data/venues.json` is de enige masterdatabase; bron en controledatum horen bij het betreffende horecarecord.

## Eerst aanpakken

- [ ] **Mobiele site echt testen en zo nodig repareren:** kaart pannen/zoomen naar Sneek moet de actieve regio naar Friesland schakelen; controleer zichtbaar regio-label, scrollbare resultatenlijst en de **Nu**-knop (juiste dag/tijd én zichtbare feedback). Automatische tests zijn geen fysieke mobiele browsertest.
- [ ] **Friesland: 54 ontbrekende kaartcoördinaten** exact tegen BAG/PDOK en de werkelijke publieksingang controleren, niet gokken. Begin Leeuwarden (6), Drachten (4), Sneek (3), Anjum (3); daarna de rest. Werkrij: [54 adressen](reports/friesland-geocode-werkrij-2026-11-07.md). Let op huisnummerreeksen en toevoegingen.
- [ ] **Friesland: ontbrekende sluitings- en laatste-toegangstijden** met actuele primaire bronnen aanvullen. Prioriteer nachthoreca; 208 Friese locaties hebben wel een website maar nog geen exact regulier sluituur: [werklijst](reports/friesland-onbekende-sluituren-met-website-2026-11-07.md). Laat event-, keuken- en vergunningstijden niet doorgaan voor vaste caféuren. Laatste toegang blijft apart.
- [ ] **Friesland D0-dekking afronden:** per gemeente, kleine plaats én de vier bewoonde Waddeneilanden gericht ontbrekende openbare alcoholhoreca zoeken, dubbele/historische vermeldingen uitfilteren, officiële sites controleren en onderbouwde gegevens meteen in de master opslaan. Richtpunt: identiteit/adres/actuele exploitatie van circa 80% onafhankelijk bevestigd; overige onzekerheden correct verborgen of gemarkeerd.

## Gerichte open bron- en adresconflicten

- [ ] **Leeuwarden:** Eewal 50/52 en Oude Doelesteeg 2/2A (Bar Sybs / De Doelebar) op eigen ingang en BAG-unit controleren; voor Café De Rus ontbreekt nog een bedrijfseigen sluituur.
- [ ] **Drachten:** Café-Bar 't Skûtsje heeft tegenstrijdige dinsdag-/woensdaguren; pas aanpassen bij nieuwe exploitantbevestiging. Controleer overige openstaande adres- en exploitatieconflicten tijdens de D0-ronde.
- [ ] **Sneek:** daadwerkelijke publieke opening en adressen van Club 1841, Fenix en Karaokebar de Nachtegaal opnieuw controleren zodra er een actuele openingsbron is (medio november aangekondigd, niet bewezen). Controleer ook resterende onzekere cafés zoals 't Singeltje, NOAH en 't Ouwe Vat; oude gidsuren niet overnemen.
- [ ] **Utrecht:** feitelijke heropeningen (o.a. Le Journal en De Prediker) en onzekere gedeelde horeca-ingangen verifiëren; alleen met bewijs actief tonen.

## Doorlopende controles

- [ ] **Weekaudit W46**: vanaf **maandag 9 november 2026, 10:00 CET** een nieuwe echte bronsteekproef per actuele regio. Volgende deelgebieden: Utrecht **Oudegracht/Zadelstraat**, Friesland **Harlingen/Franeker**. Werk deze regel na afronding direct om naar de eerstvolgende week en de volgende deelgebieden; geen auditlog maken.
- [ ] **Live publicatie en performance:** na relevante wijzigingen controleren of GitHub Actions/Pages slagen; de kaart en tijdfilters ook echt op mobiel/desktop controleren. Bij groei naar duizenden locaties kaartmarkers/lijstweergave efficiënt maken en automatische regiowissel over aangrenzende regio's stabiel houden.

## Daarna: landelijk uitbreiden

- [ ] **D0-besluit Friesland:** start landelijke uitbreiding zodra de dekking voldoende is en geen kritieke kaart-, filter- of datakwaliteitsfouten meer blokkeren; 100% volledige sluituren zijn geen voorwaarde.
- [ ] **Landelijke regio's en horeca:** eerst provincie-indeling en kaartgrenzen testen, daarna Groningen/Drenthe, Overijssel/Flevoland, Gelderland, Noord-Holland, Zuid-Holland, Zeeland, Noord-Brabant/Limburg en provincie Utrecht buiten Utrecht-stad. Bestaande `friesland`- en `utrecht`-links en venue-IDs behouden; geen lege regio's publiceren. Per gemeente ook kleine plaatsen controleren; nieuwe actieve regio's automatisch in de weekaudit opnemen.
