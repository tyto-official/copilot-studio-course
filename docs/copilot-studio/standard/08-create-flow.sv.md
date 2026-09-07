# 8. Skapa ett agentflöde

Nu ska vi koppla ett agentflöde till ämnet **Begär enhet**. Flödet tar emot valet från det adaptiva kortet, hämtar den valda enheten från SharePoint, skickar ett mejl till IT och lämnar tillbaka modellnamnet till agenten.

När kapitlet är klart har du en kedja från användarens val i chatten till ett mejl med rätt enhetsuppgifter.

## Del 1: Skapa agentflödet

Öppna ämnet **Begär enhet**. Klicka på **plusikonen** under det adaptiva kortet.

![Plusikonen under det adaptiva kortet](../../assets/standard/images-sv/chap08/1.png)

Välj **Lägg till ett verktyg** och sedan **Nytt agentflöde**.

![Valet Nytt agentflöde](../../assets/standard/images-sv/chap08/2.png)

Agentflödet öppnas i designern. Från början består det av två noder:

- **När en agent anropar flödet** tar emot information från agenten.
- **Respond to the agent** skickar information tillbaka till agenten.

Flikarna **Översikt**, **Aktivitet** och **Analys** blir tillgängliga först när flödet har sparats.

![Ett nytt agentflöde i designern](../../assets/standard/images-sv/chap08/3.png)

## Del 2: Lägg till flödets indata

Klicka på **När en agent anropar flödet** och välj **Lägg till indata**.

![Lägg till indata i flödets utlösare](../../assets/standard/images-sv/chap08/4.png)

Välj datatypen **Text**.

![Text som typ av indata](../../assets/standard/images-sv/chap08/5.png)

Skapa först indatafältet för enhetens ID.

Namn:

~~~text
ValdEnhetId
~~~

Beskrivning:

~~~text
ID för den enhet som användaren valde i det adaptiva kortet.
~~~

![Indatafältet ValdEnhetId](../../assets/standard/images-sv/chap08/6.png)

Lägg sedan till ytterligare två indatafält av typen **Text**.

Namn:

~~~text
Bestallare
~~~

Beskrivning:

~~~text
Namnet på den medarbetare som begär enheten.
~~~

Namn:

~~~text
Kommentar
~~~

Beskrivning:

~~~text
Användarens egna önskemål eller kommentar. Värdet kan vara tomt.
~~~

Klicka på de tre punkterna vid **Kommentar** och välj **Gör fältet valfritt**.

![Tre indatafält och valet Gör fältet valfritt](../../assets/standard/images-sv/chap08/7.png)

När fältet är valfritt ändras menyvalet till **Gör fältet obligatoriskt**. Låt fältet vara valfritt.

![Kommentar är ett valfritt fält](../../assets/standard/images-sv/chap08/8.png)

## Del 3: Hämta den valda enheten

Klicka på **plusikonen** under utlösaren och sök efter:

~~~text
Hämta objektet
~~~

Välj SharePoint-åtgärden **Hämta objektet**. I ett engelskt gränssnitt heter den **Get item**. Välj inte **Hämta objekten** eller **Get items**, eftersom flödet ska hämta en enda post med ett bestämt ID.

![Välj SharePoint-åtgärden Hämta objektet](../../assets/standard/images-sv/chap08/9.png)

Klicka på de tre punkterna i nodens övre högra hörn och välj **Byt namn**.

![Byt namn på SharePoint-noden](../../assets/standard/images-sv/chap08/10.png)

Ange namnet:

~~~text
Hämta enhetsuppgifter
~~~

Välj sedan **Lyserno IT-support** under **Webbplatsadress**.

![Välj webbplatsen Lyserno IT-support](../../assets/standard/images-sv/chap08/11.png)

Välj **Enheter** under **Listnamn**.

![Välj listan Enheter](../../assets/standard/images-sv/chap08/13.png)

Klicka på **fx** vid fältet **ID** och välj **Dynamiskt innehåll**. Sök efter:

~~~text
ValdEnhetId
~~~

Välj **ValdEnhetId** från utlösaren.

![Koppla ValdEnhetId till fältet ID](../../assets/standard/images-sv/chap08/14.png)

## Del 4: Skicka förfrågan med e-post

Klicka på **plusikonen** under SharePoint-noden och sök efter:

~~~text
Skicka e-postmeddelande (V2)
~~~

![Sök efter Skicka e-postmeddelande V2](../../assets/standard/images-sv/chap08/15.png)

Välj **Skicka e-postmeddelande (V2)** från anslutningsprogrammet **Office 365 Outlook**. Om åtgärden inte visas direkt kan du först öppna Office 365 Outlook och sedan välja den därifrån.

![Välj e-poståtgärden från Office 365 Outlook](../../assets/standard/images-sv/chap08/16.png)

Klicka på de tre punkterna i e-postnodens övre högra hörn och välj **Byt namn**.

![Byt namn på e-postnoden](../../assets/standard/images-sv/chap08/17.png)

Ange namnet:

~~~text
Skicka enhetsförfrågan till IT
~~~

Under **Till** anger du din egen e-postadress. Under utbildningen skickar du mejlet till dig själv så att du enkelt kan kontrollera resultatet.

Skriv följande i ämnesraden:

~~~text
Ny enhetsförfrågan från
~~~

Lägg till ett mellanslag efter texten och öppna **Dynamiskt innehåll**. Sök efter:

~~~text
Bestallare
~~~

Välj **Bestallare**.

![Mottagare och dynamisk beställare i ämnesraden](../../assets/standard/images-sv/chap08/18.png)

Kopiera in följande grundtext i mejlets brödtext:

~~~text
Hej IT-supporten!

En ny enhetsförfrågan har kommit in.

Beställare:
Enhet:
Pris:

Kommentar från användaren:
~~~

![Grundtexten i mejlet](../../assets/standard/images-sv/chap08/19.png)

Placera markören efter **Beställare:** och öppna **Dynamiskt innehåll**. Sök efter:

~~~text
Bestallare
~~~

Välj **Bestallare**.

![Lägg till Bestallare i mejlet](../../assets/standard/images-sv/chap08/20.png)

Placera markören efter **Enhet:** och öppna **Dynamiskt innehåll**. Sök efter:

~~~text
Modell
~~~

Välj **Modell** från steget **Hämta enhetsuppgifter**.

![Lägg till Modell i mejlet](../../assets/standard/images-sv/chap08/21.png)

Placera markören efter **Pris:** och öppna **Dynamiskt innehåll**. Sök efter:

~~~text
Inköpspris
~~~

Välj **Inköpspris** från steget **Hämta enhetsuppgifter**.

![Lägg till Inköpspris i mejlet](../../assets/standard/images-sv/chap08/22.png)

### Hantera en tom kommentar

Om användaren inte skrev någon kommentar ska mejlet visa **Ingen kommentar**. Placera markören efter **Kommentar från användaren:**, klicka på **fx** och börja med:

~~~text
if(empty())
~~~

Ställ markören mellan parenteserna och öppna **Dynamiskt innehåll**. Sök efter:

~~~text
Kommentar
~~~

Välj **Kommentar**.

![Börja bygga uttrycket för Kommentar](../../assets/standard/images-sv/chap08/23.png)

Kopiera in följande efter den första stängda parentesen:

~~~text
, 'Ingen kommentar',
~~~

Detta blir resultatet när kommentarsfältet är tomt.

![Uttrycket med Ingen kommentar](../../assets/standard/images-sv/chap08/24.png)

Öppna **Dynamiskt innehåll** igen och sök efter:

~~~text
Kommentar
~~~

Välj **Kommentar** en gång till som resultat när fältet inte är tomt.

![Det färdiga uttrycket för Kommentar](../../assets/standard/images-sv/chap08/25.png)

