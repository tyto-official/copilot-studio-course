# 9. Slutför agentflödet

I förra kapitlet byggde du flödets indata, beräkningar och tre grenar för standardprocessen. Nu kopplar du grenarna till de åtgärder som reserverar lagret eller skickar begäran för manuell granskning.

När kapitlet är klart kan arbetsflödet:

- uppdatera `ReservedQuantity` när en begäran uppfyller standardvillkoren
- skicka rätt mejl för standardprocess eller manuell granskning
- returnera `ResultStatus` och `ResultMessage`
- publiceras och användas av agenten

!!! info "Två vägar genom samma flöde"
    De tre standardgrenarna går till samma reservationsväg. Grenen **Annars** ändrar inte lagret utan skickar underlaget för manuell granskning. Båda vägarna avslutas i samma svarsnod.

---

## Del 1: Förbered reservationen

Välj plustecknet efter en av de tre standardgrenarna och klicka på **Lägg till ett steg**.

![Ett steg läggs till efter en standardgren](../../assets/nextgen/chap09/1.png)

Välj åtgärden **Variabel**.

![Variabel väljs i listan över åtgärder](../../assets/nextgen/chap09/2.png)

Dra sedan anslutningar från de två andra standardgrenarna till samma variabelnod. Grenen **Annars** ska inte anslutas hit.

![De tre standardgrenarna ansluts till samma variabelnod](../../assets/nextgen/chap09/3.png)

Öppna noden och byt namn på den till:

```text
Förbered reservation
```

![Variabelnodens namn kan ändras](../../assets/nextgen/chap09/4.png)

Välj **Initiera variabel** och ange namnet:

```text
NewReservedQuantity
```

Välj typen **Float**. Variabeln ska innehålla det nya totalvärdet för SharePoint-kolumnen `ReservedQuantity`.

![NewReservedQuantity skapas som en variabel av typen Float](../../assets/nextgen/chap09/5.png)

Välj ikonen **Växla till uttrycksläge** vid fältet **Värde**.

![Värdefältet för NewReservedQuantity växlas till uttrycksläge](../../assets/nextgen/chap09/6.png)

Börja med att skriva funktionen:

```text
add()
```

![Funktionen add har skrivits in](../../assets/nextgen/chap09/7.png)

Placera markören mellan parenteserna och öppna dynamiskt innehåll. Sök efter:

```text
ReservedQuantity
```

Välj värdet från **Hämta vald produktvariant**.

![ReservedQuantity väljs från Hämta vald produktvariant](../../assets/nextgen/chap09/8.png)

Skriv ett kommatecken efter värdet.

![ReservedQuantity är den första parametern i add-funktionen](../../assets/nextgen/chap09/9.png)

Öppna dynamiskt innehåll och sök efter:

```text
Quantity
```

Välj värdet från **When an agent calls the flow**.

![Quantity väljs från flödets indata](../../assets/nextgen/chap09/10.png)

Det färdiga uttrycket ska motsvara följande:

```text
@add(outputs('Hämta_vald_produktvariant')?['body/field_7'],triggerOutputs()?['body/number_1'])
```

`NewReservedQuantity` är det nya totala reserverade antalet. Om 8 exemplar redan är reserverade och begäran gäller 2 blir värdet 10.

![NewReservedQuantity är färdigkonfigurerad](../../assets/nextgen/chap09/11.png)

Välj **Uppdatera variabel** och välj `ResultStatus`.

![ResultStatus väljs i en ny uppdatering](../../assets/nextgen/chap09/12.png)

Behåll åtgärden **Set variable** och ange värdet:

```text
reserverad
```

![ResultStatus sätts till reserverad](../../assets/nextgen/chap09/13.png)

Välj **Uppdatera variabel** igen och välj `ResultMessage`.

![ResultMessage väljs i nästa uppdatering](../../assets/nextgen/chap09/14.png)

Växla värdefältet till uttrycksläge.

![Värdefältet för ResultMessage växlas till uttrycksläge](../../assets/nextgen/chap09/15.png)

Skriv först meddelandet med platshållare:

```text
[Quantity] st av [Title] har reserverats för [ShowroomName]. Bekräftelsemejlet har skickats.
```

![ResultMessage innehåller tre platshållare](../../assets/nextgen/chap09/16.png)

Ta bort `[Quantity]` och sök efter:

```text
Quantity
```

Välj värdet från **When an agent calls the flow**.

