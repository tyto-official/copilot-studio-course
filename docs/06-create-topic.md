# 6. Skapa en Styrd Dialog (Topic)

Nu när agenten har både tonläge och kunskap, ska vi titta på hur vi kan **styra** ett samtal. Detta är en av de viktigaste delarna för att få agenten att utföra faktiska uppgifter.

Vi ska skapa en "Topic" (ett ämne) som hanterar lagersaldokontroll.

---

## Steg 1: Skapa och Beskriv Ämnet

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

## Steg 2: Definiera Input (Input Variable)

Nu ska vi göra något smart. Vi vill att agenten ska kunna plocka upp *vad* användaren letar efter (t.ex. "Laptop") redan i första meningen.

1.  Klicka på **Details** (cirkeln med utropstecken `i`, eller texten *Details* i menyn) längst upp till höger för att fälla ut detaljpanelen.
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

4.  **Display name:** (Valfritt, för din egen skull).
    ```text
    VarDeviceType
    ```

5.  **Identify as:** Klicka på listan.
    Här ser du massor av färdiga alternativ som *City*, *Color*, *Age*. Dessa är bra om du letar efter exakta standardvärden.
    Men eftersom vi letar efter specifika IT-prylar väljer vi: **User's entire response**.
    
    *Detta ger oss mest flexibilitet att fånga upp precis det användaren frågar efter.*

    ![Välja Identify as](assets/images/chap06/topic-identify-as.png)

6.  **Description:** (Detta fält är till för AI:n, inte användaren).
    ```text
    Lista av möjliga värden: Laptop, Desktop, Tablet
    ```

    ![Variabelinställningar klara](assets/images/chap06/topic-variable-settings.png)

### Extra: Logik för återförsök
Om du klickar på **Additional settings** längst ner i rutan kan du se inställningar för hur envis agenten ska vara.

![Additional settings](assets/images/chap06/topic-additional-settings.png)

Här kan man t.ex. ställa in "How many reprompts" (hur många gånger agenten får fråga om den inte kan sätta input variabeln). Vi låter standardvärdena vara kvar, men det är bra att veta att logiken finns här.

7.  Stäng detaljpanelen på krysset (X) och klicka på **Save** uppe till höger.

---

### Vad har vi byggt nu?
Du har skapat en **Input Variabel**.
Det fungerar så här: Agenten läser din *Description* och förstår att den ska leta efter en "Enhetstyp".
Om användaren säger *"Jag letar efter en Laptop"*, kommer agenten automatiskt att hugga ordet "Laptop", stoppa ner det i variabeln `VarDeviceType`, och sedan starta din Topic med den informationen redo att användas.