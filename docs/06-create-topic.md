# 6. Skapa en Styrd Dialog (Topic)

Nu när agenten har både tonläge och kunskap, ska vi titta på hur vi kan **styra** ett samtal. Detta är en av de viktigaste delarna för att få agenten att utföra faktiska uppgifter.

Vi ska skapa en "Topic" (ett ämne) som hanterar lagersaldokontroll.

---

## 6.1 Skapa och Beskriv Ämnet

Vi börjar med att skapa ett tomt ämne och berätta för AI:n vad det ska användas till.

1.  Gå till fliken **Topics** i menyn.

    ![Topics](assets/images/chap06/topic-menu.png)

2.  Klicka på **+ Add a topic** och välj **From blank**.

    ![Skapa topic från blankt](assets/images/chap06/topic-create-blank.png)

3.  Nu ser du en tom topic. Klicka på namnet "Untitled" högst upp till vänster och döp den till:

    ```text
    Available devices
    ```

    ![Döp topic till Available devices](assets/images/chap06/topic-rename.png)

    *(Vi använder engelska på namnet för att hålla det tekniskt rent).*

4.  Redan nu på arbetsytan (Canvasen) ser du rutan **Trigger**. Under rubriken *Describe what the topic does*, klistra in följande beskrivning:

    ```text
    Detta ämne hjälper användare att hitta enheter som är tillgängliga i vår SharePoint-lista. Användaren kan fråga efter tillgängliga enheter och får då tillbaka en lista som kan inkludera laptops, smartphones, tillbehör med mera.
    ```

    *Beskrivningen är avgörande. Det är den här texten som agentens "hjärna" läser för att förstå NÄR den ska aktivera just den här topicen.*

    ![Topic Description i Trigger-noden](assets/images/chap06/topic-trigger-description.png)

---

## 6.2 Definiera Input (Input Variable)

Nu ska vi göra något smart. Vi vill att agenten ska kunna plocka upp *vad* användaren letar efter (t.ex. "Laptop") redan i första meningen.

1.  Klicka på **Details** (cirkeln med utropstecken `i`) längst upp till höger för att fälla ut detaljpanelen.
    *Notera att Name och Description redan är ifyllda eftersom vi gjorde det i förra steget.*

    ![Verifiera detaljer](assets/images/chap06/topic-details-verify.png)

2.  I detaljpanelen, klicka på fliken **Input**.

    ![Topic Input](assets/images/chap06/topic-input.png)

3.  Klicka på knappen **Create a new variable**.

    ![Skapa input variabel](assets/images/chap06/topic-input-create.png)

### Konfigurera variabeln
Nu får du upp inställningar för din nya variabel. Fyll i följande:

1.  **Name:**
    ```text
    VarDeviceType
    ```
    
    !!! tip "Varför engelska och inga mellanslag?"
        Vi följer "Best Practice" inom Power Platform och programmering. Genom att använda alfanumeriska namn (Bokstäver A-Z och siffror) undviker vi problem med specialtecken (å, ä, ö) när vi senare ska använda variabeln i formler och kod.

2.  **How will the agent fill this input?:** Låt denna stå kvar på **Dynamically fill with best option (default)**.
    *Detta betyder att vi litar på att AI-modellen (LLM) är smart nog att hitta informationen i användarens mening.*

3.  **Variable data type:** Låt stå på **String** (Text).

4.  **Display name:** (Valfritt).
    ```text
    VarDeviceType
    ```

5.  **Identify as:** Klicka på listan och välj: **User's entire response**.
    *Detta ger oss mest flexibilitet att fånga upp precis det användaren frågar efter.*

    ![Välja Identify as](assets/images/chap06/topic-identify-as.png)

6.  **Description:** (Detta fält är till för AI:n, inte användaren).
    Det handlar om att specificera vad vi är ute efter. Eftersom vi valde att ta med *hela* användarens svar, är det bra att ge AI:n en fingervisning om vilka värden vi letar efter i texten.

    ```text
    Lista av möjliga värden: Laptop, Desktop, Tablet
    ```

    Om allt är ifyllt enligt instruktionerna borde det se ut ungefär så här:

    ![Variabelinställningar klara](assets/images/chap06/topic-variable-settings.png)

---

## 6.3 Definiera Output (Output Variable)

Vi är inte riktigt klara än! Vi ska redan nu bestämma vad den här topicen ska leverera tillbaka till agenten när den är klar. Eftersom vi ska hämta en lista med produkter, måste vi förbereda en variabel för det.

1.  Längst upp i detaljpanelen, klicka på fliken **Output**.

    ![Topic Output flik](assets/images/chap06/topic-output.png)

2.  Klicka på **Create a new variable**.

    ![Skapa output variabel](assets/images/chap06/topic-output-create.png)

### Konfigurera output-variabeln

1.  **Name:**
    ```text
    VarAvailableDevices
    ```

2.  **Variable data type:** **OBS! Viktigt steg.**
    Klicka på listan (där det står *String*) och ändra till **Table**.
    
    *Varför? Jo, en "String" är bara text (t.ex. "Dator"). Men vi ska hämta en hel lista med flera produkter, priser och bilder från SharePoint. Då krävs datatypen Tabell.*

3.  **Description:**
    ```text
    Lista över tillgängliga enheter baserat på enhetstyp
    ```

    Kontrollera att det ser ut så här:

    ![Output inställningar](assets/images/chap06/topic-output-settings.png)

4.  Nu är vi klara med inställningarna! Stäng detaljpanelen genom att klicka på krysset (**X**) högst upp till höger.

    ![Stäng panelen](assets/images/chap06/topic-details-close.png)