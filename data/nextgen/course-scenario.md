# Målbild och plan: Lyserno Produktassistent

Detta är kursens interna arbetsdokument. Det publiceras inte på kurswebbplatsen. Syftet är att hålla scenario, testfrågor, kapitel, skillversioner och kommande beslut samstämmiga när kursen byggs om.

## Kursens scenario

Användaren arbetar i ett av Lysernos showrooms och behöver fylla på det lokala sortimentet från centrallagret. **Lyserno Produktassistent** hjälper medarbetaren att:

1. identifiera rätt showroom
2. förstå produktbehovet och ställa en följdfråga när något avgörande saknas
3. hitta relevanta produkter i katalogen
4. kontrollera aktuellt pris, disponibelt saldo och kommande påfyllning i SharePoint
5. förklara vilka alternativ som får beställas genom den vanliga showroomprocessen
6. visa alternativen med bild och låta användaren välja produkt
7. kontrollera interna regler för antal och manuell granskning
8. skicka en intern påfyllnadsbegäran genom ett arbetsflöde

Scenariot är internt. Agenten säljer inte till externa kunder. När en begäran uppfyller standardvillkoren reserverar arbetsflödet det valda antalet genom att uppdatera `ReservedQuantity` i Centrallager. Det skapar ingen leverans. Under utbildningen skickas arbetsflödets mejl till deltagarens egen inkorg.

## Slutmål för agenten

När kursen är färdig ska agenten kunna kombinera flera typer av information utan att blanda ihop deras roller:

| Del | Ansvar |
| --- | --- |
| Globala instruktioner | Agentens identitet, allmänna arbetssätt, svarsstil, omfattning och säkerhetsregler. |
| Produktkatalog | Stabil information om modeller, egenskaper, färger och användningsområden. |
| Publik webbplats | Showroomnamn, typ, land, region, adress och öppettider. |
| Skill | Arbetssättet för showroompåfyllning och företagsspecifika regler som `RC10` och `RC90`. |
| SharePoint-verktyg | Aktuella produktposter från listan **Centrallager**. |
| Internt styrdokument | Regler för när en begäran kan följa standardprocessen och när den måste granskas manuellt. |
| Arbetsflöde | Kontrollerar aktuellt saldo samt mängd- och buffertregler. Det reserverar lagret eller skickar begäran för manuell granskning och returnerar resultatet till agenten. |

Den här uppdelningen är också kursens pedagogiska poäng. Generella regler ligger alltid i agentens kontext. Ett avgränsat arbetssätt laddas genom en skill först när uppgiften kräver det. Aktuell data hämtas med ett verktyg, medan ett arbetsflöde utför en förutbestämd process.

## Namn som används i kursen

- Företag: **Lyserno**
- SharePoint-webbplats: **Lyserno Produktportal**
- SharePoint-lista: **Centrallager**
- Agent: **Lyserno Produktassistent**
- Skill: `showroom-pafyllning`
- SharePoint-verktyg: **Hämta produkter från Centrallager**
- Arbetsflöde: **Hantera showroompåfyllning**

SharePoint-verktygets beskrivning är:

```text
Hämtar aktuella produktposter från Lysernos SharePoint-lista Centrallager. Använd verktyget när agenten behöver kontrollera en produkts variant, SKU, pris, lagersaldo, leveransinformation, försäljningsstatus eller påfyllnadskod. Verktyget returnerar listposter men skapar eller ändrar inga beställningar, reservationer eller leveranser.
```

## Globala instruktioner

De globala instruktionerna ska vara korta och gälla oavsett vilken produktfråga användaren ställer. Följande ska finnas kvar genom kursen:

- agentens roll och område
- krav på att grunda svar i anslutna källor och verktyg
- en generell regel om korta och fokuserade följdfrågor
- förbud mot att hitta på produkt-, lager-, pris- eller leveransuppgifter
- krav på verktygsbekräftelse innan agenten påstår att något har skapats eller godkänts
- språk, svarsstil och säkerhetsgränser

Efter att den publika webbplatsen har anslutits läggs två tillfälliga regler under **Arbetssätt**:

```text
Använd Lysernos publika webbplats som primär källa för att verifiera showroomets namn, typ, land, region, adress och öppettider. Fråga inte efter uppgifter som redan kan verifieras.

Om flera showroom matchar användarens beskrivning och rätt showroom inte kan identifieras ska du ställa en kort följdfråga.
```

I nästa kapitel kompletteras instruktionerna med det tillfälliga avsnittet **Showroompåfyllning**, som beskriver hur produktkatalogen och Centrallager ska användas. När den första skillen har skapats flyttas både webbplatsreglerna och showroomprocessen till skillen. De globala instruktionerna får då följande hänvisning:

```text
Showroompåfyllning

För förfrågningar om showroompåfyllning ska du använda skillen `showroom-pafyllning`.
```

Den generella följdfrågeregeln ligger kvar:

```text
Ställ en kort och fokuserad följdfråga när avgörande information saknas.
```

## Återkommande test

Kursen återkommer till samma fråga när agenten får nya förmågor:

```text
Vi behöver fylla på showroom Göteborg med gröna bordslampor. Vilka modeller i sortimentet kan vi välja mellan för vanlig showroompåfyllning?
```

Frågan anger showroomort och produktbehov men lämnar produktval och antal öppna. Agenten ska använda webbplatsen för att verifiera showroominformationen och fråga efter sådant som fortfarande saknas när produktalternativen har presenterats.

Flera gröna bordslampor kan matcha behovet:

