# Kursscenario: Lyserno showroompåfyllning

Detta är den sammanhållande interna storyn för den instruktionsdrivna Copilot Studio-utbildningen. Dokumentet publiceras inte på kurswebbplatsen utan används för att hålla kommande kapitel, skillversioner och tester konsekventa.

## Grundscenario

Användaren arbetar i ett av Lysernos showrooms. Lyserno Produktassistent hjälper showroompersonalen att:

1. identifiera rätt showroom och förstå produktbehovet
2. hitta relevanta produkter i den stabila produktkatalogen
3. kontrollera aktuellt pris, disponibelt saldo och leveransinformation i Centrallager
4. föreslå ett likvärdigt alternativ vid lagerbrist
5. kontrollera interna regler för påfyllnadsbegäran
6. skicka ett komplett internt underlag till lager- eller sortimentsansvarig

SharePoint-listan representerar centrallagret. Arbetsflödet skickar under utbildningen meddelanden till deltagarens egen inkorg. Agenten gör ingen extern försäljning och publiceras inte mot externa kunder.

## Återkommande test

```text
Vi behöver fylla på showroom Göteborg med gröna bordslampor som passar för fokuserat arbete. Vilka modeller i sortimentet är mest relevanta?
```

Den avsiktliga tvetydigheten är vilket showroom i Göteborgsområdet som avses. För gröna bordslampor finns flera meningsfulla produktalternativ:

- Arcus T1-FG för skrivbord och reception
- Terra T5-FG för arbetsrum och lounge
- Linea T6-FG för fokuserat bildskärmsarbete

## Progression

### Kunskap

PDF-katalogen ger stabil produktinformation. Lysernos publika webbplats ger showroomnamn, typ, region, adress och öppettider. Agenten kan rekommendera produkter men inte verifiera aktuellt lager, pris eller leveranstid.

### Skill version 1

Skillen `showroom-pafyllning` fångar processen för att identifiera showroom, förstå behovet och ta fram ett källgrundat produktförslag. Den avslutas tydligt när aktuell lagerinformation inte kan verifieras.

### SharePoint och skill version 2

Centrallager tillför SKU, pris, tillgänglig och reserverad kvantitet, leveranstid samt nästa påfyllnadsdatum. Skillen utökas med disponibelt saldo:

```text
AvailableQuantity - ReservedQuantity
```

Den kan därefter jämföra rekommendationen med faktiskt lager och föreslå ett likvärdigt alternativ.

### Intern policy och skill version 3

Ett showroom får begära högst tio exemplar av samma SKU genom standardprocessen. Större påfyllnader kräver manuell kontroll av centrallagrets sortimentsansvarige.

### Arbetsflöde och slutlig skill

Arbetsflödet tar emot SharePoint Item ID, antal, showroom, önskat leveransdatum, kommentar och beställarens namn. Det hämtar produkten och skickar antingen en vanlig påfyllnadsbegäran eller en begäran om manuell granskning. Resultatet returneras till agenten.

Den sammanhållande kursresan är:

```text
produktbehov → produktkunskap → aktuellt lager → ersättningsförslag → intern policy → arbetsflöde
```
