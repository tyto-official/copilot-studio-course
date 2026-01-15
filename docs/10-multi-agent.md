# 10. Multi-Agent Orchestration (Finalen)

Nu är vi framme vid finalen! Vi ska sluta cirkeln och visa hur agenter kan samarbeta.

Vi ska bygga ett scenario där:
1.  Din huvudagent tar emot ett viktigt mejl (Beställningar och felanmälan).
2.  Istället för att hantera det själv, delegerar den uppgiften till en **"Specialist"** (en dedikerad Child Agent).
3.  Specialisten analyserar mejlet och skickar en notis i **Microsoft Teams**.

---

## 10.1 Skapa E-post-triggern (Lyssnaren)

Först måste agenten få en ny trigger som lyssnar på inkommande mejl.

1.  Gå till fliken **Overview** och sektionen **Triggers**.
2.  Klicka **+ Add trigger**.

    ![Add Trigger](assets/images/chap10/bild1.png)

3.  Sök efter och välj:
    ```text
    When a new email arrives
    ```

    ![Search Trigger](assets/images/chap10/bild2.png)

4.  Klicka på **When a new email arrives (V3)** och därefter på **Next**.

    ![Select Email Trigger](assets/images/chap10/bild3.png)

5.  Kontrollera att anslutningen är grön (Connected) och klicka på **Next**.

    ![Check Connection](assets/images/chap10/bild4.png)

6.  **Konfigurera Triggern:**
    Idealiskt sett vill man kanske inte att agenten ska vakna av alla olika mejl, men i denna lab vill vi se agentens förmåga att filtrera och plocka upp relevanta mejl utan fördefinerade filter. Tanken är att denna ska agera som företagets centrala IT-support. Därav kommer vi konfigurera den på följande vis:

    * **Folder:** Klicka på mapp-ikonen och välj **Inbox** (Inkorgen).

    ![Select Inbox](assets/images/chap10/bild5.png)

    * **Importance:** Låt resterande vara oförändrade och klicka på **Create trigger**.

---

## 10.2 Skapa Teams-verktyget (Child Agent)

Nu vet vi att vår huvudagent lyssnar och tar emot inkommande mejl. För att göra huvudagenten smart och effektiv kommer vi delegera analysen av dessa mejl till en så kallad *Child Agent*.

1.  Gå tillbaka till *Overview*. 
2.  Scrolla ner till **Agents**-delen i **Overview** och klicka på **+ Add agent**.

    ![Add Agent](assets/images/chap10/bild6.png)

3.  Rutan *Choose how you want to extend your agent* dyker upp.
    * Här ser vi alternativet *Create a Child agent*.
    * (Notera: Eftersom vi i början gjorde en dedikerad *Solution* ser vi att inga andra agenter är valbara, eftersom de tillhör en annan enviromen).

    * Klicka på **New child agent**.

    ![New Child Agent](assets/images/chap10/bild7.png)

    * **Name:** Döp agenten till:
      ```text
      Email Agent
      ```

    ![Name Agent](assets/images/chap10/bild8.png)

    * **When will this be used:** Låt vara som standard (dvs "Agent chooses based on description"). Detta är viktigt för orkestreringen.

    ![Description Setting](assets/images/chap10/bild9.png)

    * **Description:** Det här är avgörande. Det är denna text som Huvudagenten läser för att förstå *när* den ska lämna över jobbet. Skriv:

    ```text
    Använd denna agent för att hantera och analysera inkommande e-postmeddelanden som rör beställningar eller supportärenden. Denna agent kan analysera innehållet och notifiera via Teams.
    ```

    ![Description Text](assets/images/chap10/bild10.png)

    * Klicka sedan på **Save** uppe i högra hörnet.

    ![Save](assets/images/chap10/bild12.png)

---

## 10.3 Konfigurera Child Agenten

Nu har vi skapat "skalet" för agenten. Nu ska vi kliva in i den och ge den en hjärna och verktyg.

1.  **Ge Instruktioner:**
    På fliken **Overview** för din Child Agent, hitta rutan för **Instructions**. Klicka på **Edit**.
    
    Klistra in följande instruktioner som talar om hur den ska bete sig:

    ```text
    Du är en 'Email Triage Specialist'. Din uppgift är att analysera innehållet i inkommande mejl som skickas till dig från huvudagenten.

    1. Identifiera vilken typ av ärende det gäller (Ny beställning eller Supportärende).
    2. Extrahera viktig information:
       - Om det är en beställning: Vilken modell och vem som beställer.
       - Om det är support: Vad felet är.
    3. Använd verktyget 'Notify IT Team' för att skicka en sammanfattning till Teams-chatten.
    ```

    * Klicka på **Save**.

    ![Agent Instructions](assets/images/chap10/bild13.png)

---

## 10.4 Lägg till Teams-verktyg

För att agenten ska kunna utföra punkt 3 i sina instruktioner måste den ha ett verktyg.

1.  Gå till fliken **Tools** inne i din Child Agent.

    ![Tools](assets/images/chap10/bild14.png)

2.  Klicka på **+ Add**.

    ![Add](assets/images/chap10/bild15.png)

