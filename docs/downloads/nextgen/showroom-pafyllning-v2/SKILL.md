---
name: showroom-pafyllning
description: >-
  Använd denna skill när en Lyserno-medarbetare vill hitta produkter,
  kontrollera aktuell lagerinformation eller förbereda en intern
  påfyllningsbegäran till ett showroom. Skillen hjälper agenten att identifiera
  rätt showroom, hitta relevanta produkter, kontrollera om de är
  beställningsbara och låta användaren välja vilket alternativ den vill gå
  vidare med. Använd inte skillen för produktfrågor som saknar koppling till
  showroompåfyllning.
metadata:
  version: 1.2.0
---

# Showroompåfyllning

Använd följande process när en medarbetare vill hitta produkter eller förbereda en intern påfyllningsbegäran till ett av Lysernos showrooms.

## Steg

### 1. Identifiera showroomet

- Använd Lysernos publika webbplats för att verifiera showroomets namn, typ, region och adress.
- Om flera showrooms matchar användarens beskrivning ska du be användaren precisera vilket som avses.
- Gissa inte vilket showroom användaren menar.

### 2. Förstå produktbehovet

Kontrollera om följande information framgår:

- användningsområde
- produkttyp
- färg eller variant
- önskat antal

Ställ en kort följdfråga om information som behövs för en säker produktmatchning saknas. Fråga endast efter sådant som påverkar produktvalet.

### 3. Hitta matchande produkter

- Använd `Lyserno Lighting Collection 2026` som primär källa för modeller, varianter, användningsområden och produktegenskaper.
- Identifiera alla produkter som tydligt uppfyller användarens kriterier.
- Ta inte med löst relaterade produkter för att fylla ut svaret.
- Om fler än fyra produkter matchar ska du först be användaren precisera behovet.
- Förklara kort varför varje presenterad produkt passar.

### 4. Kontrollera Centrallager

Använd verktyget `Hämta Centrallager Status` för att verifiera aktuell produktinformation.

- Matcha katalogens modell mot `ProductModelID`.
- Matcha därefter färg eller variant mot `Variant`.
- Använd `SKU` som unik identifierare.
- Beräkna disponibelt saldo som:

  `OnHandQuantity - ReservedQuantity`

- Räkna inte `IncomingQuantity` som disponibelt saldo. Redovisa det separat tillsammans med `NextRestockDate` när det är relevant.
- Använd endast verifierade värden från verktyget. Hitta inte på pris, saldo, leveransinformation, produktkod eller bildadress.

### 5. Bedöm om produkten är beställningsbar

Tolka `SalesStatus` så här:

- `Available`: Produkten kan vara beställningsbar om saldot räcker och `ReplenishmentCode` tillåter det.
- `Backorder`: Produkten är inte omedelbart tillgänglig. Redovisa inkommande antal och nästa påfyllnadsdatum när uppgifterna finns.
- `Blocked`: Produkten får inte föreslås som ett beställningsbart alternativ.

Tolka `ReplenishmentCode` så här:

- `RC10`: Produkten får användas för vanlig showroompåfyllning.
- `RC90`: Produkten får inte beställas genom vanlig showroompåfyllning, även om `SalesStatus` är `Available` och disponibelt saldo är större än noll.

Föreslå aldrig en produkt med `RC90` som beställningsbart alternativ. Förklara kort begränsningen och föreslå i stället närmaste relevanta produkt med `RC10`.

En produkt är beställningsbar endast när:

- `SalesStatus` är `Available`
- `ReplenishmentCode` är `RC10`
- disponibelt saldo räcker för det önskade antalet

### 6. Presentera produkterna

Presentera alla verifierade produktmatchningar som uppfyller användarens kriterier.

Skilj mellan:

- **Beställningsbara alternativ**
- **Matchar behovet men kan inte beställas**, när sådana produkter finns

Märk alternativen med bokstäver, exempelvis **A**, **B** och **C**.

Presentera varje produkt med:

- produktnamn och variant
- produktbild
- en kort motivering
- SKU
- pris
- disponibelt saldo
- leveransinformation
- beställningsstatus

Använd endast `ImageSource` från den matchande raden i Centrallager. Visa bilden med följande format:

`![Produktnamn – variant](ImageSource)`

Ändra eller konstruera aldrig bildadressen. Om `ImageSource` saknas presenterar du produkten utan bild.

Använd högst två korta meningar per produkt.

### 7. Be användaren välja

När flera beställningsbara alternativ finns, fråga vilket användaren vill gå vidare med.

Exempel:

> Vilket av de beställningsbara alternativen vill du gå vidare med – A eller B?

Fråga endast om produkter som är beställningsbara. En produkt med `RC90`, `Blocked`, `Backorder` eller otillräckligt saldo får inte presenteras som ett val.

Om endast ett beställningsbart alternativ finns ska du fråga om användaren vill gå vidare med det.

När användaren har valt produkt sammanfattar du:

- showroom
- produkt och variant
- SKU
- önskat antal
- disponibelt saldo
- pris
- leveransinformation

Påstå inte att en beställning, reservation eller leverans har skapats. Den här versionen av skillen kan endast ta fram och verifiera underlaget.

## Svarsformat

Använd följande struktur:

- **Showroom**
- **Tolkat behov**
- **Beställningsbara alternativ**
- **Matchar men kan inte beställas**, endast när det behövs
- **Välj produkt**

Håll svaret kortfattat och visa den viktigaste informationen först.

## Felhantering

- Om flera lagerrader kan vara rätt ska du ställa en följdfråga i stället för att välja godtyckligt.
- Om verktyget misslyckas ska du förklara att Centrallager inte kunde kontrolleras.
- Om `ReplenishmentCode` saknas eller är okänd får produkten inte presenteras som beställningsbar.
- Om ingen produkt kan beställas ska du förklara varför och rekommendera manuell hantering.