Om dina indata skapades i samma ordning som i kursen kan du i stället kopiera hela uttrycket:

~~~text
if(empty(triggerBody()?['text_2']), 'Ingen kommentar', triggerBody()?['text_2'])
~~~

!!! warning "Kontrollera det interna fältnamnet"
    **text_2** är det interna namnet som skapades i det här flödet. Om ditt fält har fått ett annat internt namn bygger du uttrycket med **Dynamiskt innehåll** enligt bilderna ovan. Då infogas rätt referens automatiskt.

Kontrollera att mejlnoden innehåller beställare, modell, inköpspris och kommentarsuttrycket.

![Den färdigkonfigurerade e-postnoden](../../assets/standard/images-sv/chap08/26.png)

## Del 5: Skicka modellnamnet tillbaka till agenten

Öppna noden **Respond to the agent** och välj **Lägg till utdata**.

![Lägg till utdata i Respond to the agent](../../assets/standard/images-sv/chap08/27.png)

Välj datatypen **Text**.

![Text som typ av utdata](../../assets/standard/images-sv/chap08/28.png)

Ange namnet:

~~~text
ValdModell
~~~

Klicka i värdefältet och öppna **Dynamiskt innehåll**. Sök efter:

~~~text
Modell
~~~

Välj **Modell** från steget **Hämta enhetsuppgifter**.

![Koppla Modell till utdatan ValdModell](../../assets/standard/images-sv/chap08/29.png)

Kontrollera att **ValdModell** nu får värdet **Modell**.

![Den färdiga utdatan ValdModell](../../assets/standard/images-sv/chap08/30.png)

Flödet ska nu innehålla utlösaren, SharePoint-noden, e-postnoden och svaret till agenten.

![Det färdigkonfigurerade agentflödet](../../assets/standard/images-sv/chap08/31.png)

## Del 6: Namnge och publicera agentflödet

Klicka på **Spara utkast**. När flödet har sparats blir flikarna **Översikt**, **Aktivitet** och **Analys** tillgängliga.

![Agentflödet har sparats som utkast](../../assets/standard/images-sv/chap08/32.png)

Öppna **Översikt** och klicka på **Redigera** under **Information**.

![Redigera flödets information](../../assets/standard/images-sv/chap08/33.png)

Ange följande namn:

~~~text
Hantera enhetsförfrågan
~~~

Beskrivning:

~~~text
Hämtar den valda enhetens uppgifter från SharePoint, skickar förfrågan till IT-avdelningen och returnerar modellnamnet till agenten.
~~~

Under **Planera** väljer du **Copilot Studio** i stället för **Användaren som kör flödet**.

![Namn, beskrivning och planering för agentflödet](../../assets/standard/images-sv/chap08/34.png)

Kontrollera att **Copilot Studio** är valt och spara ändringarna.

![Copilot Studio valt under Planera](../../assets/standard/images-sv/chap08/35.png)

Gå tillbaka till **Designer** och klicka på **Publicera**.

![Publicera agentflödet](../../assets/standard/images-sv/chap08/36.png)

## Del 7: Lägg till flödet i ämnet

Gå till **Handläggare** och öppna **Lyserno IT-assistent**.

![Välj Lyserno IT-assistent](../../assets/standard/images-sv/chap08/37.png)

Du kommer till agentens översikt.

![Översikten för Lyserno IT-assistent](../../assets/standard/images-sv/chap08/38.png)

Öppna **Ämnen** och välj **Begär enhet**.

![Öppna ämnet Begär enhet](../../assets/standard/images-sv/chap08/39.png)

Klicka på **plusikonen** under det adaptiva kortet och välj **Lägg till ett verktyg**. Sök efter:

~~~text
Hantera enhetsförfrågan
~~~

Välj agentflödet i sökresultatet.

![Lägg till Hantera enhetsförfrågan i ämnet](../../assets/standard/images-sv/chap08/40.png)

## Del 8: Koppla ämnets variabler till flödet

