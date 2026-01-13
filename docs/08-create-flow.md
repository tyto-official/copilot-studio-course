# 8. Skapa ett Agent Flow

Nu ska vi bygga motorn som faktiskt utför beställningen. När användaren klickar på "Skicka" i det adaptiva kortet, ska agenten anropa ett **Agent Flow**.

Skillnaden mot ett vanligt flöde är att ett Agent Flow är skräddarsytt för att ta emot data direkt från din agent, utföra arbete, och sedan svara agenten med ett resultat.

Detta Agent Flow ska:
1.  Ta emot information från chatten (Vilken dator? Vem beställer?).
2.  Hämta detaljer om datorn från SharePoint (för att dubbelkolla att den finns och hämta pris).
3.  Skicka ett beställningsmejl till IT-avdelningen.
4.  Skicka tillbaka en bekräftelse till chatten.

---

## 8.1 Skapa ett nytt Agent Flow

Vi börjar inifrån din Topic **Request device** som vi jobbade med sist.

1.  Gå till **Topics** och öppna **Request device**.
2.  Scrolla längst ner i flödet (under `Ask with Adaptive Card`).
3.  Klicka på **plus-tecknet (+)**.
4.  Välj **Add a tool** -> **New Agent flow**.
    *(Ibland kan det heta "Call an action" -> "Create a flow" beroende på version).*

    ![Skapa flöde](assets/images/chap08/topic-call-action-flow.png)

    *Detta öppnar ett nytt fönster där vi kan bygga vårt Agent Flow.*

---

## 8.2 Definiera Inputs (Trigger)

När vi kommer in i redigeraren för **Agent flows** ser vi två noder.

* Den övre noden: **When an agent calls the flow**. Här bestämmer vi vad agenten ska skicka *in* i processen.
* Den nedre noden: **Respond to the agent**. Här bestämmer vi vad som skickas *tillbaka* till agenten.

Vi börjar med att definiera inputs. Vi behöver tre saker: ID på datorn, vem användaren är, och eventuella kommentarer.

1.  Klicka på noden **When an agent calls the flow** för att öppna inställningarna.

    ![Öppnar noden](assets/images/chap08/flow-open-inputs.png)

2.  Klicka på **+ Add an input**.

    ![Add input](assets/images/chap08/flow-add-input.png)

3.  Du ser nu olika typer av inputs. Välj **Text**.

    ![Add input text](assets/images/chap08/flow-add-input-text.png)

4.  Ställ dig i textrutan (där det står "User's input") och döp om den till:
    ```text
    DeviceSharePointId
    ```
    *Här skickar vi in ID:t från SharePoint.*

    ![Input DeviceSharePointId](assets/images/chap08/flow-add-input-text-device.png)

5.  Gör om proceduren. Klicka **+ Add an input** -> **Text**. Döp den till:
    ```text
    User
    ```
    *Här skickar vi in användarens namn.*

    ![Input User](assets/images/chap08/flow-add-input-text-user.png)

6.  Gör om proceduren igen. Klicka **+ Add an input** -> **Text**. Döp den till:
    ```text
    AdditionalComments
    ```

    ![Input AdditionalComments](assets/images/chap08/flow-trigger-inputs-text-comments.png)

7.  **Gör kommentaren frivillig:**
    Eftersom användaren kanske inte skriver någon kommentar, måste vi göra detta fält valfritt (Optional).
    * Klicka på de **tre prickarna (...)** bredvid fältet *AdditionalComments*.
    * Välj **Make the field optional**.

    ![Gör input frivillig](assets/images/chap08/flow-input-optional.png)

---

## 8.3 Hämta enhetsdetaljer (Get Item)

Agenten skickar bara ett ID (t.ex. "4"). För att mejlet ska bli snyggt måste vi slå upp vad "4" är för dator (Modell, Pris, etc).

