# 8. Skapa agentflödet

Agenten kan nu hitta en produkt, kontrollera lagret och bedöma om en begäran passar standardprocessen. Nästa steg är att bygga arbetsflödet som hämtar produktvarianten på nytt och kontrollerar aktuellt saldo samt reglerna för antal och lagerbuffert när användaren vill gå vidare.

Arbetsflödet ska senare kunna reservera det önskade antalet eller skicka begäran för manuell granskning. I den här första delen skapar du flödet, definierar dess indata, hämtar produktvarianten och bygger villkorslogiken.

När den här delen är klar har du:

- skapat arbetsflödet **Hantera showroompåfyllning**
- lagt till de fem värden som agenten ska skicka
- hämtat rätt produktvariant från Centrallager
- beräknat kvarvarande disponibelt saldo och totalt produktpris
- byggt tre grenar för standardprocessen
- lämnat övriga giltiga begäranden till grenen för manuell granskning

!!! info "Skillen och arbetsflödet kontrollerar olika delar"
    I kursens lösning ansvarar skillen för att produkten är tillåten för vanlig showroompåfyllning. Arbetsflödet hämtar produktvarianten på nytt och kontrollerar aktuellt saldo samt reglerna för antal och lagerbuffert innan något ändras. Det utgår från att agenten skickar ett positivt heltal. En produktionslösning bör även kontrollera `SalesStatus`, `ReplenishmentCode` och att `Quantity` är ett positivt heltal direkt i arbetsflödet.

---

## Del 1: Skapa ett arbetsflöde

Gå till fliken **Bygg** för Lyserno Produktassistent. Välj plustecknet vid **Verktyg** i panelen till höger.

![Plustecknet vid Verktyg i agentens högra panel](../../assets/nextgen/chap08/1.png)

Välj **Lägg till** och sedan **Arbetsflöde**.

![Arbetsflöde väljs i dialogrutan Lägg till ett verktyg](../../assets/nextgen/chap08/2.png)

Copilot Studio öppnar ett nytt agentflöde med en utlösare och en svarsnod.

![Ett nytt agentflöde med utlösare och svarsnod](../../assets/nextgen/chap08/3.png)

Byt namn på arbetsflödet till:

```text
Hantera showroompåfyllning
```

![Arbetsflödet har fått namnet Hantera showroompåfyllning](../../assets/nextgen/chap08/4.png)

---

## Del 2: Lägg till flödets indata

Öppna utlösaren **När en agent anropar arbetsflödet**. Namnet hör till utlösartypen och kan inte ändras.

![Utlösaren När en agent anropar arbetsflödet](../../assets/nextgen/chap08/5.png)

Välj **Lägg till indata** och börja med typen **Number**.

![Tillgängliga indatatyper med Number markerat](../../assets/nextgen/chap08/6.png)

Skapa först `ItemID`.

Namn:

```text
ItemID
```

Beskrivning:

```text
SharePoint-ID för den valda produktvarianten i listan Centrallager. Använd inte SKU eller ProductModelID.
```

![ItemID har lagts till som numerisk indata](../../assets/nextgen/chap08/7.png)

Välj **Lägg till indata** igen och välj **Number**.

![En andra numerisk indata läggs till](../../assets/nextgen/chap08/8.png)

Namn:

```text
Quantity
```

Beskrivning:

```text
Antal enheter som användaren har bekräftat. Måste vara ett positivt heltal.
```

![ItemID och Quantity är klara och typen Text kan väljas](../../assets/nextgen/chap08/9.png)

Välj **Lägg till indata**, välj **Text** och skapa `ShowroomName`.

Namn:

```text
ShowroomName
```

Beskrivning:

```text
Verifierat exakt namn på det showroom som ska ta emot produkterna.
```

![ShowroomName har lagts till som textindata](../../assets/nextgen/chap08/10.png)

Lägg till ännu en indata av typen **Text**.

Namn:

```text
ShowroomType
```

Beskrivning:

