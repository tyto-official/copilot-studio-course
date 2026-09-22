---
name: showroom-pafyllning
description: >-
  Använd när en medarbetare vill hitta produkter, bedöma eller genomföra
  showroompåfyllning. Verifiera showroomet, matcha produktbehovet, kontrollera
  aktuellt lager och interna påfyllningsvillkor, samla in produktval och antal,
  be om slutlig bekräftelse och använd Hantera showroompåfyllning. Använd inte
  skillen för allmänna produktfrågor utan koppling till showroompåfyllning.
metadata:
  version: "3.0.0"
---

# Showroompåfyllning

## 1. Identifiera showroomet

Använd Lysernos publika webbplats som primär källa för att verifiera showroomets namn, typ, land, region, adress och öppettider. Fråga inte efter uppgifter som redan kan verifieras.

Om flera showroom matchar användarens beskrivning och rätt showroom inte kan identifieras ska du ställa en kort följdfråga.

## 2. Matcha produktbehovet

Matcha behovet mot Lyserno Lighting Collection 2026. Kontrollera sedan matchande modeller och varianter med **Hämta produkter från Centrallager**.

Verktygets fält:

- `Title` = produktnamn
- `field_1` = SKU
- `field_2` = ProductModelID
- `field_3.Value` = Variant
- `field_4` = ImageSource
- `field_5` = CurrentUnitPrice
- `field_6` = OnHandQuantity
- `field_7` = ReservedQuantity
- `field_8` = IncomingQuantity
- `field_9` = NextRestockDate
- `field_10.Value` = SalesStatus
- `field_11.Value` = ReplenishmentCode
- `ID` = SharePoint Item ID

Matcha med ProductModelID och Variant. SKU identifierar produktvarianten.

## 3. Kontrollera lager och produktregler

Beräkna disponibelt saldo som `OnHandQuantity − ReservedQuantity`.

Inkommande antal räknas inte som disponibelt. Redovisa inkommande antal och påfyllnadsdatum separat när det är relevant, utan att lova leverans det datumet.

Regler för vanlig showroompåfyllning:

- Available och RC10: får väljas om disponibelt saldo räcker.
- RC90: får inte beställas genom vanlig showroompåfyllning, oavsett SalesStatus och saldo.
- Blocked: får inte beställas, oavsett ReplenishmentCode och saldo.
- Backorder: är inte omedelbart tillgänglig.
- Saknad eller okänd status eller kod: får inte tolkas som tillåten.

Om antalet saknas får tillåtna produkter med positivt saldo visas, men bekräfta inte att saldot räcker för användarens behov.

## 4. Presentera produkterna

Visa alla tydliga produktmatchningar, inte bara huvudrekommendationen.

Presentera valbara produkter i en tabell med endast följande kolumner:

| Val | Produkt och användning | Pris/st | Disponibelt | Bild |
| --- | --- | --- | --- | --- |

Ange produktens namn, variant och en kort motivering under Produkt och användning. Visa spärrade produkter och produkter med otillräckligt saldo separat med en kort förklaring.

Visa styckpriser i SEK, exempelvis 1 995 kr/st, och datum i svensk tidszon.

Använd ImageSource för små miniatyrbilder, cirka 80–120 pixlar breda. Visa en bildlänk om små bilder inte stöds. Ändra inte bildadressen. Utelämna bilden om adressen saknas.

Vid flera valbara produkter ska du märka dem A, B och så vidare. Koppla varje bokstav till rätt SKU och SharePoint Item ID utan att visa ID:t.

Vid endast en valbar produkt ska du inte använda någon bokstav.

## 5. Be om de uppgifter som saknas

När produkterna har presenterats ska du i samma meddelande fråga efter:

- vilket alternativ användaren vill gå vidare med, om flera produkter är valbara
- om användaren vill gå vidare med produkten, om endast en produkt är valbar
- önskat antal
- showroomets namn, typ eller land, om någon av uppgifterna fortfarande inte har kunnat verifieras

Fråga inte på nytt efter information som redan finns i samtalet eller har verifierats med Lysernos publika webbplats.

## 6. Kontrollera påfyllningsvillkoren

När showroom, produkt och antal är kända ska du använda **Lyserno – policy för intern produktförsörjning** för att kontrollera mängdgräns och lagerbuffert utifrån showroomtyp och mottagarland.

Beräkna kvarvarande disponibelt saldo genom att dra önskat antal från det aktuella disponibla saldot.

Ange om begäran kan följa standardprocessen eller kräver manuell granskning. Ge en kort motivering.

Manuell granskning är inte ett avslag och gör inte en produkt som är spärrad enligt del 3 valbar.

Bekräfta inte att standardprocessen kan användas om villkoren inte kan verifieras.

## 7. Sammanfatta och be om bekräftelse

När alla uppgifter är fastställda ska du visa:

- showroomnamn
- showroomtyp
- land
- produkt och SKU
- antal
- styckpris och totalt produktpris
- aktuellt och kvarvarande disponibelt saldo
- om begäran kan följa standardprocessen eller kräver manuell granskning
- en kort motivering till bedömningen

Be därefter användaren bekräfta att arbetsflödet ska köras.

Om begäran kräver manuell granskning ska du förklara det före bekräftelsen. Säg att arbetsflödet skickar begäran för manuell granskning via mejl utan att reservera lagret.

Påstå inte att något har skickats eller reserverats innan arbetsflödet har svarat.

I normalfallet ska användaren bara behöva svara två gånger före körningen:

1. Produktval, antal och eventuell showroominformation som inte kunde verifieras.
2. Slutlig bekräftelse av det fullständiga underlaget.

Ställ ytterligare frågor endast när en nödvändig uppgift saknas eller är oklar.

## 8. Kör arbetsflödet

Använd **Hantera showroompåfyllning** först när användaren uttryckligen har bekräftat sammanfattningen.

Skicka följande värden:

- `ItemID`: SharePoint Item ID för den valda produktvarianten. Använd inte SKU eller ProductModelID.
- `Quantity`: det positiva heltal som användaren har bekräftat.
- `ShowroomName`: verifierat exakt showroomnamn.
- `ShowroomType`: `Showroomstudio` eller `Flagship`.
- `Country`: `Sverige` eller `Norge`.

Om användaren ändrar någon uppgift efter sammanfattningen ska du uppdatera underlaget och be om en ny bekräftelse innan du kör arbetsflödet.

## 9. Återge resultatet

Utgå från arbetsflödets `ResultStatus` och `ResultMessage`:

- `reserverad`: återge att reservationen skapades och att bekräftelsemejlet skickades.
- `skickad_for_granskning`: återge att begäran skickades för manuell granskning och att ingen reservation skapades.
- annat eller saknat värde: påstå inte att något har skickats eller reserverats. Förklara att arbetsflödet inte gav ett bekräftat resultat.

Använd innehållet i `ResultMessage` i svaret. Lägg inte till en ny bedömning som motsäger arbetsflödets resultat.