![Quantity ersätter den första platshållaren](../../assets/nextgen/chap09/17.png)

Ta bort `[Title]` och sök efter:

```text
Title
```

Välj värdet från **Hämta vald produktvariant**.

![Title ersätter produktens platshållare](../../assets/nextgen/chap09/18.png)

Ta bort `[ShowroomName]` och sök efter:

```text
ShowroomName
```

Välj värdet från **When an agent calls the flow**.

![ShowroomName ersätter den sista platshållaren](../../assets/nextgen/chap09/19.png)

Det färdiga värdet ska motsvara följande:

```text
@{triggerOutputs()?['body/number_1']} st av @{outputs('Hämta_vald_produktvariant')?['body/Title']} har reserverats för @{triggerOutputs()?['body/text']}. Bekräftelsemejlet har skickats.
```

![ResultMessage för en genomförd reservation är färdig](../../assets/nextgen/chap09/20.png)

---

## Del 2: Uppdatera reserverat antal i Centrallager

Lägg till ett steg efter **Förbered reservation**.

![Ett steg läggs till efter Förbered reservation](../../assets/nextgen/chap09/21.png)

Sök efter:

```text
Uppdatera objektet
```

Välj SharePoint-åtgärden med det namnet.

![SharePoint-åtgärden Uppdatera objektet väljs](../../assets/nextgen/chap09/22.png)

Byt namn på noden till:

```text
Uppdatera reserverat antal
```

![SharePoint-nodens namn kan ändras](../../assets/nextgen/chap09/23.png)

Välj **Lyserno Produktportal** under **Webbplatsadress** och **Centrallager** under **Listnamn**.

![Webbplatsen och listan Centrallager är valda](../../assets/nextgen/chap09/24.png)

Klicka i fältet **ID** och öppna dynamiskt innehåll. Sök efter:

```text
ItemID
```

Välj `ItemID` från **When an agent calls the flow**.

![ItemID söks fram och väljs från When an agent calls the flow](../../assets/nextgen/chap09/25.png)

Leta upp fältet **Reserved quantity**. Öppna dynamiskt innehåll och sök efter:

```text
NewReservedQuantity
```

Välj variabeln under **Variables**.

![NewReservedQuantity söks fram under Variables](../../assets/nextgen/chap09/26.png)

`NewReservedQuantity` visas nu i fältet **Reserved quantity**.

![NewReservedQuantity används som nytt värde för Reserved quantity](../../assets/nextgen/chap09/27.png)

Uppdatera inga andra SharePoint-fält. Noden ska bara skriva det nya värdet till `ReservedQuantity` för det objekt som identifieras av `ItemID`.

---

## Del 3: Skicka reservationsbekräftelsen

Lägg till ett steg efter **Uppdatera reserverat antal**.

![Ett steg läggs till efter Uppdatera reserverat antal](../../assets/nextgen/chap09/28.png)

Sök efter:

```text
Skicka e-postmeddelande
```

Välj åtgärden från **Office 365 Outlook**.

![Skicka e-postmeddelande väljs från Office 365 Outlook](../../assets/nextgen/chap09/29.png)

Byt namn på noden till:

```text
Skicka reservationsbekräftelse
```

![Mejlnodens namn kan ändras](../../assets/nextgen/chap09/30.png)

Välj dig själv som mottagare i fältet **Till**. Skriv sedan följande ämne med platshållare:

```text
Showroompåfyllning reserverad: [ShowroomName], [Quantity] st
```

![Mottagaren är vald och ämnesfältet är redo](../../assets/nextgen/chap09/31.png)

Ta bort `[ShowroomName]` och sök efter:

```text
ShowroomName
```

Välj värdet från **When an agent calls the flow**.

![ShowroomName väljs för mejlets ämne](../../assets/nextgen/chap09/32.png)

Ta bort `[Quantity]` och sök efter:

```text
Quantity
```

Välj värdet från samma utlösare.

![Quantity väljs för mejlets ämne](../../assets/nextgen/chap09/33.png)

Det färdiga ämnet ska motsvara:

```text
Showroompåfyllning reserverad: @{triggerOutputs()?['body/text']}, @{triggerOutputs()?['body/number_1']} st
```

![Ämnet innehåller ShowroomName och Quantity](../../assets/nextgen/chap09/34.png)

Klistra in följande text i mejlets brödtext:

```text
Hej,

Följande showroompåfyllning uppfyller villkoren för standardprocessen. Det önskade antalet har reserverats i Centrallager.

Showroom: [ShowroomName]
Showroomtyp: [ShowroomType]
Land: [Country]

Produkt: [Title]
SKU: [SKU]
Antal: [Quantity] st
Pris per styck: [CurrentUnitPrice] kr
Totalt produktpris: [TotalProductPrice] kr

Disponibelt saldo efter reservationen: [RemainingAvailableQuantity] st

Underlaget är klart för plockning och leveransplanering. Reservationen innebär inte att leveransen är bokad.

Vänliga hälsningar,
Lyserno Produktassistent
```

Ersätt sedan varje platshållare med dynamiskt innehåll. Börja med `[ShowroomName]`. Sök efter:

```text
ShowroomName
```

Välj värdet från utlösaren.

![ShowroomName väljs för mejlets brödtext](../../assets/nextgen/chap09/35.png)

Ersätt `[ShowroomType]`. Sök efter:

```text
ShowroomType
```

Välj värdet från utlösaren.

![ShowroomType väljs för mejlets brödtext](../../assets/nextgen/chap09/36.png)

Ersätt `[Country]`. Sök efter:

```text
Country
```

Välj värdet från utlösaren.

![Country väljs för mejlets brödtext](../../assets/nextgen/chap09/37.png)

Ersätt `[Title]`. Sök efter:

```text
Title
```

Välj värdet från **Hämta vald produktvariant**.

![Title väljs från Hämta vald produktvariant](../../assets/nextgen/chap09/38.png)

Ersätt `[SKU]`. Sök efter:

```text
SKU
```

Välj värdet från samma SharePoint-nod.

![SKU väljs från Hämta vald produktvariant](../../assets/nextgen/chap09/39.png)

Ersätt `[Quantity]`. Sök efter:

```text
Quantity
```

Välj värdet från utlösaren.

![Quantity väljs för mejlets brödtext](../../assets/nextgen/chap09/40.png)

Ersätt `[CurrentUnitPrice]`. Sök efter:

```text
CurrentUnitPrice
```

Välj värdet från **Hämta vald produktvariant**.

![CurrentUnitPrice väljs från Hämta vald produktvariant](../../assets/nextgen/chap09/41.png)

Ersätt `[TotalProductPrice]`. Sök efter:

```text
TotalProductPrice
```

Välj variabeln under **Variables**.

![TotalProductPrice väljs från Variables](../../assets/nextgen/chap09/43.png)

Ersätt `[RemainingAvailableQuantity]`. Sök efter:

```text
RemainingAvailableQuantity
```

Välj variabeln under **Variables**.

![RemainingAvailableQuantity väljs från Variables](../../assets/nextgen/chap09/44.png)

Kontrollera mottagare, ämne och mejltext. Produktuppgifterna ska komma från **Hämta vald produktvariant**, medan de beräknade värdena ska komma från **Variables**.

![Reservationsmejlet är färdigkonfigurerat](../../assets/nextgen/chap09/45.png)

---

## Del 4: Anslut standardvägen till svarsnoden

Dra en anslutning från **Skicka reservationsbekräftelse** till **Respond to the agent**.

![Reservationsmejlet ansluts till svarsnoden](../../assets/nextgen/chap09/46.png)

Markera den gamla direkta anslutningen från villkorsnoden till svarsnoden och välj **Ta bort**. Standardvägen ska nu gå genom reservationen, SharePoint-uppdateringen och mejlet innan den når svarsnoden.

![Den gamla direkta anslutningen tas bort](../../assets/nextgen/chap09/47.png)

---

## Del 5: Förbered manuell granskning

Välj plustecknet vid grenen **Annars** och klicka på **Lägg till ett steg**.

![Ett steg läggs till efter grenen Annars](../../assets/nextgen/chap09/48.png)

Välj åtgärden **Variabel**.

![Variabel väljs för grenen Annars](../../assets/nextgen/chap09/49.png)

Byt namn på noden till:

```text
Förbered manuell granskning
```

![Variabelnoden får namnet Förbered manuell granskning](../../assets/nextgen/chap09/50.png)

Välj **Uppdatera variabel** och välj `ResultStatus`.

![ResultStatus väljs för den manuella vägen](../../assets/nextgen/chap09/51.png)

Behåll åtgärden **Set variable** och ange värdet:

```text
skickad_for_granskning
```

