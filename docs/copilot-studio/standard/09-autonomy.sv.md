# 9. Autonomi

Hittills har agenten svarat när någon skriver till den. Nu ska den också reagera när ett nytt supportärende skapas i SharePoint.

Vi skapar en SharePoint-utlösare som skickar ärendet till agenten. Agenten använder sedan ett e-postverktyg för att meddela IT-avdelningen utan att vänta på ett meddelande från användaren.

## Del 1: Skapa en SharePoint-utlösare

Öppna agentens **Översikt** och gå till avsnittet **Utlösare**. Klicka på **Lägg till utlösare**.

![Avsnittet Utlösare på agentens översikt](../../assets/standard/images-sv/chap09/1.png)

Under **Utvalt** finns normalt SharePoint-utlösaren **När ett objekt skapas**. Om den inte syns kan du använda sökfältet uppe till höger och söka efter:

~~~text
När ett objekt skapas
~~~

![Välj utlösaren När ett objekt skapas](../../assets/standard/images-sv/chap09/2.png)

Markera **När ett objekt skapas** från SharePoint och klicka på **Nästa**.

![Utlösaren är markerad](../../assets/standard/images-sv/chap09/3.png)

Kontrollera utlösarens namn och anslutningarna till Microsoft Copilot Studio och SharePoint. En grön bock visar att anslutningen är klar. Klicka på **Nästa**.

![Utlösarens namn och anslutningar](../../assets/standard/images-sv/chap09/4.png)

På nästa sida ska du välja webbplats, lista och vilka instruktioner agenten får när utlösaren körs.

![Inställningarna för SharePoint-utlösaren](../../assets/standard/images-sv/chap09/5.png)

Under **Webbplatsadress** väljer du **Lyserno IT-support**.

![Välj webbplatsen Lyserno IT-support](../../assets/standard/images-sv/chap09/6.png)

Under **Listnamn** väljer du **Begäran**.

![Välj listan Begäran](../../assets/standard/images-sv/chap09/7.png)

Låt **Begränsa kolumner efter vy** vara oförändrat. Ta bort den förifyllda texten under **Ytterligare instruktioner till agenten när den anropas av den här utlösaren** och kopiera in:

~~~text
En ny supportbegäran har skapats i SharePoint:

{Body}

Använd /Meddela IT om nytt supportärende för att informera IT-avdelningen. Vänta inte på användarinmatning.
~~~

Instruktionen säger åt agenten att använda e-postverktyget som vi skapar senare i kapitlet. Snedstrecket kopplar instruktionen till verktyget.

Klicka på **Skapa utlösare**.

![Den färdigkonfigurerade SharePoint-utlösaren](../../assets/standard/images-sv/chap09/8.png)

## Del 2: Formatera informationen i Power Automate

När utlösaren har skapats går du tillbaka till agentens **Översikt**. Klicka på de tre punkterna till höger om **När ett objekt skapas** och välj **Redigera i Power Automate**.

![Redigera utlösaren i Power Automate](../../assets/standard/images-sv/chap09/9.png)

Flödet öppnas i Power Automate. Det innehåller SharePoint-utlösaren och steget **Sends a prompt to the specified copilot for processing**.

![Utlösarflödet i Power Automate](../../assets/standard/images-sv/chap09/10.png)

Klicka på **Sends a prompt to the specified copilot for processing**. Under **Meddelande** ser du instruktionen som skapades i Copilot Studio.

![Meddelandet som skickas till agenten](../../assets/standard/images-sv/chap09/11.png)

Ta bort värdet **{Body}** från meddelandet. Ställ markören på samma plats, skriv ett snedstreck och välj **Infoga uttryck**.

![Välj Infoga uttryck i meddelandet](../../assets/standard/images-sv/chap09/12.png)

Kopiera in följande uttryck:

~~~text
concat('Submitted By Name: ', first(triggerOutputs()?['body/value'])?['Author/DisplayName'], '\nSubmitted By Email: ', first(triggerOutputs()?['body/value'])?['Author/Email'], '\nTitle: ', first(triggerOutputs()?['body/value'])?['Title'], '\nIssue Description: ', first(triggerOutputs()?['body/value'])?['Description'], '\nPriority: ', first(triggerOutputs()?['body/value'])?['Priority/Value'],'\nTicket ID : ', first(triggerOutputs()?['body/value'])?['ID'])
~~~

Klicka på **Lägg till** längst ner i uttrycksrutan.

![Uttrycket som hämtar ärendets uppgifter](../../assets/standard/images-sv/chap09/13.png)

Uttrycket hämtar anmälarens namn och e-postadress samt ärendets rubrik, beskrivning, prioritet och ID. Informationen sätts ihop till en text som agenten kan använda när den fyller i e-postverktyget.

Kontrollera att uttrycket har lagts till i meddelandet och klicka på **Spara** uppe till höger.

![Uttrycket har lagts till i meddelandet](../../assets/standard/images-sv/chap09/14.png)

Gå sedan tillbaka till Copilot Studio.

## Del 3: Lägg till e-postverktyget

Öppna agentens **Översikt**, gå till avsnittet **Verktyg** och klicka på **Lägg till verktyg**.

