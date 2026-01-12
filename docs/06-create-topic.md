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

---

## 6.4 Bygga Logiken (Conditions & Questions)

Nu har vi en start (Trigger), en Input och en Output. Nu ska vi bygga det som händer däremellan – själva "hjärnan" i topicen.

### 1. Välj Nod-typ
Vi ska börja med att skapa ett vägskäl. Om användaren vill ha en "Laptop" ska vi ställa vissa frågor. Om de vill ha något annat, gör vi något annat.

1.  Håll muspekaren över linjen under din **Trigger**-nod och klicka på **plus-tecknet (+)**.

    ![Lägg till nod](assets/images/chap06/topic-add-node.png)

2.  En meny öppnas. Här är en snabb genomgång av verktygslådan:

    ![Verktygslådan](assets/images/chap06/topic-toolbox.png)

    * **Send a message:** Skickar text eller bilder till användaren.
    * **Ask a question:** Ställer en fråga och sparar svaret (det vi ska använda snart).
    * **Ask with adaptive card:** Visar interaktiva formulär (mer om detta senare).
    * **Add a condition:** Skapar vägval (Om X, gör Y). Som en "If-sats".
    * **Variable management:** För att skapa eller ändra variabler manuellt.
    * **Topic management:** För att hoppa till andra topics eller avsluta samtalet.
    * **Call an action (Add a tool):** Här hittar vi våra "superkrafter" som Power Automate och SharePoint.
    * **Advanced:** Avancerade funktioner som HTTP-anrop och inloggning.

3.  Välj **Add a condition**.

    ![Add a condition](assets/images/chap06/topic-add-condition.png)

### 2. Konfigurera Vägvalet (Condition)
Nu ser du att flödet delar sig i två vägar: *Condition* och *All other conditions*.

1.  Klicka på rutan där det står **Condition** och döp noden till: 

    ```text
    Laptop
    ```

    ![Condition](assets/images/chap06/topic-laptop-condition.png)

2.  Vi ska nu bestämma regeln. Klicka på **Select a variable**.
3.  Välj din input-variabel: 
    ```text
    VarDeviceType
    ```
4.  Låt operation vara satt till **is equal to**.
5.  I rutan *Enter or select a value*, skriv:
    ```text
    Laptop
    ```

    *Nu har du sagt: "Om användaren letar efter en Laptop -> Gå till vänster. Annars -> Gå till höger."*

    ![Vägvalet klart](assets/images/chap06/topic-condition-split-laptop.png)

### 3. Ställ frågor (Tratten)
Vi fortsätter på spåret för "Laptop" (den vänstra vägen). Vi vill veta vilken prestanda användaren behöver.

1.  Klicka på **plus-tecknet (+)** under din nya *Laptop*-nod.
2.  Välj **Ask a question**.

    ![Välj fråga](assets/images/chap06/topic-question-performance.png)

3.  **Döp om noden:**
    Klicka på namnet *Question* högst upp på noden och ändra det till:
    ```text
    Prestandaval
    ```

    ![Döp om noden](assets/images/chap06/topic-question-performance-rename.png)

4.  I rutan **Enter a message**, skriv:
    ```text
    För vilken typ av arbete ska datorn användas?
    ```

    ![Fråga meddelande](assets/images/chap06/topic-question-performance-message.png)

5.  Under **Identify**, se till att **Multiple choice options** är valt.
6.  Under **Options for user**, skapa två alternativ:
    * `Standard (Office/Admin)`
    * `High Performance (Utveckling/Grafik)`

    *(Genom att ge specifika alternativ styr vi användaren rätt).*

    ![Alternativ för prestanda](assets/images/chap06/topic-question-performance-options.png)

### 4. Döpa om Variabeln
Agenten sparar automatiskt svaret i en variabel som heter `Var1`. Det är ett dåligt namn om vi ska minnas vad det betyder.

