# 9. Autonomi (Vakna till liv)

Hittills har din agent varit reaktiv: den sitter snällt och väntar på att du ska säga "Hej".
Nu ska vi göra den **proaktiv**. Vi ska ge agenten förmågan att reagera på händelser i omvärlden och agera helt självständigt.

Vi kommer att göra två saker i detta kapitel:
1.  **Övning 1 (Academy-spåret):** Vi sätter upp en trigger som reagerar när ett nytt supportärende skapas i SharePoint.
2.  **Övning 2 (Förberedelse):** Vi lägger till en trigger för inkommande e-post (som vi ska använda i finalen).

---

## 9.0 Förberedelse: Skapa SharePoint-lista

För att kunna testa detta behöver vi en lista där ärenden kan skapas.

1.  Gå till din SharePoint-site (samma som vi använde för *Devices*).
2.  Klicka på **+ New** -> **List** -> **Blank list**.
3.  Döp den till: `Tickets`.
4.  Klicka **Create**.
5.  (Valfritt) Lägg till en kolumn för "Priority" (Choice) och "Description" (Text) om du vill vara noga, men för denna övning räcker standardkolumnerna.

---

## 9.1 Aktivera Generativ Orkestrering

För att triggers ska fungera måste agentens "hjärna" vara inställd på att tänka självständigt (Generative Orchestration).

1.  Öppna din agent **IT Support Helper**.
2.  Gå till fliken **Overview**.
3.  Under rubriken **Orchestration**, se till att **Generative orchestration** är satt till **On**.
    *(Om den redan är på, låt den vara).*

    ![Enable Generative AI](assets/images/chap09/gen-ai-enable.png)

---

## 9.2 Skapa SharePoint-triggern

Nu ska vi koppla ihop agenten med listan vi just skapade.

1.  Stanna kvar på **Overview**-fliken och scrolla ner till sektionen **Triggers**.
2.  Klicka på **+ Add trigger**.

    ![Add Trigger](assets/images/chap09/trigger-add-menu.png)

3.  Sök efter och välj: **When an item is created (SharePoint)**.

    ![Select SharePoint Trigger](assets/images/chap09/trigger-select-sharepoint.png)

4.  **Konfigurera anslutningen:**
    * **Trigger name:** Döp den till:
      ```text
      New Support Ticket Created in SharePoint
      ```
    * Vänta tills anslutningen (Connection) är klar (grön bock).
    * Klicka **Next**.

5.  **Konfigurera parametrarna:**
    * **Site Address:** Välj din "Contoso IT" (eller IT Help Desk) site.
    * **List Name:** Välj listan **Tickets**.

    ![Configure Trigger](assets/images/chap09/trigger-config-sharepoint.png)

6.  **Ge agenten instruktioner:**
    Nu måste vi berätta för agenten vad den ska göra när triggern går igång. Kopiera in följande text i rutan **Additional instructions**:

    ```text
    New Support Ticket Created in SharePoint: {Body}
    
    Use the 'Acknowledge SharePoint Ticket' tool to generate the email body automatically and respond.
    
    IMPORTANT: Do not wait for any user input. Work completely autonomously.
    ```

    ![Trigger Instructions](assets/images/chap09/trigger-instructions.png)

7.  Klicka på **Create trigger**.
    *Nu skapas ett Power Automate-flöde i bakgrunden som agerar "lyssnare".*
8.  Klicka **Close** när det är klart.

---

## 9.3 Redigera Triggern (Power Automate)

Just nu får agenten bara veta *att* något hände. Vi vill ge den *detaljerna* (Vem skapade ärendet? Vad handlar det om?). För att göra det måste vi redigera flödet och lägga in en formel.

1.  I sektionen **Triggers** på Overview-sidan, klicka på de **tre prickarna (...)** bredvid din nya trigger.
2.  Välj **Edit in Power Automate**.

    ![Edit Trigger Flow](assets/images/chap09/trigger-edit-flow.png)

    *Ett nytt fönster öppnas.*

3.  Klicka på noden **Sends a prompt to the specified copilot for processing**.
4.  Hitta fältet **Body/message**.
5.  **Ta bort** allt innehåll som står där (t.ex. `{Body}`).
6.  Tryck på **snedstreck-tangenten (`/`)** och välj **Insert Expression** (blixten/fx-ikonen).

    ![Insert Expression](assets/images/chap09/flow-edit-expression.png)

7.  Kopiera och klistra in följande formel i uttrycksfältet (Expression):

    ```powerfx
    concat('Submitted By Name: ', first(triggerOutputs()?['body/value'])?['Author/DisplayName'], '\nSubmitted By Email: ', first(triggerOutputs()?['body/value'])?['Author/Email'], '\nTitle: ', first(triggerOutputs()?['body/value'])?['Title'], '\nIssue Description: ', first(triggerOutputs()?['body/value'])?['Description'], '\nPriority: ', first(triggerOutputs()?['body/value'])?['Priority/Value'],'\nTicket ID : ', first(triggerOutputs()?['body/value'])?['ID'])
    ```
    *(Denna kod skapar en snygg textsträng med all info agenten behöver).*