1.  Klicka på **plus-tecknet (+)** under trigger-noden.
2.  Sök efter **Get item** och välj **Get item (SharePoint)**.
    *(Obs: Välj "Get item" i singular, inte "Get items", eftersom vi bara ska hämta en specifik rad).*

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

    * **Id:** Vi måste koppla detta till vårt input-värde. Klicka på **fx** (eller blixten) i Id-rutan.

    ![Id fx](assets/images/chap08/flow-getitem-id.png)

    * Välj **Dynamic content** och sök efter:
    ```text
    DeviceSharePointId
    ```
    ![Mappa ID](assets/images/chap08/flow-getitem-dynamic.png)

    * Klicka sedan på **Add**.

    ![Add button](assets/images/chap08/flow-getitem-add.png)

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
2.  Sök efter `Send an email` och välj **Send an email (V2)** (Office 365 Outlook).
    *(Logga in om det behövs).*

    ![Send an email](assets/images/chap08/flow-action-email.png)

3.  Döp om noden till:
    ```text
    Skicka mejl till IT
    ```

4.  **Konfigurera mejlet:**
    Vi ska nu bygga mailet med hjälp av **Dynamiskt innehåll** (värden som hämtas från tidigare steg).

    * **To:** Klicka på **Enter custom value** och skriv in **din egen e-postadress**.

    ![To field](assets/images/chap08/flow-action-email-to.png)

    * **Subject:** Skriv följande text:
    ```text
    Typ av förfrågan: Ny enhet
    ```
    ![Subject field](assets/images/chap08/flow-action-email-subject.png)

    * **Body:** Här bygger vi meddelandet. Kopiera först in grundtexten nedan:

    ```text
    Hej IT-supporten!

    En ny beställning har inkommit.

    Beställare:
    Enhet:
    Pris:

    Kommentar från användaren:

    Vänligen hantera skyndsamt.
    ```

    **Nu ska vi fylla i hålen med data:**

    **1. Lägg till Beställare:**

    * Sätt markören efter "Beställare: ".

    * Klicka på **blixt-ikonen** (Dynamic content) eller `fx`.

    ![Dynamic content](assets/images/chap08/flow-email-dynamiccontent.png)
    
    * Sök efter `User` och välj den från listan (under "When an agent calls the flow").

    ```text
    User
    ```

    ![Select User](assets/images/chap08/flow-email-select-user.png)

    **2. Lägg till Enhet:**

    * Sätt markören efter "Enhet: ".

    * Klicka på blixten.

    * Sök efter `Model` (från steget *Get Device*) och välj den.

    ```text
    Model
    ```

    ![Select Model](assets/images/chap08/flow-email-select-model.png)

    **3. Lägg till Pris:**
    
    * Sätt markören efter "Pris: ".

    * Klicka på blixten.

    * Sök efter `Price` (från steget *Get Device*) och välj den.

    ```text
    Price
    ```

    ![Select Price](assets/images/chap08/flow-email-select-price.png)

    **4. Lägg till Kommentar (Avancerat - Hantera tomma svar):**
    Vi vill kontrollera om användaren lämnade fältet tomt. Om det är tomt skriver vi "None", annars visar vi kommentaren. Vi gör detta med ett uttryck (Expression).

    * Sätt markören efter "Kommentar från användaren: ".

    * Klicka på **fx** (Insert Expression).

    * I rutan för Function/Expression, skriv in följande start:
      ```powerfx
      if(empty(
      ```
      *Detta startar en "Om"-sats som kollar "Om tomt...".*

    ![Select AdditionalComments](assets/images/chap08/flow-email-select-additionalcomments.png)

    * Klicka nu på fliken **Dynamic content**. Sök efter `AdditionalComments` och klicka på den.

    ```text
    AdditionalComments
    ```

    ![Select AdditionalComments](assets/images/chap08/flow-email-select-additionalcomments2.png)

      *Din formel fylls nu på med referensen till input-fältet.*

    * Gå tillbaka till formelfältet och skriv in resten av logiken efter parentesen:
      ```powerfx
      , 'None',
      ```
      *Detta betyder: Om det är tomt -> Skriv 'None'. Nu ska vi ange vad som händer om det INTE är tomt (Else).*

    ![Select AdditionalComments](assets/images/chap08/flow-email-select-additionalcomments3.png)

    * Klicka på fliken **Dynamic content** igen. Sök upp och välj `AdditionalComments` en gång till.

    ```text
    AdditionalComments
    ```
    * Avsluta formeln med en slutparentes `)`.
    * Klicka på **Add** (eller OK).

    ![Expression Logic](assets/images/chap08/flow-email-expression-add.png)

    *Nu är mejlet klart och dynamiskt!*