- **Arcus T1 – Skogsgrön** passar skrivbord och reception och är märkt `RC10`.
- **Terra T5 – Skogsgrön keramik** ger ett varmare arbetsljus och är märkt `RC10`.
- **Linea T6 – Mörkgrön** är den starkaste produktmatchningen för fokuserat bildskärmsarbete men är märkt `RC90`.

Detta gör att agenten måste skilja mellan bästa produktmatchning och produkter som får beställas genom standardprocessen.

## Data och regler

SharePoint-listan innehåller bland annat SKU, modell-id, variant, bildadress, styckpris, lagersaldo, reserverat antal, inkommande antal, nästa påfyllnadsdatum, försäljningsstatus och påfyllnadskod.

Disponibelt saldo beräknas som:

```text
OnHandQuantity - ReservedQuantity
```

Påfyllnadskoderna tolkas i skillen:

- `RC10`: produkten får användas för vanlig showroompåfyllning
- `RC90`: produkten får inte beställas genom vanlig showroompåfyllning, även om `SalesStatus` är `Available` och disponibelt saldo är större än noll

Koderna ska inte förklaras i det senare styrdokumentet. De är ett exempel på företagsspecifik kunskap som hör till arbetssättet i skillen.

Alla värden i `CurrentUnitPrice` är styckpriser i SEK. Datum ska visas som läsbara svenska datum efter konvertering till svensk tidszon. Agenten ska använda bildadressen från SharePoint och får inte skapa egna adresser.

## Hur produkterna ska presenteras

När agenten har tillräcklig information ska den visa alla relevanta träffar utan långa produkttexter. Den avsedda strukturen är en kompakt tabell med exempelvis:

```text
Val | Produkt och användning | Pris/st | Disponibelt | Bild
```

Beställningsbara alternativ får bokstäverna A, B och så vidare. Bokstaven kopplas internt till rätt SKU och SharePoint Item ID. Produkter med `RC90` visas separat som relevanta men inte beställningsbara. Agenten frågar därefter vilket tillåtet alternativ användaren vill gå vidare med, vilket antal som behövs och eventuell showroominformation som inte har kunnat verifieras.

Bildstorleken behöver verifieras i Copilot Studios faktiska återgivning. Markdown anger bildadressen men garanterar inte en viss storlek. Om bilderna fortfarande blir för stora kan kursen behöva separata miniatyrbilder.

## Kursens stegvisa uppbyggnad

### 1. Baslinje

Agenten skapas med globala instruktioner men utan Lysernos källor. Testfrågan visar att agenten inte kan verifiera några produkter.

### 2. Kunskap

Produktkatalogen och den publika webbplatsen ansluts. Agenten kan hitta produkter och showroom, men saknar aktuell lagerinformation.

### 3. SharePoint-verktyg och tillfälliga instruktioner

Verktyget **Hämta produkter från Centrallager** ansluts. De globala instruktionerna kompletteras tillfälligt med fältmappning, saldoberäkning, `SalesStatus`, `RC10`, `RC90`, SEK, datum, bilder och hur produktval ska presenteras.

### 4. Skill version 1

`showroom-pafyllning` samlar arbetssättet för att identifiera showroom, matcha behovet, kontrollera Centrallager och presentera produktval. De showroomspecifika reglerna tas samtidigt bort från agentens globala instruktioner och ersätts med en kort hänvisning till skillen.

### 5. Internt styrdokument och skill version 2

Ett Word-dokument tillför regler för mängdgränser, lagerbuffert och manuell granskning. Skill V2 använder styrdokumentet för att avgöra om en begäran kan följa standardprocessen.

Reglerna är:

- svensk showroomstudio: högst 5 exemplar per SKU och minst 2 disponibla exemplar kvar
- svenskt flagship-showroom: högst 10 exemplar per SKU och ingen särskild lagerbuffert
- showroomstudio utanför Sverige: högst 3 exemplar per SKU och minst 2 disponibla exemplar kvar

### 6. Skapa arbetsflödet

Arbetsflödet **Hantera showroompåfyllning** skapas i två kapitel. Det tar emot:

- `ItemID`
- `Quantity`
- `ShowroomName`
- `ShowroomType`
- `Country`

Arbetsflödet hämtar produktvarianten på nytt och kontrollerar aktuellt saldo samt reglerna för antal och lagerbuffert. Standardvägen uppdaterar `ReservedQuantity` och skickar ett bekräftelsemejl. Övriga begäranden skickas för manuell granskning utan att lagret ändras. Båda vägarna returnerar `ResultStatus` och `ResultMessage`.

### 7. Slutlig skill version 3

Skill V3 ber om en slutlig bekräftelse, anropar **Hantera showroompåfyllning** och återger arbetsflödets resultat. Den påstår bara att något har skickats eller reserverats när arbetsflödet bekräftar det.

## Medvetna avgränsningar

- Skillen ansvarar för att produkten är tillåten enligt `SalesStatus` och `ReplenishmentCode`. Arbetsflödet kontrollerar inte dessa fält på nytt.
- Agenten ska skicka `Quantity` som ett positivt heltal. Kursens arbetsflöde har ingen separat heltalsvalidering.
- En produktionslösning bör lägga samma kontroller i arbetsflödet och hantera samtidiga reservationer.
- Bildstorleken beror på hur Copilot Studio återger externa bildadresser. Kursen använder `ImageSource` och visar en bildlänk när en liten bild inte stöds.
- Anslutna agenter och MCP sparas till en senare fördjupning.

Den sammanhållande kursresan är:

```text
produktbehov → produktkunskap → showroom → aktuell lagerdata → produktval → intern policy → arbetsflöde
```