```text
Verifierad showroomtyp: Showroomstudio eller Flagship.
```

![ShowroomType har lagts till som textindata](../../assets/nextgen/chap08/11.png)

Avsluta med en indata av typen **Text**.

Namn:

```text
Country
```

Beskrivning:

```text
Verifierat mottagarland: Sverige eller Norge.
```

Kontrollera att alla fem värden har rätt namn, typ och beskrivning.

![Utlösaren innehåller ItemID, Quantity, ShowroomName, ShowroomType och Country](../../assets/nextgen/chap08/12.png)

---

## Del 3: Hämta den valda produktvarianten

Välj plustecknet mellan utlösaren och svarsnoden och sedan **Lägg till ett steg**.

![Ett nytt steg läggs till efter utlösaren](../../assets/nextgen/chap08/13.png)

Sök efter:

```text
Hämta objektet
```

Välj SharePoint-åtgärden med det namnet.

![SharePoint-åtgärden Hämta objektet i åtgärdslistan](../../assets/nextgen/chap08/14.png)

Åtgärden behöver anslutning, webbplatsadress, listnamn och objektets ID.

![Konfigurationen för SharePoint-åtgärden Hämta objektet](../../assets/nextgen/chap08/15.png)

Byt namn på noden till:

```text
Hämta vald produktvariant
```

![SharePoint-noden har fått namnet Hämta vald produktvariant](../../assets/nextgen/chap08/18.png)

Välj **Lyserno Produktportal** under **Webbplatsadress** och **Centrallager** under **Listnamn**.

![Lyserno Produktportal och Centrallager är valda](../../assets/nextgen/chap08/16.png)

Klicka i fältet **ID** och öppna dynamiskt innehåll. Sök efter:

```text
ItemID
```

Välj värdet under **When an agent calls the flow**.

![ItemID från utlösaren väljs som SharePoint-objektets ID](../../assets/nextgen/chap08/17.png)

Kontrollera den färdiga konfigurationen.

![Hämta vald produktvariant är färdigkonfigurerad](../../assets/nextgen/chap08/19.png)

---

## Del 4: Testa SharePoint-noden

Öppna fliken **Kör nod**. Ange följande testvärde för `ItemID`:

```text
1
```

Övriga indata behövs inte för att testa just den här noden.

![Hämta vald produktvariant testas med ItemID 1](../../assets/nextgen/chap08/20.png)

Kör noden och kontrollera att ett objekt returneras från Centrallager. Utdata ska bland annat innehålla produktnamn, SKU, `OnHandQuantity` och `ReservedQuantity`.

![Testet returnerar produktvariantens värden från Centrallager](../../assets/nextgen/chap08/21.png)

Gå tillbaka till arbetsytan när testet är klart.

![Hämta vald produktvariant ligger mellan utlösaren och svarsnoden](../../assets/nextgen/chap08/22.png)

---

## Del 5: Beräkna kvarvarande disponibelt saldo

Lägg till ett steg efter **Hämta vald produktvariant**. Välj åtgärden **Variabel**.

![Variabel väljs i listan över åtgärder](../../assets/nextgen/chap08/23.png)

Byt namn på noden till:

```text
Beräkna värden och initiera resultat
```

Den första variabeln ska heta:

```text
RemainingAvailableQuantity
```

![Noden Beräkna värden och initiera resultat med en tom variabel](../../assets/nextgen/chap08/24.png)

Välj typen **Float**. SharePoints nummerfält returneras som decimaltal även när värdena visas som heltal.

![RemainingAvailableQuantity får typen Float](../../assets/nextgen/chap08/25.png)

Välj ikonen **Växla till uttrycksläge** vid fältet **Värde**.

![Värdefältet växlas till uttrycksläge](../../assets/nextgen/chap08/26.png)

Beräkningen är `OnHandQuantity − ReservedQuantity − Quantity`.

Börja med att skriva den nästlade funktionen:

```text
sub(sub())
```