---

## 8.5 Skicka svar till Agenten (Output)

Slutligen måste vårt Agent Flow berätta för agenten att allt gick bra, och ge ett meddelande som agenten kan visa för användaren.

1.  Klicka på sista noden **Respond to the agent**.
2.  Klicka **+ Add an output**

    ![Add Output](assets/images/chap08/flow-output-add.png)

3.  Klicka på **Text**.

    ![Add Output](assets/images/chap08/flow-output-add-text.png)

4.  Döp outputen till:
    ```text
    ModelValue
    ```
5.  I värdefältet klicka på **blixt-ikonen** (Dynamic content) eller `fx`.

    ![Add Output](assets/images/chap08/flow-output-modelvalue.png)

6.  Sök efter `ModelValue` (från steget *Get Device*) och välj den.

    ```text
    Model
    ```

    ![Select ModelValue](assets/images/chap08/flow-output-select-modelvalue.png)

---

## 8.6 Spara och konfigurera Agent Flow

1.  Längst upp till vänster, klicka på namnet **Save draft**.

    ![Save draft](assets/images/chap08/flow-save-draft.png)

2.  Klicka nu på **Overview**.

    ![Overview](assets/images/chap08/flow-overview.png)

3.  Väl innne i overview och klicka på **Edit**.

    ![Edit](assets/images/chap08/flow-edit.png)

4.  Välj *Flow name* och skriv in:
    ```text
    Send device request email
    ```

5.  Välj *Description* och skriv in:
    ```text
    This flow sends an email to the user with the device request.
    ```

6.  Klicka på **Save**.

    ![Save](assets/images/chap08/flow-save.png)

7.  Klicka nu på **Designer**, och där efter klicka **Publish**.

    ![Designer](assets/images/chap08/flow-designer-publish.png)

## 8.7 Koppla ditt Agent Flow i Topicen

Nu måste vi gå tillbaka till Copilot Studio och koppla in vårt nya Agent Flow.

1.  **Navigera till *Request device* Topicen:**
    Gå tillbaka till Agents, genom att klicka på Agents i menyn till vänster.

    ![Agents](assets/images/chap08/flow-agents.png)

    * Välj *IT Support Helper*.

    ![IT Support Helper](assets/images/chap08/flow-it-support-helper.png)

    * Gå till *Topics* genom att klicka på Topics uppe i menyn.

    ![Topics](assets/images/chap08/flow-topics.png)

    * Välj *Request device*.

    ![Request device](assets/images/chap08/flow-request-device.png)

