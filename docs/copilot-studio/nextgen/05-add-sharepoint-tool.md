# 5. Anslut Centrallager som verktyg

Lyserno Produktassistent kan nu hitta produkter i katalogen och information om företagets showrooms. Uppgifter som pris, lagersaldo och kommande påfyllning förändras däremot ofta. Därför ska de hämtas från SharePoint när agenten behöver dem.

I det här kapitlet kommer du att:

- se vilka typer av verktyg som kan läggas till i en agent
- lägga till SharePoint-åtgärden **Hämta objekten**
- avgränsa verktyget till webbplatsen Lyserno Produktportal och listan Centrallager
- ge verktyget ett tydligt namn och en tydlig beskrivning
- uppdatera agentens instruktioner så att lagerinformationen används på rätt sätt
- testa att agenten kan kombinera produktkatalogen med aktuella uppgifter från Centrallager

!!! info "Kunskap och verktyg har olika roller"
    Kunskapskällorna innehåller stabil information om sortimentet och företagets showrooms. Verktyget hämtar aktuell, strukturerad information från SharePoint när den behövs i samtalet.

---

## Del 1: Öppna Verktyg

Gå till fliken **Bygg** för Lyserno Produktassistent. Välj plustecknet vid **Verktyg** i panelen till höger.

![Lyserno Produktassistent på fliken Bygg med plustecknet vid Verktyg](../../assets/nextgen/chap05/1.png)

Dialogrutan **Lägg till verktyg** öppnas på fliken **Utvalt**.

![Dialogrutan Lägg till verktyg på fliken Utvalt](../../assets/nextgen/chap05/2.png)

---

## Del 2: Se vilka verktygstyper som finns

Ett verktyg ger agenten tillgång till data eller åtgärder utanför den vanliga konversationen. Copilot Studio kan bland annat använda MCP-servrar, anslutningsprogram och arbetsflöden.

### MCP

En MCP-server använder **Model Context Protocol** för att göra en samling verktyg tillgänglig genom ett gemensamt gränssnitt. Vilka data och åtgärder agenten kan använda styrs fortfarande av användarens behörigheter och organisationens policyer.

![Fliken MCP med tillgängliga MCP-servrar](../../assets/nextgen/chap05/3.png)

### Anslutningsprogram

Anslutningsprogram innehåller färdiga integrationer med Microsoft-tjänster och andra system. Varje anslutningsprogram har avgränsade åtgärder. SharePoint innehåller till exempel olika åtgärder för att hämta, skapa och uppdatera listobjekt.

![Fliken Anslutningsprogram med tillgängliga anslutningsprogram](../../assets/nextgen/chap05/4.png)

### Arbetsflöden

Ett arbetsflöde passar när agenten ska starta en process med flera bestämda steg. Vi bygger ett sådant arbetsflöde senare i kursen.

![Fliken Arbetsflöden med flöden som kan anropas av agenten](../../assets/nextgen/chap05/5.png)

Knappen **Lägg till** kan också användas för att ansluta en MCP-server eller skapa ett arbetsflöde.

![Menyn Lägg till med alternativen MCP och Arbetsflöde](../../assets/nextgen/chap05/6.png)

I den här övningen behöver agenten läsa från en bestämd SharePoint-lista. Därför använder vi ett anslutningsprogram.

---

## Del 3: Lägg till Hämta objekten

Öppna fliken **Anslutningsprogram** och sök efter:

```text
Hämta objekten
```

Välj SharePoint-åtgärden **Hämta objekten**.

![Sökresultat med SharePoint-åtgärderna Hämta objekten och Hämta objektet](../../assets/nextgen/chap05/7.png)

!!! warning "Välj Hämta objekten i plural"
    **Hämta objekten** kan returnera flera rader från listan. **Hämta objektet** hämtar en enda rad och kräver att objektets SharePoint-ID redan är känt.

Kontrollera att åtgärden kommer från **SharePoint** och välj **Lägg till**.

![Detaljsidan för SharePoint-åtgärden Hämta objekten](../../assets/nextgen/chap05/8.png)

När åtgärden har lagts till visas den under **Verktyg**. Klicka på **Hämta objekten** för att konfigurera den.

![Hämta objekten visas under Verktyg](../../assets/nextgen/chap05/9.png)

---

## Del 4: Namnge verktyget

Under **Information** ser du verktygets namn, beskrivning och autentiseringsläge.