8.  Klicka **Add** (eller Insert).
9.  Klicka på **Save** (eller Publish) högst upp till höger.
10. När det är sparat, stäng Power Automate-fliken och gå tillbaka till Copilot Studio.

    ![Flow Updated](assets/images/chap09/flow-update-finished.png)

---

## 9.4 Ge Agenten ett verktyg (Email Tool)

Agenten har fått instruktionen att "Använda 'Acknowledge SharePoint Ticket' tool", men det verktyget finns inte än! Vi måste skapa det. Här använder vi en **Connector** direkt som verktyg (inte ett Agent Flow som i förra kapitlet).

1.  Gå till fliken **Topics** (eller Tools/Actions beroende på version).
2.  Klicka på **+ Add a tool** (eller Add an action) och välj **Connector**. (Ibland ligger Connectors direkt under "Add a tool").

    ![Add Email Tool](assets/images/chap09/tool-add-email.png)

3.  Sök efter och välj **Send an email (V2)**.
4.  Vänta på anslutningen och klicka **Add and configure** (eller Next).

5.  **Konfigurera verktyget:**
    * **Name:**
      ```text
      Acknowledge SharePoint ticket
      ```
    * **Description:**
      ```text
      This tool sends an email acknowledgement that a ticket has been received.
      ```

6.  **Konfigurera Inputs:**
    Klicka på **Edit** (eller Customize) bredvid *Inputs*. Vi ska ställa in vad agenten ska fylla i.

    * **To:**
        * **Description:**
          ```text
          The email address of the person submitting the SharePoint Ticket
          ```
        * **Identify as:** Välj **Email**.

    * **Subject:** (Om du kan redigera denna, sätt den till "Ticket Received", annars låt agenten bestämma).

    * **Body:**
        * **Description:**
          ```text
          An acknowledgement that the Ticket was received, and we aim to respond within 3 working days.
          ```

    ![Configure Email Tool](assets/images/chap09/tool-config-email.png)

7.  Klicka **Save**.

---

## 9.5 Testa Autonomin

Nu är sanningens ögonblick här. Kan agenten jobba utan oss?

1.  Gå till fliken **Overview** i Copilot Studio.
2.  Leta upp din trigger i listan och klicka på ikonen **Test Trigger** (ser ut som en liten blixt eller play-knapp).
    *Detta öppnar testpanelen i "lyssnar-läge".*

3.  Öppna en ny webbläsarflik och gå till din **SharePoint-lista (Tickets)**.
4.  Klicka **+ New** och skapa ett test-ärende:
    * **Title:** `Unable to connect to VPN`
    * **Description:** `Unable to connect to corporate WIFI network after recent update` (om du har kolumnen, annars skriv i Title).
    * **Priority:** `Normal` (om du har kolumnen).
5.  Klicka **Save**.

    ![Create SharePoint Item](assets/images/chap09/test-sharepoint-item.png)

6.  Gå tillbaka till Copilot Studio och titta på testpanelen.
    *Det kan ta 1-2 minuter innan triggern vaknar. Klicka på **Refresh**-ikonen i testpanelen då och då.*

    ![Test Panel Waiting](assets/images/chap09/test-panel-trigger.png)

7.  När triggern dyker upp i listan, klicka på **Start testing**.
8.  Agenten kommer nu att köra igång. Klicka på **Activity Map** (kart-ikonen högst upp i testpanelen) för att se vad den gör.

    **Du bör se:**
    1.  Agenten tar emot datan (Trigger payload).
    2.  Agenten bestämmer sig för att använda verktyget "Acknowledge SharePoint ticket".
    3.  Verktyget körs.

    ![Activity Map Success](assets/images/chap09/test-success-map.png)

9.  Kontrollera din mejlkorg. Har du fått ett bekräftelsemejl?

    ![Email Success](assets/images/chap09/test-email-result.png)

---

## 9.6 Förberedelse: E-post-triggern

Nu har vi bevisat att agenten kan agera autonomt på en SharePoint-lista.
För att förbereda inför nästa kapitel (där vi ska koppla ihop allt), ska vi lägga till en trigger till.

Vi vill att agenten ska vakna när det kommer en **ny beställning** via mejl (det mejlet vi byggde i kapitel 8).

1.  Gå till **Overview** -> **Triggers**.
2.  Klicka **+ Add trigger**.
3.  Sök efter och välj: **When a new email arrives (V3)** (Office 365 Outlook).
4.  **Konfigurera:**
    * **Trigger name:** `New Device Order Received`
    * Klicka **Next**.
5.  **Parametrar:**
    * **Folder:** `Inbox`
    * **Subject Filter:**
      ```text
      Typ av förfrågan: Ny enhet
      ```
      *(Detta är viktigt! Vi vill bara att agenten vaknar på just dessa mejl, inte alla dina mejl).*
    * **Instructions:**
      ```text
      Notify the user that the order email has been received and will be processed by the specialist agent.
      ```
6.  Klicka **Create trigger**.

!!! success "Bra jobbat!"
    Du har nu en agent som:
    1. Reagerar på IT-ärenden i SharePoint och skickar bekräftelser.
    2. Lyssnar efter beställningsmejl (som vi ska använda i nästa kapitel).
    
    Din agent är nu **autonom**.