1.  Klicka på rutan där det står **Save user response as** (där namnet `Var1` står).

    ![Döp om variabel](assets/images/chap06/topic-var-rename-performance.png)

2.  En ruta öppnas till höger. Ändra **Name** till:
    ```text
    VarPerformance
    ```

    ![Döp om variabel](assets/images/chap06/topic-var-rename-performance-2.png)

    *Notera "Usage" inställningen: Topic (limited scope) vs Global. Vi låter den vara kvar på Topic eftersom vi inte behöver komma åt det här svaret från andra delar av agenten.*

3.  Stäng variabel-rutan på krysset (X).

### 5. Städa upp grenarna (Förenkling)
När du skapade alternativen skapade Copilot Studio automatiskt tre vägar åt dig:

![Grenar](assets/images/chap06/topic-branches.png)

1.  **Condition** (VarPerformance = Standard)
2.  **Condition** (VarPerformance = High Performance)
3.  **All other conditions**

Detta är onödigt komplicerat för vår övning. Vi förenklar det genom att ta bort den specifika grenen för "High Performance" och låta "Allt annat" hantera det valet.

1.  Leta upp grenen som specifikt heter **High Performance** (Condition: VarPerformance = High Performance).
2.  Klicka på de **tre prickarna (...)** på den noden och välj **Delete**.
    *Nu har du bara två vägar kvar: Standard och All other conditions.*

    ![Grenar](assets/images/chap06/topic-branches-delete.png)

3.  **Döp om vägarna för tydlighet:**
    * Klicka på pennan på den vänstra grenen (*Condition*). Döp om den till `Standard`.
    * Klicka på pennan på den högra grenen (*All other conditions*). Döp om den till `High Performance` (eller Avancerad).

### 6. Hantera logiken i grenarna
Nu ska vi bestämma vad som händer i respektive gren.

**Gren 1: Standard**
Användaren valde Standard. Här är allt som vanligt och finns i lager.
* **Åtgärd:** Gör ingenting. Låt grenen vara tom.
    *Flödet kommer automatiskt att rinna vidare ner till botten där vi strax ska hämta listan.*

**Gren 2: High Performance (All other)**
Användaren valde High Performance (eller något annat). Låt oss simulera att dessa är tillfälligt slut, men att vi vill vara hjälpsamma och visa vad som finns ändå.

1.  Klicka på **plus-tecknet (+)** i den högra grenen (som du döpte till High Performance).
2.  Välj **Send a message**.

    ![Meddelande](assets/images/chap06/topic-message-outofstock.png)

3.  Skriv:
    ```text
    Just nu har vi tyvärr lång leveranstid på High Performance-enheter. Jag visar dig listan på våra Standard-modeller som finns för omgående leverans istället.
    ```

    ![Meddelande om slut i lager](assets/images/chap06/topic-message-outofstock-2.png)

*Nu är logiken klar: De som väljer Standard går raka vägen. De som väljer Avancerat får ett meddelande. Båda grupperna landar till slut på samma ställe – i SharePoint-söket som vi lägger till härnäst.*

## 6.5 Hämta data (SharePoint Connector)

Nu ska vi hämta listan på datorer.
Vi ska placera denna koppling **längst ner i flödet**, där alla vägar ("Laptop"-vägen och "All other"-vägen) möts igen.
På så sätt fungerar sökningen oavsett om användaren letar efter en Laptop, en Desktop eller en Tablet.

### 1. Lägg till Connectorn
1.  Scrolla längst ner i ditt flödesschema. Leta upp punkten där linjerna från dina olika vägval kopplas ihop igen.
2.  Klicka på **plus-tecknet (+)** under sammanslagningen (där trådarna möts).

    ![Lägg till action](assets/images/chap06/topic-ja-add-node.png)

3.  Välj **Add a tool**

    ![Lägg till action](assets/images/chap06/topic-action-add-tool.png)

