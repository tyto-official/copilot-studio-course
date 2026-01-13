# 8. Skapa ett Agent Flow

Nu ska vi bygga motorn som faktiskt utför beställningen. När användaren klickar på "Skicka" i det adaptiva kortet, ska agenten anropa ett **Agent Flow**.

Skillnaden mot ett vanligt flöde är att ett Agent Flow är skräddarsytt för att ta emot data direkt från din agent, utföra arbete, och sedan svara agenten med ett resultat.

Detta Agent Flow ska:
1.  Ta emot information från chatten (Vilken dator? Vem beställer?).
2.  Hämta detaljer om datorn från SharePoint (för att dubbelkolla att den finns).
3.  Skicka ett beställningsmejl till IT-avdelningen.
4.  Skicka tillbaka en bekräftelse till chatten.

---

## 8.1 Skapa ett nytt Agent Flow

Vi börjar inifrån din Topic **Request device** som vi jobbade med sist.

1.  Gå till **Topics** och öppna **Request device**.
2.  Scrolla längst ner i flödet (under `Ask with Adaptive Card`).
3.  Klicka på **plus-tecknet (+)**.
4.  Välj **Add a tool** -> **New Agent flow**.

    ![Skapa flöde](assets/images/chap08/topic-call-action-flow.png)

    *Detta öppnar ett nytt fönster där vi kan bygga vårt Agent Flow.*

---

## 8.2 Definiera Inputs (Trigger)

Väl inne i **Agent flows** kan vi se två noder. Den övre av dessa är noden **When an agent calls the flow**. Det är här vi bestämmer vad agenten ska skicka med sig in i processen. Den nedre noden är en **Respond to the agent**, vilket innebär vad som skickas ut från agent flowet och tillbaka till agenten.Vi kommer börja med att definiera vad agenten ska skicka med sig in i processen. 

Vi behöver tre saker: ID på datorn, vem användaren är, och eventuella kommentarer.

1.  Klicka på noden **When an agent calls the flow** för att öppna inställningarna.

    ![Öppnar noden](assets/images/chap08/flow-open-inputs.png)

2.  Klicka på **+ Add an input**

    ![Add input](assets/images/chap08/flow-add-input.png)

3. Nu ser du ett gäng olika typer av inputs, men vi kommer välja **Text**. Klicka därför på **Text**.

    ![Add input](assets/images/chap08/flow-add-input-text.png)

4.  Ställ dig i textrutan där det står text och döp om den till:
    ```text
    DeviceSharePointId
    ```
    *Här kommer vi skicka in ID:t från SharePoint.*

    ![Add input](assets/images/chap08/flow-add-input-text-device.png)

4.  Gör om proceduren. Klicka **+ Add an input** -> **Text**. Döp den till:
    ```text
    User
    ```
    *Här skickar vi in användarens namn.*

    ![Add input](assets/images/chap08/flow-add-input-text-user.png)

5.  Gör om proceduren igen. Klicka **+ Add an input** -> **Text**. Döp den till:
    ```text
    AdditionalComments
    ```

    ![Trigger inputs](assets/images/chap08/flow-trigger-inputs-text-comments.png)

6.  **Gör kommentaren frivillig:**
    Eftersom användaren kanske inte skriver någon kommentar, måste vi göra detta fält valfritt (Optional).
    * Klicka på de **tre prickarna (...)** bredvid fältet *AdditionalComments*.
    * Välj **Make the field optional**.

    ![Gör input frivillig](assets/images/chap08/flow-input-optional.png)

---

## 8.3 Hämta enhetsdetaljer (Get Item)

Agenten skickar bara ett ID (t.ex. "4"). För att mejlet ska bli snyggt måste vi slå upp vad "4" är för dator (Modell, Pris, etc).

1.  Klicka på **plus-tecknet (+)** under trigger-noden.
2.  Sök efter **Get item** och välj **Get item (SharePoint)**.
    *(Obs: Välj "Get item", inte "Get items" i plural, eftersom vi bara ska hämta en specifik rad).*

    ![Get item action](assets/images/chap08/flow-action-getitem.png)

3.  **Döp om steget (Best Practice):**
    * Klicka på de **tre prickarna (...)** på noden *Get item*.
    * Välj **Rename**.
    * Döp den till: 
    ```text
    Get Device
    ```

    ![Rename step](assets/images/chap08/flow-getitem-rename.png)

4.  **Konfigurera steget:**
    * **Site Address:** Välj din IT Help Desk-sida.

    ![Site Address](assets/images/chap08/flow-getitem-siteaddress.png)

    * **List Name:** Välj listan **Devices**.

    ![List Name](assets/images/chap08/flow-getitem-listname.png)

    * **Id:** Klicka på **fx** längs till vänster i Id-rutan.

    ![Id](assets/images/chap08/flow-getitem-id.png)

    * Välj **Dynamic content** och Sök efter 
    ```text 
    DeviceSharePointId
    ``` 
    ![Mappa ID](assets/images/chap08/flow-getitem-dynamic.png)

    * Notera att följande syntax *triggerBody()?['text']* används när du klickar på **DeviceSharePointId**. Klicka nu på **Add**.

    ![Add](assets/images/chap08/flow-getitem-add.png)