Under **ValdEnhetId** öppnar du variabelväljaren och söker efter:

~~~text
kortValdEnhetId
~~~

Välj den anpassade variabeln **kortValdEnhetId** från det adaptiva kortet.

![Koppla kortValdEnhetId till ValdEnhetId](../../assets/standard/images-sv/chap08/41.png)

Under **Bestallare** öppnar du variabelväljaren, går till **System** och söker efter:

~~~text
User
~~~

Välj **User.DisplayName**.

![Koppla User Display Name till Bestallare](../../assets/standard/images-sv/chap08/42.png)

Öppna **Avancerad indata**. Vid **Kommentar** klickar du på de tre punkterna och väljer **Formel**.

![Öppna en formel för Kommentar](../../assets/standard/images-sv/chap08/43.png)

Expandera formelredigeraren och skriv:

~~~powerfx
If(IsBlank(Topic.kortKommentar), "", Topic.kortKommentar)
~~~

Kontrollera att formeln godkänns och klicka på **Infoga**.

![Formeln som skickar en tom sträng när Kommentar saknas](../../assets/standard/images-sv/chap08/44.png)

Formeln skickar användarens kommentar när den finns. Om kommentaren är tom skickar den en tom textsträng i stället för ett tomt värde.

## Del 9: Lägg till en bekräftelse

Klicka på **plusikonen** under agentflödet och välj **Skicka ett meddelande**.

![Lägg till noden Skicka ett meddelande](../../assets/standard/images-sv/chap08/45.png)

Skriv:

~~~text
Tack
~~~

Lägg till ett mellanslag efter ordet. Klicka på variabelikonen, öppna **System** och sök efter:

~~~text
User
~~~

Välj **User.DisplayName**.

![Lägg till användarens visningsnamn](../../assets/standard/images-sv/chap08/46.png)

Skriv sedan:

~~~text
. Din valda enhet,
~~~

Lägg till ett mellanslag efter kommatecknet. Klicka på variabelikonen igen och sök efter:

~~~text
ValdModell
~~~

Välj **ValdModell** bland de anpassade variablerna.

![Lägg till ValdModell i bekräftelsen](../../assets/standard/images-sv/chap08/47.png)

Avsluta med:

~~~text
, har skickats in och kommer att granskas av IT-ansvarig.
~~~

Det färdiga meddelandet består av vanlig text och två variabler:

> Tack {User.DisplayName}. Din valda enhet, {ValdModell}, har skickats in och kommer att granskas av IT-ansvarig.

![Det färdiga bekräftelsemeddelandet](../../assets/standard/images-sv/chap08/48.png)

Klicka på **plusikonen** under bekräftelsen. Öppna **Ämneshantering** och välj **Avsluta alla ämnen**.

![Välj Avsluta alla ämnen efter bekräftelsen](../../assets/standard/images-sv/chap08/51.png)

Bekräftelsen är ämnets slutliga svar. När alla ämnen avslutas försöker agenten inte skapa ytterligare ett svar efter att beställningen är klar.

## Del 10: Testa hela flödet

Starta en ny testsession och be agenten visa en tillgänglig enhetstyp, till exempel:

~~~text
Jag vill ha en laptop
~~~

När agenten frågar om du vill begära en enhet svarar du ja. Välj en enhet i det adaptiva kortet och skriv till exempel:

~~~text
med extra minne
~~~

Skicka kortet. Agenten ska anropa flödet och visa bekräftelsen med ditt namn och den valda modellen.

![Agentens bekräftelse efter att kortet har skickats](../../assets/standard/images-sv/chap08/49.png)

Öppna din inkorg och kontrollera att mejlet innehåller beställare, enhet, pris och kommentar.

![Mejlet med den färdiga enhetsförfrågan](../../assets/standard/images-sv/chap08/50.png)

Du har nu kopplat ihop det adaptiva kortet, SharePoint och Office 365 Outlook i ett agentflöde. Agenten skickar förfrågan till IT och bekräftar valet i chatten.