4.  Välj **Connectors**

    ![Lägg till action](assets/images/chap06/topic-action-add-tool-connectors.png)

5.  Sök efter **SharePoint - Get items**

    ![Lägg till action](assets/images/chap06/topic-action-add-tool-sharepoint-getitems.png)

### 2. Skapa anslutningen (Autentisering)
Om detta är första gången du använder SharePoint i denna agent, måste du godkänna anslutningen.
* Om du ser en knapp där det står **Not connected**, klicka på den.
* Välj **Create new connection**
* Välj **Connect directly (cloud-services)** och klicka **Create**.
* Välj ditt konto och klicka **Allow access** om en ruta poppar upp.

När anslutningen är klar, klicka på **Submit** (eller Add) för att lägga till noden i ditt flöde.

![Connector tillagd](assets/images/chap06/topic-connector-submit.png)

### 3. Konfigurera Egenskaper (Properties)
Nu har vi en "dum" SharePoint-nod. Vi måste berätta för den vilken lista den ska läsa ifrån.

1.  Klicka på de **tre prickarna (...)** i högra hörnet på den nya *Get items*-noden och välj **Properties**.

    ![Tre prickar](assets/images/chap06/topic-connector-properties-node.png)

2.  En sidomeny öppnas. Se till att du är på fliken **Initiation**.

3.  I fältet **Usage Description**, skriv:
    ```text
    Hämtar enheter från SharePoint-listan
    ```
    *(Detta hjälper agenten förstå vad verktyget gör).*

    ![Properties panel](assets/images/chap06/topic-properties-pane.png)

4.  Hoppa över "Error handling". Gå direkt till sektionen **Inputs**.

    ![Inputs](assets/images/chap06/topic-prop-inputs.png)

5.  **Site Address:** Välj din SharePoint-sida (**IT Help Desk**) i listan.

    ![Välj site](assets/images/chap06/topic-prop-site.png)

6.  **List Name:** Välj din lista (**Devices**).

    ![Välj lista](assets/images/chap06/topic-prop-list.png)

### 4. Filtrera listan (Power Fx)
Om vi inte gör något nu, kommer agenten hämta *allt*. Vi vill bara ha **Available** (tillgängliga) enheter av rätt typ (t.ex. **Laptop**).

Här måste vi använda **Power Fx**, som är Microsofts formelspråk.

1.  Hitta fältet **Filter Query** under *Advanced parameters*.

    ![Filter query](assets/images/chap06/topic-prop-filterquery.png)

2.  Klicka på de **tre prickarna (...)** vid fältet och välj **Formula**.

    ![Tre prickar](assets/images/chap06/topic-prop-filterquery-formula.png)

3.  Klicka på den lilla pilen (vinkeln) för att expandera formelfältet så du ser bättre.

    ![Expandera formel](assets/images/chap06/topic-prop-formula-expand.png)

4.  Kopiera och klistra in exakt denna kod:
    ```powerfx
    Concatenate("Status eq 'Available' and AssetType eq '", Topic.VarDeviceType, "'")
    ```

    **Vad betyder koden?**
    Vi bygger en mening som SharePoint förstår. `Concatenate` betyder "klistra ihop".
    Vi klistrar ihop texten *"Status är Available OCH AssetType är..."* med värdet från vår input-variabel `VarDeviceType` (t.ex. "Laptop").
    
    *Resultatet som skickas till SharePoint blir: `Status eq 'Available' and AssetType eq 'Laptop'`*

5.  Kontrollera att du har en liten **grön bock** brevid formelfältet. Det betyder att koden är korrekt.

    ![Grön bock formel](assets/images/chap06/topic-prop-formula-check.png)

6.  Klicka **Insert**.

7.  (Valfritt men bra) Scrolla ner till **Limit Columns by View**. Välj **All items**.
    *Ibland kan SharePoint gömma kolumner om man inte väljer en vy. Detta garanterar att vi får all data. Kan behöva refresch för att få upp alternativen.*

    ![Välj vy](assets/images/chap06/topic-prop-view.png)