5.  **Avancerade inställningar:**
    * Klicka på **Show all** i inställningarna för *Get Device*.
    ![Show all](assets/images/chap08/flow-getitem-showall.png)
    * Hitta **Limit Columns by View**.
    * Välj **All Items**.
    ![Limit Columns by View](assets/images/chap08/flow-getitem-limitcolumns.png)
    *(Detta säkerställer att vi får tillgång till alla kolumner).*

---

## 8.4 Skicka Beställningsmejl

Nu när vi har all data ska vi skicka ordern. För att göra det enkelt och robust i denna övning använder vi e-post.

1.  Klicka på **plus-tecknet (+)** under *Get Device*.
2.  Sök efter 
    ```text 
    Send an email
    ```      
    ![Send an email](assets/images/chap08/flow-action-email.png)

    och välj **Send an email (V2)** (Office 365 Outlook).
    *(Logga in om det behövs).*  
3.  Döp om noden till 
    ```text 
    Skicka mejl till IT
    ``` 

4.  **Konfigurera mejlet:**
    * **To:** Klicka på **Enter custom value** och skriv in **din egen e-postadress**.

    ![To](assets/images/chap08/flow-action-email-to.png)

        *(I verkligheten hade detta gått till en funktionsbrevlåda för IT).*
    * **Subject:** Skriv: 
    ```text
    Typ av förfrågan: ny enhet
    ``` 
    
    ![Subject](assets/images/chap08/flow-action-email-subject.png)

    * **Body:** Här bygger vi meddelandet. Skriv text och klicka i dynamiska värden från blixten:

    ```text
    Hej IT-supporten!

    En ny beställning har inkommit.
    
    Beställare: [Välj 'User' från Triggern]
    Enhet: [Välj 'Model' från 'Get Device']
    Pris: [Välj 'Price' från 'Get Device'] $
    
    Kommentar från användaren:
    
    Vänligen hantera skyndsamt.
    ```

    ![Skicka email](assets/images/chap08/flow-action-email.png)

---

## 8.5 Skicka svar till Agenten (Output)

Slutligen måste vårt Agent Flow berätta för agenten att allt gick bra, och ge ett meddelande som agenten kan visa för användaren.

1.  Klicka på sista noden **Respond to the agent**.
2.  Klicka **+ Add an output** -> **Text**.
3.  Döp outputen till:
    ```text
    OrderStatus
    ```
4.  I värdefältet, skriv:
    ```text
    Din beställning är mottagen och ett ärende har skapats hos IT-supporten. Du får ett bekräftelsemail inom kort.
    ```
    *(Här kan vi hårdkoda texten eftersom den alltid ska vara densamma om flödet lyckas).*

    ![Output response](assets/images/chap08/flow-output-response.png)

5.  **Spara ditt Agent Flow:**
    * Längst upp till vänster, klicka på namnet (som ofta heter *Untitled*).
    * Döp det till: `Beställningsflöde` (eller *Place Device Order*).
    * Klicka **Save** uppe till höger.
    * Vänta på den gröna bocken som säger att det är sparat.

---

## 8.6 Koppla ditt Agent Flow i Topicen

Nu måste vi gå tillbaka till Copilot Studio och koppla in vårt nya Agent Flow.

1.  Gå tillbaka till fliken med Copilot Studio (där din Topic är öppen).
    *(Om du tappat bort den, gå till Topics -> Request device).*
2.  Du kanske behöver klicka **Refresh** eller ta bort den tomma noden och lägga till **Call an action** igen för att se ditt nya flöde i listan.
3.  Välj ditt Agent Flow: `Beställningsflöde`.

4.  **Mappa inputs:**
    Nu frågar agenten: "Vad ska jag stoppa in i de input-hål du byggde?"
    * **DeviceSharePointId:** Klicka på pilen `>` och välj variabeln `deviceSelectionId` (den kommer från ditt Adaptive Card).
    * **User:** Klicka på pilen `>` och välj systemvariabeln `User.DisplayName`.
    * **AdditionalComments:** Klicka på pilen `>` och välj `commentsId` (från Adaptive Card).

5.  **Hantera resultatet:**
    Ditt Agent Flow ger tillbaka variabeln `OrderStatus`.
    * Lägg till en **Send a message**-nod under action-noden.
    * I meddelandet, klicka på `{X}` och välj variabeln `OrderStatus`.

6.  **Avsluta snyggt:**
    * Lägg till en sista nod: **Topic management** -> **End topic**.

### Testa allt!
1.  Öppna testpanelen. Starta om med Refresh.
2.  Skriv: `Jag vill ha en laptop`.
3.  Välj en prestandanivå (Standard).
4.  När listan visas och den frågar om beställning, svara `Ja`.
5.  Välj en dator i kortet, skriv en kommentar och klicka **Skicka**.
6.  *Nu ska agenten tänka en liten stund, anropa ditt Agent Flow, och sedan svara med bekräftelsen. Samtidigt ska det plinga till i din inkorg!*

!!! success "Grattis!"
    Du har nu byggt en fullständig kedja med ett **Agent Flow**:
    AI (Förstår) -> Logik (Styr) -> Data (SharePoint) -> GUI (Adaptive Card) -> Agent Flow (Power Automate) -> Verkligheten (Email).