![Lägg till ett verktyg från översikten](../../assets/standard/images-sv/chap09/15.png)

Sök efter:

~~~text
Skicka e-postmeddelande (V2)
~~~

Starta sökningen med pilen till höger om sökfältet.

![Sök efter Skicka e-postmeddelande V2](../../assets/standard/images-sv/chap09/16.png)

Välj **Skicka e-postmeddelande (V2)** under **Office 365 Outlook**. Om åtgärden inte syns direkt kan du öppna Office 365 Outlook i resultatlistan och välja den där.

![Välj Skicka e-postmeddelande V2 från Office 365 Outlook](../../assets/standard/images-sv/chap09/17.png)

Kontrollera att rätt anslutning används. En grön bock vid e-postadressen visar att anslutningen fungerar. Klicka på **Lägg till och konfigurera**.

![Kontrollera anslutningen och lägg till verktyget](../../assets/standard/images-sv/chap09/18.png)

## Del 4: Konfigurera e-postverktyget

Under **Detaljer** anger du följande namn:

~~~text
Meddela IT om nytt supportärende
~~~

Beskrivning:

~~~text
Skickar ett mejl till IT-avdelningen när ett nytt supportärende har skapats i SharePoint. Används av SharePoint-utlösaren, inte i vanliga chattsamtal.
~~~

Klicka på **Spara**.

![Namn och beskrivning för e-postverktyget](../../assets/standard/images-sv/chap09/19.png)

Gå till **Indata**. Verktyget har tre indatafält:

- **To** är mottagarens e-postadress.
- **Subject** är mejlets ämnesrad.
- **Body** är mejlets innehåll.

![E-postverktygets tre indatafält](../../assets/standard/images-sv/chap09/20.png)

### Ange mottagaren

Öppna listan **Dynamisk ifyllning med AI** vid **To** och välj **Anpassat värde**.

![Ändra To till Anpassat värde](../../assets/standard/images-sv/chap09/21.png)

Ange din egen e-postadress i värdefältet. Under utbildningen skickar du mejlet till dig själv så att du kan kontrollera resultatet.

![Den fasta mottagaradressen](../../assets/standard/images-sv/chap09/22.png)

### Beskriv ämnesraden

Låt **Subject** stå kvar på **Dynamisk ifyllning med AI** och klicka på **Anpassa**. Låt visningsnamnet vara **Subject** och kopiera in följande beskrivning:

~~~text
Ämnesrad för mejlet. Börja med Ny begäran och lägg till begärans rubrik.
~~~

Låt **Identifiera som** vara **Användarens hela svar**.

![Beskrivningen för Subject](../../assets/standard/images-sv/chap09/23.png)

### Beskriv mejlets innehåll

Stäng inställningarna för **Subject** och klicka på **Anpassa** vid **Body**. Låt visningsnamnet vara **Body** och kopiera in:

~~~text
Sammanfattning av begäran i löpande text: rubrik, prioritet, vem som anmälde ärendet och en kort beskrivning av felet.
~~~

Låt **Identifiera som** vara **Användarens hela svar**.

![Beskrivningen för Body](../../assets/standard/images-sv/chap09/24.png)

Klicka på **Spara**. Låt **Efter körning** stå kvar på **Svara inte (standardinställning)**.

![Det färdigkonfigurerade e-postverktyget](../../assets/standard/images-sv/chap09/25.png)

## Del 5: Testa utlösaren

Innan du startar testet behöver SharePoint-utlösaren en ny händelse att läsa.

Öppna SharePoint-webbplatsen **Lyserno IT-support** och gå till listan **Begäran**. Klicka på **Nytt**, fyll i ett testärende och spara det. Du kan använda följande värden:

Rubrik:

~~~text
VPN är nere
~~~

Beskrivning:

~~~text
Kan inte koppla upp till min VPN.
~~~

Prioritet:

~~~text
Normal
~~~

Gå tillbaka till agentens **Översikt** och avsnittet **Utlösare**. Klicka på provrörsikonen till höger om **När ett objekt skapas**.

![Öppna testet för utlösaren](../../assets/standard/images-sv/chap09/26.png)

Panelen **Testa din utlösare** visar tidigare tillfällen då utlösaren har körts. Om den nya begäran inte syns klickar du på uppdateringsikonen vid **Senast uppdaterad**.

Markera den senaste händelsen och klicka på **Börja testa**.

![Välj den senaste händelsen och börja testa](../../assets/standard/images-sv/chap09/27.png)

Agenten ska läsa ärendet och använda **Meddela IT om nytt supportärende**. I det expanderade testfönstret kan du kontrollera vilka värden agenten skickade till verktyget.

Första gången kan du behöva godkänna att agenten använder din Office 365 Outlook-anslutning. Klicka i så fall på **Tillåt**.

![Det slutförda testet i Copilot Studio](../../assets/standard/images-sv/chap09/28.png)

Öppna din inkorg och kontrollera att mejlet innehåller ärendets rubrik, prioritet, anmälare, beskrivning och ID.

![Mejlet som skickades av den autonoma utlösaren](../../assets/standard/images-sv/chap09/29.png)

Agenten kan nu reagera på ett nytt SharePoint-ärende utan att någon först behöver skriva i chatten.