![Verktygsdetaljer för Hämta objekten före ändringen](../../assets/nextgen/chap05/10.png)

Ändra **Namn** till:

```text
Hämta produkter från Centrallager
```

Ersätt beskrivningen med:

```text
Hämtar aktuella produktposter från Lysernos SharePoint-lista Centrallager. Använd verktyget när agenten behöver kontrollera en produkts variant, SKU, pris, lagersaldo, leveransinformation, försäljningsstatus eller påfyllnadskod. Verktyget returnerar listposter men skapar eller ändrar inga beställningar, reservationer eller leveranser.
```

![Verktyget har fått ett nytt namn och en ny beskrivning](../../assets/nextgen/chap05/11.png)

Namnet hjälper agenten att förstå vad verktyget hämtar. Beskrivningen förklarar när verktyget ska användas och att det bara läser information.

Låt autentiseringsläget vara **Användare**. Anslutningen använder då den inloggade användarens behörigheter.

---

## Del 5: Ange en fast webbplatsadress

Välj **Indata** i vänstermenyn. Här bestämmer du vilka värden som ska skickas till SharePoint.

![Indata med webbplatsadress och listnamn som fylls i av AI](../../assets/nextgen/chap05/12.png)

För **Webbplatsadress** är **AI** valt från början. Då försöker agenten själv ange en webbplats vid varje anrop. Verktyget ska alltid läsa från samma webbplats, så välj i stället **Värde**.

Öppna fältet **Välj** och välj **Ny**.

![Webbplatsadress ändras från AI till Värde](../../assets/nextgen/chap05/13.png)

![Menyn Variabler med alternativet Ny](../../assets/nextgen/chap05/14.png)

En ny variabel av typen `String` skapas. Behåll det automatiskt skapade namnet. Öppna listan **Webbplatsadress** och välj:

```text
Lyserno Produktportal
```

Välj sedan **Spara**.

![Lyserno Produktportal väljs som webbplatsadress](../../assets/nextgen/chap05/15.png)

Webbplatsen visas nu som ett fast värde i verktygets indata.

![Lyserno Produktportal är vald som fast webbplatsadress](../../assets/nextgen/chap05/16.png)

---

## Del 6: Ange ett fast listnamn

Gå vidare till **Listnamn**. Välj **Värde**, öppna fältet **Välj** och välj **Ny**.

![Listnamn ändras från AI till Värde](../../assets/nextgen/chap05/17.png)

En ny variabel av typen `String` skapas även här. Behåll det automatiskt skapade namnet och öppna listan **Listnamn**.

![En ny variabel skapas för listnamnet](../../assets/nextgen/chap05/18.png)

Välj **Centrallager**.

![Centrallager har valts som listnamn](../../assets/nextgen/chap05/19.png)

Välj sedan **Spara**.

![Det fasta värdet Centrallager är klart att sparas](../../assets/nextgen/chap05/20.png)

Listan visas nu som ett fast värde i verktygets indata.

![Centrallager är valt som fast listnamn](../../assets/nextgen/chap05/21.png)

!!! info "Varför använder vi fasta värden?"
    Agenten ska inte välja webbplats och lista vid varje anrop. Verktyget är avgränsat till den datakälla som kursen använder, medan agenten fortfarande kan avgöra vilka produktposter som är relevanta för frågan.

---

## Del 7: Granska utdata och slutför

Välj **Utdata** i vänstermenyn. Åtgärden returnerar listobjekten i fältet `Value`. Du behöver inte ändra något här.

![Utdata från Hämta objekten består av en objektlista](../../assets/nextgen/chap05/22.png)

Välj **Klar** nere till höger.

Verktyget visas nu med sitt nya namn under **Verktyg**.

![Hämta produkter från Centrallager visas under Verktyg](../../assets/nextgen/chap05/23.png)

---

## Del 8: Uppdatera agentens instruktioner

Ett verktyg används inte automatiskt bara för att det har lagts till. Agenten behöver också förstå när verktyget ska anropas och hur resultatet ska tolkas.

Öppna agentens instruktioner. Lägg till följande text sist under **Arbetssätt**. Låt agentens övriga instruktioner ligga kvar.