![Den nästlade funktionen sub sub har skrivits in](../../assets/nextgen/chap08/27.png)

Placera markören i den innersta funktionen och öppna dynamiskt innehåll. Sök efter:

```text
OnHandQuantity
```

Välj värdet från **Hämta vald produktvariant**.

![OnHandQuantity väljs från Hämta vald produktvariant](../../assets/nextgen/chap08/28.png)

Skriv ett kommatecken efter värdet.

![OnHandQuantity är den första parametern i den innersta sub-funktionen](../../assets/nextgen/chap08/29.png)

Öppna dynamiskt innehåll och sök efter:

```text
ReservedQuantity
```

Välj värdet från samma SharePoint-nod.

![ReservedQuantity väljs från Hämta vald produktvariant](../../assets/nextgen/chap08/30.png)

Flytta markören utanför den innersta funktionens avslutande parentes och skriv ett nytt kommatecken.

![OnHandQuantity minus ReservedQuantity är färdigbyggt](../../assets/nextgen/chap08/31.png)

Öppna dynamiskt innehåll och sök efter:

```text
Quantity
```

Välj värdet från utlösaren.

![Quantity väljs från When an agent calls the flow](../../assets/nextgen/chap08/32.png)

Det färdiga uttrycket ska motsvara följande:

```text
@sub(sub(outputs('Hämta_vald_produktvariant')?['body/field_6'],outputs('Hämta_vald_produktvariant')?['body/field_7']),triggerOutputs()?['body/number_1'])
```

Du kan bygga uttrycket med dynamiskt innehåll enligt stegen ovan eller klistra in hela uttrycket i uttrycksläget.

![Det färdiga uttrycket för RemainingAvailableQuantity](../../assets/nextgen/chap08/33.png)

Kontrollera variabelns namn, typ och värde.

![RemainingAvailableQuantity är färdigkonfigurerad](../../assets/nextgen/chap08/34.png)

Välj **Initiera variabel**. Ange följande namn:

```text
ResultStatus
```

Välj typen **String** och lämna värdet tomt.

![ResultStatus har lagts till som en tom sträng](../../assets/nextgen/chap08/35.png)

Välj **Initiera variabel** igen och ange namnet:

```text
ResultMessage
```

Välj typen **String** och lämna värdet tomt.

![Noden innehåller RemainingAvailableQuantity, ResultStatus och ResultMessage](../../assets/nextgen/chap08/36.png)

Välj **Initiera variabel** igen och ange namnet:

```text
TotalProductPrice
```

Välj typen **Float**.

![TotalProductPrice får typen Float](../../assets/nextgen/chap08/mul.png)

Välj ikonen **Växla till uttrycksläge** vid fältet **Värde**.

![Värdefältet för TotalProductPrice växlas till uttrycksläge](../../assets/nextgen/chap08/mul2.png)

Beräkningen är `CurrentUnitPrice × Quantity`. Börja med att skriva funktionen:

```text
mul()
```

![Funktionen mul har skrivits in](../../assets/nextgen/chap08/mul3.png)

Placera markören mellan parenteserna och öppna dynamiskt innehåll. Sök efter:

```text
CurrentUnitPrice
```

Välj värdet från **Hämta vald produktvariant**.

![CurrentUnitPrice väljs från Hämta vald produktvariant](../../assets/nextgen/chap08/mul4.png)

Skriv ett kommatecken efter värdet. Öppna sedan dynamiskt innehåll och sök efter:

```text
Quantity
```

Välj värdet från **When an agent calls the flow**.

![Quantity väljs som den andra parametern i mul-funktionen](../../assets/nextgen/chap08/mul5.png)

Det färdiga uttrycket ska motsvara följande:

```text
@mul(outputs('Hämta_vald_produktvariant')?['body/field_5'],triggerOutputs()?['body/number_1'])
```

Kontrollera att variabeln heter `TotalProductPrice`, har typen **Float** och innehåller båda parametrarna.