![ResultStatus sätts till skickad_for_granskning](../../assets/nextgen/chap09/52.png)

Välj **Uppdatera variabel** igen och välj `ResultMessage`.

![ResultMessage väljs för den manuella vägen](../../assets/nextgen/chap09/53.png)

Växla värdefältet till uttrycksläge.

![Värdefältet för ResultMessage växlas till uttrycksläge](../../assets/nextgen/chap09/54.png)

Skriv meddelandet med platshållare:

```text
Begäran om [Quantity] st av [Title] till [ShowroomName] har skickats för manuell granskning. Ingen reservation har skapats.
```

Ta bort `[Quantity]` och sök efter:

```text
Quantity
```

Välj värdet från utlösaren.

![Quantity ersätter den första platshållaren](../../assets/nextgen/chap09/55.png)

Ta bort `[Title]` och sök efter:

```text
Title
```

Välj värdet från **Hämta vald produktvariant**.

![Title ersätter produktens platshållare](../../assets/nextgen/chap09/56.png)

Ta bort `[ShowroomName]` och sök efter:

```text
ShowroomName
```

Välj värdet från utlösaren.

![ShowroomName ersätter den sista platshållaren](../../assets/nextgen/chap09/57.png)

Det färdiga värdet ska motsvara följande:

```text
Begäran om @{triggerOutputs()?['body/number_1']} st av @{outputs('Hämta_vald_produktvariant')?['body/Title']} till @{triggerOutputs()?['body/text']} har skickats för manuell granskning. Ingen reservation har skapats.
```

![ResultMessage för manuell granskning är färdig](../../assets/nextgen/chap09/58.png)

---

## Del 6: Skicka begäran för manuell granskning

Lägg till ett steg efter **Förbered manuell granskning**.

![Ett steg läggs till efter Förbered manuell granskning](../../assets/nextgen/chap09/59.png)

Sök efter:

```text
Skicka e-postmeddelande
```

Välj åtgärden från **Office 365 Outlook**.

![Skicka e-postmeddelande väljs för den manuella vägen](../../assets/nextgen/chap09/60.png)

Byt namn på noden till:

```text
Skicka begäran för manuell granskning
```

![Mejlnoden får namnet Skicka begäran för manuell granskning](../../assets/nextgen/chap09/61.png)

Välj dig själv som mottagare i fältet **Till**. Skriv följande ämne med platshållare:

```text
Manuell granskning krävs: [ShowroomName], [Quantity] st
```

![Mottagaren är vald och ämnet innehåller platshållare](../../assets/nextgen/chap09/63.png)

Ta bort `[ShowroomName]` och sök efter:

```text
ShowroomName
```

Välj värdet från utlösaren.

![ShowroomName söks fram för ämnesraden](../../assets/nextgen/chap09/62.png)

Ta bort `[Quantity]` och sök efter:

```text
Quantity
```

Välj värdet från utlösaren.

![Quantity söks fram för ämnesraden](../../assets/nextgen/chap09/64.png)

Det färdiga ämnet ska motsvara:

```text
Manuell granskning krävs: @{triggerOutputs()?['body/text']}, @{triggerOutputs()?['body/number_1']} st
```

![Ämnet för manuell granskning är färdigt](../../assets/nextgen/chap09/65.png)

Klistra in följande text i mejlets brödtext:

```text
Hej,

Följande begäran om showroompåfyllning behöver granskas manuellt eftersom villkoren för standardprocessen inte är uppfyllda.

Showroom: [ShowroomName]
Showroomtyp: [ShowroomType]
Land: [Country]

Produkt: [Title]
SKU: [SKU]
Önskat antal: [Quantity] st
Pris per styck: [CurrentUnitPrice] kr
Totalt produktpris: [TotalProductPrice] kr

Beräknat disponibelt saldo efter en eventuell reservation: [RemainingAvailableQuantity] st

Ingen reservation har skapats och lagersaldot har inte ändrats av denna begäran.

Bedöm begäran enligt policyn för intern produktförsörjning. Kontrollera aktuellt lager innan en eventuell reservation görs och återkoppla beslutet till berört showroom.

Vänliga hälsningar,
Lyserno Produktassistent
```

Ersätt `[ShowroomName]`. Sök efter:

```text
ShowroomName
```

Välj värdet från utlösaren.

![ShowroomName väljs för granskningsmejlet](../../assets/nextgen/chap09/66.png)

Ersätt `[ShowroomType]`. Sök efter:

```text
ShowroomType
```

Välj värdet från utlösaren.

![ShowroomType väljs för granskningsmejlet](../../assets/nextgen/chap09/67.png)

Ersätt `[Country]`. Sök efter:

```text
Country
```

Välj värdet från utlösaren.

![Country väljs för granskningsmejlet](../../assets/nextgen/chap09/68.png)

Ersätt `[Title]`. Sök efter:

```text
Title
```

Välj värdet från **Hämta vald produktvariant**.

![Title väljs för granskningsmejlet](../../assets/nextgen/chap09/69.png)

Ersätt `[SKU]`. Sök efter:

```text
SKU
```

Välj värdet från samma SharePoint-nod.

![SKU väljs för granskningsmejlet](../../assets/nextgen/chap09/70.png)

Ersätt `[Quantity]`. Sök efter:

```text
Quantity
```

Välj värdet från utlösaren.

![Quantity väljs för granskningsmejlet](../../assets/nextgen/chap09/71.png)

Ersätt `[CurrentUnitPrice]`. Sök efter:

```text
CurrentUnitPrice
```

Välj värdet från **Hämta vald produktvariant**.

![CurrentUnitPrice väljs för granskningsmejlet](../../assets/nextgen/chap09/72.png)

Ersätt `[TotalProductPrice]`. Sök efter:

```text
TotalProductPrice
```

Välj variabeln under **Variables**.

![TotalProductPrice väljs för granskningsmejlet](../../assets/nextgen/chap09/73.png)

Ersätt `[RemainingAvailableQuantity]`. Sök efter:

```text
RemainingAvailableQuantity
```

Välj variabeln under **Variables**.

![RemainingAvailableQuantity väljs för granskningsmejlet](../../assets/nextgen/chap09/74.png)

Kontrollera att mejlet tydligt säger att ingen reservation har skapats.

![Mejlet för manuell granskning är färdigkonfigurerat](../../assets/nextgen/chap09/75.png)

---

## Del 7: Returnera resultatet till agenten

Dra en anslutning från **Skicka begäran för manuell granskning** till den befintliga svarsnoden. Både standardvägen och den manuella vägen ska nu nå samma nod.

![Båda vägarna ansluts till svarsnoden](../../assets/nextgen/chap09/76.png)

Byt namn på **Respond to the agent** till:

```text
Returnera resultat
```

![Svarsnodens namn kan ändras](../../assets/nextgen/chap09/77.png)

Öppna noden och välj **Lägg till utdata**.

![Returnera resultat är redo för utdata](../../assets/nextgen/chap09/78.png)

Välj typen **Text**.

![Text väljs som typ för den första utdatan](../../assets/nextgen/chap09/79.png)

Ange namnet:

```text
ResultStatus
```

Öppna dynamiskt innehåll och välj variabeln `ResultStatus` under **Variables**.

![ResultStatus används som den första utdatan](../../assets/nextgen/chap09/80.png)

Välj **Lägg till utdata** igen och välj typen **Text**.

![Text väljs som typ för den andra utdatan](../../assets/nextgen/chap09/81.png)

Ange namnet:

```text
ResultMessage
```

Öppna dynamiskt innehåll och välj variabeln `ResultMessage`.

![ResultMessage väljs från Variables](../../assets/nextgen/chap09/82.png)

Kontrollera att svarsnoden innehåller båda värdena:

| Utdata | Värde |
| --- | --- |
| `ResultStatus` | `ResultStatus` |
| `ResultMessage` | `ResultMessage` |

![ResultStatus och ResultMessage är färdigkonfigurerade](../../assets/nextgen/chap09/83.png)

---

## Del 8: Kontrollera och publicera flödet

Kontrollera den färdiga flödesbilden. Standardgrenarna ska gå genom reservation, SharePoint-uppdatering och bekräftelsemejl. Grenen **Annars** ska gå genom manuell granskning utan att passera SharePoint-uppdateringen.

![Det färdiga agentflödet med standardväg och manuell väg](../../assets/nextgen/chap09/84.png)

Välj **Publicera** uppe till höger.

![Knappen Publicera i det färdiga arbetsflödet](../../assets/nextgen/chap09/85.png)

!!! success "Agentflödet är färdigt"
    Flödet kan nu reservera ett godkänt antal eller skicka begäran för manuell granskning. Båda vägarna returnerar ett resultat som agenten kan återge för användaren.