3.  Sök efter:
    ```text
    Post message in a chat or channel
    ```
    
    ![Search Tool](assets/images/chap10/bild16.png)

4.  Välj **Post message in a chat or channel** genom att klicka på den.

    ![Add Teams Action](assets/images/chap10/bild17.png)

5.  Kontrollera anslutningen och klicka **Add and configure**.

    ![Add Configure](assets/images/chap10/bild18.png)

6.  **Konfigurera Verktyget:**
    * **Name:**
      ```text
      Notify IT Team
      ```
    * **Description:**
      ```text
      Skickar ett meddelande till IT-supportens Teams-chatt med information från mejlet.
      ```

    ![Configure Tool](assets/images/chap10/bild19.png)

7.  **Konfigurera Inputs:**
    Vi vill göra det enkelt och säkert att det fungerar.

    1. Klicka på **Dynamically fill with AI** bredvid *Post as* och välj **Custom value**.

    ![Configure Post As](assets/images/chap10/bild20.png)

    2. Klicka på **Select an option** och välj **Flow bot**.

    ![Select Flow Bot](assets/images/chap10/bild21.png)

    3. Klicka på **Dynamically fill with AI** bredvid **Post in** och välj **Custom value**.

    ![Configure Post In](assets/images/chap10/bild22.png)

    4. Klicka på **Select an option** och välj **Chat with Flow bot**.

    ![Select Chat Flow Bot](assets/images/chap10/bild23.png)

    5. Notera att en ny input dyker upp: *Recipient*. Välj även här att klicka på **Dynamically fill with AI** och sedan **Custom value**.

    ![Configure Recipient](assets/images/chap10/bild24.png)

    6. Skriv in din E-postadress i fältet.

    ![Enter Email](assets/images/chap10/bild25.png)

    7. För **Message**, låt stå kvar på *Dynamically fill with AI* men välj att klicka på **Edit** (eller Customize).

    ![Edit Message](assets/images/chap10/bild26.png)

    8. I rutan **Description** för Message, skriv in följande:
       ```text
       En sammanfattning av e-postinnehållet inklusive, Syfte (Beställning/Support) och Viktiga detaljer.
       ```

    9. Stäng panelen för Message.

8.  Klicka **Save**.

---

## 10.5 Uppdatera Huvudagenten

Nu är all logik för child-agenten klar. Vi ska nu uppdatera huvudagenten för att den ska förstå att den ska delegera jobbet.

1.  Navigera tillbaka till Huvudagentens **Overview**.

    ![Huvudagent Overview](assets/images/chap10/bild27.png)

2.  Gå ner till **Instructions** och klicka på **Edit**.

    ![Huvudagent Instructions](assets/images/chap10/bild28.png)

3.  Lägg till följande instruktioner i slutet:

    ```text
    - För inkommande mejl, delegera vidare direkt till /Email Agent och skicka med all information.
    ```

    ![Huvudagent Instructions Added](assets/images/chap10/bild29.png)

4.  Klicka på **Save**.

---

## 10.6 The Grand Finale (Testa alltihop)

Nu knyter vi ihop säcken. Vi ska simulera hela kedjan:
Beställning -> Mejl -> Trigger -> Huvudagent -> Child Agent -> Teams.

1.  **Öppna Testpanelen:**
    * Se till att du är i Huvudagenten (**IT Support Helper**).
    * Gå till **Overview**.
    * Klicka på **Test trigger** bredvid din E-post trigger.
    * Klicka **Start testing**.

    ![Start Testing](assets/images/chap10/bild30.png)

2.  **Skapa händelsen:**
    Vi behöver att ett mejl med ämnet "Typ av förfrågan: Ny enhet" landar i din inkorg.
    * Antingen: Öppna din mejl och skicka ett mejl till dig själv med det ämnet och texten "Jag vill ha en Surface Laptop".
    * Eller (Coolare): Öppna en *ny* flik med Copilot Studio, starta en ny chatt med din agent och gör en beställning (precis som i kapitel 8). Detta genererar mejlet automatiskt.

3.  **Vänta och Se:**
    * Gå tillbaka till fliken där Test Trigger snurrar.
    * När mejlet landar i din inkorg (kolla Outlook), börjar agenten jobba.
    * Titta på **Activity Map** i testpanelen.

    **Du kommer se:**
    1.  Triggern aktiveras.
    2.  Huvudagenten analyserar inkommande data.
    3.  Huvudagenten delegerar till **Email Agent** (Child Agent).
    4.  Child Agenten kör Teams-verktyget.

4.  **Resultat:**
    Kontrollera din Teams. Du ska ha fått ett chattmeddelande från **Power Automate** (Flow bot) med en sammanfattning av beställningen!

    ![Teams Success](assets/images/chap10/bild31.png)

!!! success "MISSION COMPLETE"
    Grattis! Du har nu byggt en **Multi-Agent lösning** med:
    * **Autonomi:** Agenten lyssnar och agerar självständigt.
    * **Orkestrering:** Huvudagenten delegerar till specialister.
    * **Integration:** Hela flödet knyter ihop SharePoint, Outlook och Teams.