### 5. Spara resultatet (Output)
Nu har vi ställt frågan till SharePoint. Nu ska vi ta hand om svaret.

1.  I Properties-panelen, klicka på fliken **Output**.

    ![Output flik](assets/images/chap06/topic-prop-output.png)

2.  Klicka på variabelnamnet (som troligen heter *GetItems*).
3.  Döp om den till:
    ```text
    VarDevices
    ```

    ![Output inställningar](assets/images/chap06/topic-prop-output-vardevices.png)

4.  Ändra **Usage** till **Global**.
    *Varför? För att vi vill att denna lista ska vara tillgänglig för hela agenten, ifall vi vill använda den i andra topics senare.*

    ![Output inställningar](assets/images/chap06/topic-prop-output-global.png)

5.  Stäng Properties-panelen på krysset (X).

---

## 6.7 Koppla ihop allt (Output Mapping)

Nu har vi hämtat datan till en *Global* variabel (`VarDevices`).
Men minns du att vi i början av Topicen (steg 6.3) skapade en specifik Output-variabel för just den här topicen (`VarAvailableDevices`)? Vi måste flytta datan från den ena till den andra.

1.  Lägg till en ny nod under din SharePoint-nod.
2.  Välj **Variable management** -> **Set a variable value**.

    ![Set variable](assets/images/chap06/topic-set-var-node.png)

3.  Under **Set variable**, välj topicens output-variabel: `VarAvailableDevices`.

    ![Set variable](assets/images/chap06/topic-set-var-node-varavailabledevices.png)

4.  Under **To value**, klicka på pilen/ikonen och välj **Formula**.

    ![Set variable](assets/images/chap06/topic-set-var-node-value-to-formula.png)

5.  Skriv in följande formel:
    ```powerfx
    Global.VarDevices.value
    ```

    **Varför .value?**
    SharePoint skickar tillbaka ett paket med massor av info. Själva listan med rader (datorerna) ligger inuti en egenskap som heter `value`. Vi måste "packa upp" den för att vår tabell ska bli rätt.

    ![Formel för value](assets/images/chap06/topic-set-var-formula-value.png)

6.  Klicka **Insert**.
7.  **Spara** din Topic (Save högst upp till höger).

---

## 6.8 Uppdatera Agentens Instruktioner

Nu är Topicen klar! Men agenten vet inte om att den finns eller hur den ska användas än. Vi måste uppdatera huvudinstruktionerna.

1.  Gå till fliken **Overview** högst upp.

    ![Overview flik](assets/images/chap06/agent-overview.png)

2.  Vid **Instructions**, klicka på **Edit**.

    ![Edit instructions](assets/images/chap06/agent-instructions-edit.png)

3.  Lägg till följande rad i instruktionerna (gärna sist i listan):

    ```text
    - Hjälp till att hitta tillgängliga enheter och ge fullständiga detaljer genom att använda [Available devices]. Extrahera alltid VarDeviceType från indatan. Efter att ha presenterat detaljerna, fråga användaren om de vill beställa en enhet från listan.
    ```

    *(Tips: När du skriver `[Available devices]`, se till att du faktiskt väljer topicen från listan som poppar upp, så att den blir en klickbar länk i instruktionen).*

4.  Klicka **Save**.

*Logiken är klar! Nu fångar vi upp "fel" märke och leder in dem på rätt spår igen, eller avslutar om de inte är intresserade.*

!!! success "Bra jobbat!"
    Du har nu byggt en avancerad funktion!
    
    1. Agenten lyssnar efter vad användaren vill ha (Input).
    2. Den ställer smarta följdfrågor (Logic).
    3. Den hämtar data från SharePoint (Action).
    4. Den levererar en snygg lista tillbaka (Output).

---