```text
Showroompåfyllning

Matcha behovet mot Lyserno Lighting Collection 2026. Kontrollera sedan matchande modeller och varianter med Hämta produkter från Centrallager.

Verktygets fält:
Title = produktnamn
field_1 = SKU
field_2 = ProductModelID
field_3.Value = Variant
field_4 = ImageSource
field_5 = CurrentUnitPrice
field_6 = OnHandQuantity
field_7 = ReservedQuantity
field_8 = IncomingQuantity
field_9 = NextRestockDate
field_10.Value = SalesStatus
field_11.Value = ReplenishmentCode
ID = SharePoint Item ID

Matcha med ProductModelID och Variant. SKU identifierar produktvarianten.

Disponibelt saldo = OnHandQuantity − ReservedQuantity. Inkommande antal räknas inte som disponibelt. Redovisa inkommande antal och påfyllnadsdatum separat när det är relevant, utan att lova leverans det datumet.

Regler för vanlig showroompåfyllning:

- Available och RC10: får väljas om disponibelt saldo räcker.
- RC90: får inte beställas genom vanlig showroompåfyllning, oavsett SalesStatus och saldo.
- Blocked: får inte beställas, oavsett ReplenishmentCode och saldo.
- Backorder: inte omedelbart tillgänglig.
- Saknad eller okänd status eller kod: får inte tolkas som tillåten.

Om antalet saknas får tillåtna produkter med positivt saldo visas, men bekräfta inte att saldot räcker för användarens behov.

Visa alla tydliga produktmatchningar, inte bara huvudrekommendationen. Presentera valbara produkter i en tabell med endast Val, Produkt och användning, Pris/st, Disponibelt och Bild.

Ange produktens namn, variant och en kort motivering under Produkt och användning. Visa spärrade produkter och produkter med otillräckligt saldo separat med en kort förklaring.

Visa styckpriser i SEK, exempelvis 1 995 kr/st, och datum i svensk tidszon.

Använd ImageSource för små miniatyrbilder, cirka 80–120 pixlar breda. Visa en bildlänk om små bilder inte stöds. Ändra inte bildadressen och utelämna bilden om adressen saknas.

Vid flera valbara produkter, märk dem A, B och så vidare. Koppla varje bokstav till rätt SKU och SharePoint Item ID utan att visa ID:t. Vid endast en valbar produkt, använd ingen bokstav.

När produkterna har presenterats ska du i samma meddelande fråga efter:

- vilket alternativ användaren vill gå vidare med, om det finns flera valbara produkter
- om användaren vill gå vidare med produkten, om endast en är valbar
- önskat antal
- showroomets namn, typ eller land om någon av uppgifterna fortfarande inte har kunnat verifieras

Fråga inte på nytt efter information som redan finns i samtalet eller har verifierats med Lysernos publika webbplats.

När användaren har valt produkt och angett antal ska du kontrollera om det aktuella disponibla saldot räcker. Sammanfatta därefter showroom, produkt, SKU, antal, styckpris och aktuellt disponibelt saldo. Ange om saldot räcker för det önskade antalet.

Påstå inte att en beställning eller reservation har skapats.
```

![Instruktionerna har kompletterats med regler för showroompåfyllning och Centrallager](../../assets/nextgen/chap05/24.png)

Välj **Spara** med diskettikonen högst upp på sidan.

Instruktionerna gör fyra saker:

1. anger hur webbplatsen, produktkatalogen och Centrallager ska användas tillsammans
2. översätter SharePoints interna fältnamn till verksamhetens begrepp
3. styr vilka produkter som får väljas i standardprocessen
4. samlar produktval, antal och eventuell saknad showroominformation i samma fråga

---

## Del 9: Testa verktyget

Öppna **Förhandsgranska** och testa med:

```text
Vi behöver fylla på showroom Göteborg med gröna bordslampor. Vilka modeller i sortimentet kan vi välja mellan för vanlig showroompåfyllning?
```

Första gången verktyget används kan du behöva godkänna anslutningens behörigheter. Välj **Approve** och kör frågan igen om agenten ber om det.

![Agenten ber om tillåtelse att använda SharePoint](../../assets/nextgen/chap05/25.png)

Kontrollera att svaret:

- innehåller aktuellt pris och disponibelt saldo från Centrallager
- skiljer valbara produkter från spärrade produkter
- inte räknar inkommande antal som disponibelt
- ber användaren välja produkt och ange antal i samma meddelande

![Agenten visar valbara produkter med pris, disponibelt saldo och bild](../../assets/nextgen/chap05/26.png)

!!! success "Centrallager är anslutet"
    Agenten kan nu kombinera produktkatalogen med aktuella uppgifter från SharePoint. Verktyget läser bara data och skapar inga beställningar eller reservationer.