2.  **Mappa inputs:**
    Nu frågar agenten: "Vad ska jag stoppa in i de input-hål du byggde?"

    1. Gå längst ner, under Adaptive Card, och klicka på **Add**.
    2. Välj **Add a tool** och klicka på våran nyligen skapade agnet flow *Send device request email*.

    ![Add Flow](assets/images/chap08/add-custom-flow.png)

    3. Klicka på det tre unkteran bredvs *Enter or selattc a value* fältet under *DeviceSharePointId* och välj variabeln `deviceSelectionId` (den kommer från ditt Adaptive Card).

    ![Add Flow](assets/images/chap08/add-custom-flow-deviceid.png)

    4. Klicka på det tre unkteran bredvs *Enter or selattc a value* navigera till *System* och sök efter 
    
    ```text
    User
    ```
    
    välj systemvariabeln `User.DisplayName`.

    ![Add Flow](assets/images/chap08/add-custom-flow-user.png)

    5. Klicka på *Advanced inputs*

    ![Add Flow](assets/images/chap08/add-custom-flow-advancedinputs.png)
    
    6. Klicka på det tre unkteran bredvs *Enter or selattc a value* fältet under *AdditionalComments* och navigera till *Formula*, expandera sedan fältet.

    ![Add Flow](assets/images/chap08/add-custom-flow-additionalcomments.png)

    7. Skriv in följande fomula i formelfältet:
    ```powerfx
    If(IsBlank(Topic.commentsId), "", Topic.commentsId)
    ```
    Se till att den gröna bock finns under *Output* för att försäkdig om att det inte är någe syntaxfel, sedan klicka **Insert**

    ![Add Flow](assets/images/chap08/add-custom-flow-additionalcomments2.png)

    !!! info "Var för gjorde vi detta?"
        when true - if the Topic.commentsId string parameter is empty, then we want to insert no value.
        when false - if the Topic.commentsId string parameter is not empty, then insert the value of commentsId variable.

---

## 8.8 Förbättra användarupplevelsen (Bekräftelse)

Vi ska nu lägga till en nod för att ge användaren en tydlig och personlig bekräftelse på att beställningen är mottagen.

1.  Klicka på **plus-tecknet (+)** under din Agent Flow-nod och välj **Send a message**.

    ![Lägg till meddelande](assets/images/chap08/topic-add-message-confirm.png)

2.  Vi ska nu bygga meddelandet steg för steg för att få in dynamiska värden:

    * Börja med att skriva: 
    
    ```text
    Tack `
    ```
    * Klicka på ikonen **{X} (Insert variable)**.

    * Välj fliken **System** och sök efter 
    ```text
    User
    ```
    * Välj **User.DisplayName**.

    ![Infoga användarnamn](assets/images/chap08/topic-msg-insert-user.png)

    * Fortsätt skriva texten: 
    ```text
    . Din valda enhet, `
    ```
    * Klicka på **{X} (Insert variable)** igen.
    * Välj fliken **Custom** och sök efter 
    ```text
    ModelValue
    ```
    * Välj **ModelValue**.

    ![Infoga modell](assets/images/chap08/topic-msg-insert-model.png)

    * Avsluta meningen med att skriva: 
    ```text
    , har skickats in och kommer att granskas av IT-ansvarig.`
    ```

3.  Granska meddelandet. Det ska nu se ut ungefär så här i editorn:

    > Tack {User.DisplayName}. Din valda enhet, {ModelValue}, har skickats in och kommer att granskas av IT-ansvarig.

    ![Färdigt meddelande](assets/images/chap08/topic-msg-complete.png)

!!! success "Snyggt!"
    Nu får användaren en personlig bekräftelse med sitt eget namn och namnet på datorn de valt. 

### Testa allt!
1.  Öppna testpanelen. Starta om med Refresh.
2.  Skriv: 
    ```text
    Jag vill ha en laptop
    ```
3.  Välj en prestandanivå (Standard).
4.  När listan visas och den frågar om beställning, svara `Ja`.
5.  Välj en dator i kortet, skriv en kommentar 
    ```text
    Jag vill ha så mycket RAM minne som möjligt!
    ```
6.  Klicka **Skicka**.
7.  *Nu ska agenten tänka en liten stund, anropa ditt Agent Flow, och sedan svara med bekräftelsen. Samtidigt ska det plinga till i din inkorg!*

!!! success "Grattis!"
    Du har nu byggt en fullständig kedja med ett **Agent Flow**:
    AI (Förstår) -> Logik (Styr) -> Data (SharePoint) -> GUI (Adaptive Card) -> Agent Flow (Power Automate) -> Verkligheten (Email).