![TotalProductPrice är färdigkonfigurerad](../../assets/nextgen/chap08/mul6.png)

---

## Del 6: Lägg till villkorsnoden

Lägg till ett steg efter variabelnoden och välj **Om/annars**.

![Om annars väljs i listan över åtgärder](../../assets/nextgen/chap08/37.png)

Byt namn på noden till:

```text
Avgör standardprocess eller manuell granskning
```

![Villkorsnoden har lagts till i arbetsflödet](../../assets/nextgen/chap08/38.png)

Villkorsnoden innehåller en första gren med namnet `If`. Klicka på namnet för att ändra det.

![Namnet på den första villkorsgrenen kan ändras](../../assets/nextgen/chap08/39.png)

Ange:

```text
Standard – svensk showroomstudio
```

Kontrollera att operatorn mellan raderna är **AND**.

![Den första grenen heter Standard svensk showroomstudio](../../assets/nextgen/chap08/40.png)

---

## Del 7: Konfigurera svensk showroomstudio

Grenen ska bara matcha en svensk showroomstudio när antalet är mellan 1 och 5 och minst 2 exemplar blir kvar disponibla.

Klicka på blixtikonen i fältet **Egenskap**. Sök efter:

```text
ShowroomType
```

Välj värdet från utlösaren.

![ShowroomType väljs som den första egenskapen](../../assets/nextgen/chap08/41.png)

Behåll operatorn **Är lika med**.

![Operatorn Är lika med används för showroomtypen](../../assets/nextgen/chap08/42.png)

Ange värdet:

```text
Showroomstudio
```

![ShowroomType ska vara lika med Showroomstudio](../../assets/nextgen/chap08/43.png)

Lägg till en rad och öppna dynamiskt innehåll. Sök efter:

```text
Country
```

Välj värdet från utlösaren.

![Country väljs som nästa egenskap](../../assets/nextgen/chap08/44.png)

Behåll operatorn **Är lika med**.

![Operatorn Är lika med används för Country](../../assets/nextgen/chap08/45.png)

Ange värdet:

```text
Sverige
```

![Country ska vara lika med Sverige](../../assets/nextgen/chap08/46.png)

Lägg till en tredje rad och öppna dynamiskt innehåll. Sök efter:

```text
Quantity
```

Välj värdet från utlösaren.

![Quantity väljs för den övre mängdgränsen](../../assets/nextgen/chap08/47.png)

Byt operator till **Mindre än eller lika med**.

![Operatorn Mindre än eller lika med väljs](../../assets/nextgen/chap08/48.png)

Ange värdet:

```text
5
```

![Quantity ska vara mindre än eller lika med 5](../../assets/nextgen/chap08/49.png)

Lägg till ännu en rad och sök efter:

```text
Quantity
```

Välj värdet från utlösaren.

![Quantity väljs för den undre mängdgränsen](../../assets/nextgen/chap08/50.png)

Byt operator till **Större än eller lika med**.

![Operatorn Större än eller lika med väljs för den undre mängdgränsen](../../assets/nextgen/chap08/51.png)

Ange värdet:

```text
1
```

![Quantity ska vara större än eller lika med 1](../../assets/nextgen/chap08/52.png)

Lägg till en femte rad och öppna dynamiskt innehåll. Sök efter:

```text
RemainingAvailableQuantity
```

Välj variabeln under **Variables**.

![RemainingAvailableQuantity väljs från Variables](../../assets/nextgen/chap08/53.png)

Byt operator till **Större än eller lika med**.

![Operatorn Större än eller lika med väljs för lagerbufferten](../../assets/nextgen/chap08/54.png)

Ange värdet:

```text
2
```

![Den svenska showroomstudions fem villkor är färdiga](../../assets/nextgen/chap08/55.png)

Den färdiga grenen ska innehålla:

| Egenskap | Operator | Värde |
| --- | --- | --- |
| `ShowroomType` | Är lika med | `Showroomstudio` |
| `Country` | Är lika med | `Sverige` |
| `Quantity` | Mindre än eller lika med | `5` |
| `Quantity` | Större än eller lika med | `1` |
| `RemainingAvailableQuantity` | Större än eller lika med | `2` |

Välj **Lägg till en gren**.

![En ny villkorsgren kan läggas till efter den svenska showroomstudion](../../assets/nextgen/chap08/56.png)

---

## Del 8: Konfigurera svenskt flagship-showroom

Byt namn på den nya grenen från `Branch 2` till:

```text
Standard – svenskt flagship-showroom
```

![Den andra grenen kan byta namn](../../assets/nextgen/chap08/57.png)

Klicka på blixtikonen i fältet **Egenskap**. Sök efter:

```text
ShowroomType
```

Välj värdet från utlösaren.

![ShowroomType väljs för flagship-grenen](../../assets/nextgen/chap08/58.png)

Behåll operatorn **Är lika med**.

![Operatorn Är lika med används för showroomtypen](../../assets/nextgen/chap08/59.png)

Ange värdet:

```text
Flagship
```

![ShowroomType ska vara lika med Flagship](../../assets/nextgen/chap08/60.png)

Lägg till en rad och öppna dynamiskt innehåll. Sök efter:

```text
Country
```

Välj värdet från utlösaren.

![Country väljs för flagship-grenen](../../assets/nextgen/chap08/61.png)

Behåll operatorn **Är lika med**.

![Operatorn Är lika med används för Country](../../assets/nextgen/chap08/62.png)

Ange värdet:

```text
Sverige
```

![Country ska vara lika med Sverige](../../assets/nextgen/chap08/63.png)

Lägg till en tredje rad och öppna dynamiskt innehåll. Sök efter:

```text
Quantity
```

Välj värdet från utlösaren.

![Quantity väljs för flagships övre mängdgräns](../../assets/nextgen/chap08/64.png)

Välj operatorn **Mindre än eller lika med**.

![Operatorn Mindre än eller lika med väljs för Quantity](../../assets/nextgen/chap08/65.png)

Ange värdet:

```text
10
```

![Quantity ska vara mindre än eller lika med 10](../../assets/nextgen/chap08/66.png)

Lägg till ännu en rad och sök efter:

```text
Quantity
```

Välj värdet från utlösaren.

![Quantity väljs för den undre mängdgränsen](../../assets/nextgen/chap08/67.png)

Välj operatorn **Större än eller lika med**.

![Operatorn Större än eller lika med väljs för Quantity](../../assets/nextgen/chap08/68.png)

Ange värdet:

```text
1
```

![Quantity ska vara större än eller lika med 1](../../assets/nextgen/chap08/69.png)

Lägg till en femte rad och öppna dynamiskt innehåll. Sök efter:

```text
RemainingAvailableQuantity
```

Välj variabeln under **Variables**.

![RemainingAvailableQuantity väljs från Variables](../../assets/nextgen/chap08/70.png)

Byt operator till **Större än eller lika med**.

![Operatorn Större än eller lika med väljs för det disponibla saldot](../../assets/nextgen/chap08/71.png)

Ange värdet:

```text
0
```

![Det disponibla saldot efter reservationen ska vara minst 0](../../assets/nextgen/chap08/72.png)

Flagship-grenen ska alltså innehålla:

| Egenskap | Operator | Värde |
| --- | --- | --- |
| `ShowroomType` | Är lika med | `Flagship` |
| `Country` | Är lika med | `Sverige` |
| `Quantity` | Mindre än eller lika med | `10` |
| `Quantity` | Större än eller lika med | `1` |
| `RemainingAvailableQuantity` | Större än eller lika med | `0` |

Välj sedan **Lägg till en gren**.

![En tredje villkorsgren kan läggas till efter flagship-grenen](../../assets/nextgen/chap08/73.png)

---

## Del 9: Konfigurera internationell showroomstudio

Byt namn på `Branch 3` till:

```text
Standard – internationell showroomstudio
```

![Den tredje grenen kan byta namn](../../assets/nextgen/chap08/74.png)

Klicka på blixtikonen i fältet **Egenskap**. Sök efter:

```text
ShowroomType
```

Välj värdet från utlösaren.

![ShowroomType väljs för den internationella grenen](../../assets/nextgen/chap08/75.png)

Behåll operatorn **Är lika med**.

![Operatorn Är lika med används för showroomtypen](../../assets/nextgen/chap08/76.png)

Ange värdet:

```text
Showroomstudio
```

![ShowroomType ska vara lika med Showroomstudio](../../assets/nextgen/chap08/77.png)

Lägg till en rad och öppna dynamiskt innehåll. Sök efter:

```text
Country
```

Välj värdet från utlösaren.

![Country väljs för den internationella grenen](../../assets/nextgen/chap08/78.png)

Byt operator till **Inte lika med**.

![Operatorn Inte lika med väljs för Country](../../assets/nextgen/chap08/79.png)

Ange värdet:

```text
Sverige
```

![Country ska inte vara lika med Sverige](../../assets/nextgen/chap08/80.png)

Lägg till en tredje rad och öppna dynamiskt innehåll. Sök efter:

```text
Quantity
```

Välj värdet från utlösaren.

![Quantity väljs för den internationella mängdgränsen](../../assets/nextgen/chap08/81.png)

Välj operatorn **Mindre än eller lika med**.

![Operatorn Mindre än eller lika med väljs för Quantity](../../assets/nextgen/chap08/82.png)

Ange värdet:

```text
3
```

![Quantity ska vara mindre än eller lika med 3](../../assets/nextgen/chap08/83.png)

Lägg till ännu en rad och sök efter:

```text
Quantity
```

Välj värdet från utlösaren.

![Quantity väljs för den undre mängdgränsen](../../assets/nextgen/chap08/84.png)

Välj operatorn **Större än eller lika med**.

![Operatorn Större än eller lika med väljs för Quantity](../../assets/nextgen/chap08/85.png)

Ange värdet:

```text
1
```

![Quantity ska vara större än eller lika med 1](../../assets/nextgen/chap08/86.png)

Lägg till en femte rad och öppna dynamiskt innehåll. Sök efter:

```text
RemainingAvailableQuantity
```

Välj variabeln under **Variables**.

![RemainingAvailableQuantity väljs för lagerbufferten](../../assets/nextgen/chap08/87.png)

Välj operatorn **Större än eller lika med**.

![Operatorn Större än eller lika med väljs för RemainingAvailableQuantity](../../assets/nextgen/chap08/88.png)

Ange värdet:

```text
2
```

![Den internationella showroomstudions fem villkor är färdiga](../../assets/nextgen/chap08/89.png)

Den färdiga grenen ska innehålla:

| Egenskap | Operator | Värde |
| --- | --- | --- |
| `ShowroomType` | Är lika med | `Showroomstudio` |
| `Country` | Inte lika med | `Sverige` |
| `Quantity` | Mindre än eller lika med | `3` |
| `Quantity` | Större än eller lika med | `1` |
| `RemainingAvailableQuantity` | Större än eller lika med | `2` |

Alla andra giltiga begäranden fortsätter genom den automatiska **Annars**-grenen. I nästa del använder vi den grenen för manuell granskning och kopplar standardgrenarna till reservationen.

Kontrollera att noden innehåller de tre namngivna standardgrenarna och grenen **Annars**.

![Villkorsnoden innehåller tre standardgrenar och grenen Annars](../../assets/nextgen/chap08/90.png)

!!! success "Flödets indata och beslut är klara"
    Arbetsflödet kan nu hämta rätt produktvariant, räkna ut kvarvarande disponibelt saldo och totalt produktpris samt avgöra om begäran uppfyller någon av standardprocessens tre regelkombinationer. Ingen lagerpost har ändrats ännu.
