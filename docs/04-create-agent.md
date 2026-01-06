# 4. Skapa Agenten

Nu har vi gjort klart all nödvändig setup. Vi har datan, vi har miljön och vi har vår Solution. Nu är det dags att börja bygga!

Vi ska bygga en **IT Support Helper**. I början kommer den fokusera på hårdvara (det vi lade i SharePoint), men tanken är att den ska växa och kunna hantera alla möjliga IT-frågor framöver.

---

## Vägval: Hur skapar vi agenten?

Eftersom vi i förra kapitlet ställde in din Solution som **Preferred** (Föredragen), spelar det ingen roll varifrån du skapar agenten. Den kommer automatiskt hamna i rätt "låda".

Vi rekommenderar att du använder huvudmenyn (den vanliga vägen), men för kännedom kan man även göra det inifrån sin Solution.

??? info "Alternativ väg: Skapa direkt inifrån din Solution (Klicka för att se)"
    Om du vill vara 100% säker på var agenten hamnar, eller om du inte använder "Preferred solution"-funktionen, gör du så här:

    **1. Gå in i din Solution**
    Navigera till **Solutions** i menyn och klicka på din lösning (`IT Helpdesk Agent`).
    
    ![Lista med solutions](assets/images/chap04/create-sol-list.png)

    **2. Klicka på New**
    Väl inne i lösningen ser du allt som ingår i den. Klicka på **+ New** i toppmenyn.
    
    ![Inne i solution](assets/images/chap04/create-sol-inside.png)

    **3. Välj Agent**
    I menyn som fälls ut, välj **Agent** -> **Agent**.
    
    ![Menyval för att skapa agent](assets/images/chap04/create-sol-menu.png)
    
    *Detta tar dig till som en preview för att skapa agnten här kan du antingen låga coilot skapa grunderna till agnten.
    
    ![Menyval för att skapa agent](assets/images/chap04/create-sol-preview.png)
    
    Eller genom att använda togeln bestämma namn smat lite andra inställningar innan agnten ofillt skapas genom att klicka på create. 
    
    ![Menyval för att skapa agent](assets/images/chap04/create-sol-create.png)

---

## Steg 1: Starta skapandet

Vi använder standardvägen via huvudmenyn.

1. Klicka på **Agents** i vänstermenyn.
2. Klicka på **+ Create agent** (eller *Create blank agent*).

---

## Steg 2: AI vs. Manuell start

Du möts nu av vyn "Describe to build".

![Chattrutan vid start](assets/images/chap04/create-start-chat.png)

Här ställs vi inför ett val:

* **Alternativ A (Describe):** Vi chattar med Copilot ("Skapa en IT-agent..."). Då fyller AI:n i namn, beskrivning och instruktioner åt oss.
* **Alternativ B (Skip):** Vi hoppar över chatten och ställer in allt själva.

**Vi väljer Alternativ B.**
Varför? För att vi vill ha full kontroll. AI:n är bra på att gissa, men när vi bygger professionella agenter vill vi veta *exakt* vilka instruktioner och verktyg som är aktiverade.

1. Klicka på knappen **Skip to configure** (längst upp till höger).

![Klicka på Skip to configure](assets/images/chap04/create-skip-button.png)

---

## Steg 3: Grundkonfiguration

Nu är vi inne i agentens inställningar. Fyll i följande:

1.  **Name:** `IT Support Helper`
2.  **Icon:** (Valfritt) Klicka på ikonen för att ladda upp en bild eller välja en färg.
3.  **Description:**
    ```text
    Företagets IT-assistent. Hjälper anställda med frågor om hårdvara, nätverk och teknisk support.
    ```
    *(Denna text syns för användaren i Teams/M365).*

---

## Steg 4: Sätt upp Instruktioner (System Prompt)

Detta är agentens "personlighet". Här bestämmer vi hur den ska bete sig och vad den får göra.

1. Se till att du är på fliken **Instructions**.
2. I den stora textrutan, klistra in följande prompt:

```text
Du är en hjälpsam och professionell IT-supportassistent för företaget.
Din uppgift är att hjälpa anställda med frågor rörande IT, hårdvara och felsökning.

Riktlinjer för dina svar:
- Var alltid vänlig och pedagogisk.
- Svara på samma språk som användaren ställer frågan på (Svenska eller Engelska).
- Om du inte hittar svaret i din kunskapsbank, svara ärligt "Jag hittar tyvärr ingen information om det i mina system".
- Hitta aldrig på fakta (hallucinera inte).
- Använd punktlistor för att göra teknisk information lättläst.