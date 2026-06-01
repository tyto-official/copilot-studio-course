# 6. Skapa en styrd dialog (ämne)

Nu när agenten har både tonläge och kunskap ska vi titta på hur vi kan **styra** ett samtal.

I den här delen skapar vi ett ämne som hjälper användaren att hitta tillgängliga enheter från SharePoint-listan. Vi bygger också ett enkelt **vägval** så att du ser hur ett ämne kan göra olika saker beroende på vad användaren frågar efter.

---

## 6.1 Skapa och beskriv ämnet

Vi börjar med att skapa ett tomt ämne och berätta för agenten vad ämnet ska användas till.

1.  Gå till fliken **Ämnen** i menyn.

    ![Ämnen](assets/images-sv/chap06_ny/1.png)

2.  Klicka på **+ Lägg till ett ämne** och välj **Från tom**.

    ![Skapa ämne från tomt](assets/images-sv/chap06_ny/3.png)

3.  Klicka på namnet **Namnlös** högst upp till vänster och döp ämnet till:

    ```text
    Tillgängliga Enheter
    ```

    ![Döp ämne till Tillgängliga Enheter](assets/images-sv/chap06_ny/4.png)

4.  På arbetsytan ser du rutan **Utlösare**. Under rubriken *Beskriv vad ämnet gör*, klistra in följande beskrivning:

    ```text
    Detta ämne hjälper användare att hitta enheter som är tillgängliga i vår SharePoint-lista. Användaren kan fråga efter tillgängliga enheter och får då tillbaka en lista som kan inkludera laptops, stationära datorer och surfplattor.
    ```

    Beskrivningen hjälper agenten att förstå **när** just det här ämnet ska användas.

    ![Ämnets beskrivning i Utlösare-noden](assets/images-sv/chap06_ny/5.png)

---

## 6.2 Skapa indata

Nu ska vi skapa en indatavariabel. Den ska hålla reda på vilken typ av enhet användaren letar efter, till exempel `Laptop`, `Desktop` eller `Tablet`.

1.  Klicka på **Detaljer** längst upp till höger för att fälla ut detaljpanelen.

    ![Verifiera detaljer](assets/images-sv/chap06_ny/6.png)

2.  Klicka på fliken **Indata**.

    ![Ämne Indata](assets/images-sv/chap06_ny/7.png)

3.  Klicka på **Skapa en ny variabel**.

    ![Skapa indatavariabel](assets/images-sv/chap06_ny/8.png)

### Konfigurera indatavariabeln

Fyll i variabeln så här:

1.  **Name:**

    ```text
    OnskadEnhetstyp
    ```

    !!! tip "Varför inte å, ä och ö?"
        Vi använder svenska namn, men utan å, ä och ö. Det gör namnen lättare att använda i formler och minskar risken för tekniska problem.

2.  **Hur ska agenten fylla i denna indata?:** Låt stå kvar på **Fyll i dynamiskt med bästa alternativ (standard)**.

3.  **Variabelns datatyp:** Låt stå på **Sträng**.

4.  **Visningsnamn:** Skriv samma namn:

    ```text
    OnskadEnhetstyp
    ```

5.  **Identifiera som:** Välj **Användarens hela svar**.

    ![Välja Identifiera som](assets/images-sv/chap06_ny/9.png)

6.  **Beskrivning:** Skriv:

    ```text
    Lista av möjliga värden: Bärbar dator, Desktop, Surfplatta
    ```

    Detta hjälper agenten förstå vilken typ av enhet användaren letar efter.

    ![Variabelinställningar klara](assets/images-sv/chap06_ny/10.png)

---

## 6.3 Skapa utdata

Vi ska också skapa en utdatavariabel. Den ska innehålla listan med enheter som ämnet hittar.

1.  Klicka på fliken **Utdata** i detaljpanelen.

    ![Ämne Utdata-flik](assets/images-sv/chap06_ny/11.png)

2.  Klicka på **Skapa en ny variabel**.

    ![Skapa utdatavariabel](assets/images-sv/chap06_ny/13.png)

### Konfigurera utdatavariabeln

1.  **Name:**

    ```text
    HittadeEnheter
    ```

2.  **Variabelns datatyp:** Ändra från **Sträng** till **Tabell**.

    Vi väljer **Tabell** eftersom SharePoint kan skicka tillbaka flera rader, inte bara ett textvärde.

3.  **Beskrivning:**

    ```text
    Lista över tillgängliga enheter baserat på enhetstyp
    ```

    ![Utdatainställningar](assets/images-sv/chap06_ny/12.png)

4.  Stäng detaljpanelen genom att klicka på krysset (**X**) högst upp till höger.

    ![Stäng panelen](assets/images-sv/chap06_ny/12.5.png)

---

## 6.4 Bygg ett vägval

Nu ska vi skapa ett vägval. Syftet är att visa hur ett ämne kan göra något extra i en viss situation.

I vårt fall ska ämnet visa ett kort meddelande om användaren frågar efter en bärbar dator. Efter meddelandet fortsätter flödet ändå vidare till SharePoint.

### Lägg till villkor

1.  Håll muspekaren över linjen under **Utlösare**-noden och klicka på **plus-tecknet (+)**.

    ![Lägg till nod](assets/images-sv/chap06_ny/14.png)

2.  Välj **Lägg till ett villkor**.

    ![Lägg till ett villkor](assets/images-sv/chap06_ny/15.png)

### Konfigurera villkoret

Nu delar sig flödet i två vägar: ett villkor och **Alla andra villkor**.

1.  Klicka på rutan där det står **Villkor** och döp den till:

    ```text
    Bärbar dator
    ```

    ![Villkor](assets/images-sv/chap06_ny/16.png)

2.  Klicka på **Välj en variabel**.

3.  Välj indatavariabeln:

    ```text
    OnskadEnhetstyp
    ```

4.  Låt operationen vara **är lika med**.

5.  I rutan *Ange eller välj ett värde*, skriv:

    ```text
    Laptop
    ```

    Nu har du sagt: om användaren letar efter en bärbar dator, gå via grenen **Bärbar dator**. Annars går samtalet via **Alla andra villkor**.

    ![Vägvalet klart](assets/images-sv/chap06_ny/17.png)

### Lägg till ett meddelande på bärbar-dator-grenen

1.  Klicka på **plus-tecknet (+)** under grenen **Bärbar dator**.

2.  Välj **Skicka ett meddelande**.

    ![Meddelande](assets/images-sv/chap06_ny/27.png)

3.  Skriv:

    ```text
    Just nu kan det vara längre leveranstid på bärbara datorer. Ha det i åtanke när du gör din beställning.
    ```

    ![Meddelande om leveranstid](assets/images-sv/chap06_ny/28.png)

Grenen **Alla andra villkor** ska vara tom. Den går direkt vidare till SharePoint-steget.

Poängen är att båda vägarna möts igen efter vägvalet:

* Bärbar dator: visar ett meddelande och fortsätter.
* Alla andra: fortsätter direkt.

---

## 6.5 Hämta data från SharePoint

Nu ska vi hämta enheter från SharePoint-listan. SharePoint-steget ska ligga **efter** vägvalet, där grenarna möts igen.

### Lägg till SharePoint-verktyget

1.  Scrolla längst ner i flödesschemat. Leta upp punkten där grenarna möts.

2.  Klicka på **plus-tecknet (+)** under sammanslagningen.

    ![Lägg till åtgärd](assets/images-sv/chap06_ny/29.png)

3.  Välj **Lägg till ett verktyg**.

    ![Lägg till verktyg](assets/images-sv/chap06_ny/30.png)

4.  Välj **Anslutningar**.

    ![Anslutningar](assets/images-sv/chap06_ny/30.1.png)

5.  Sök efter:

    ```text
    Hämta objekten
    ```

    Välj **SharePoint - Hämta objekten**.

    ![Hämta objekt](assets/images-sv/chap06_ny/30.2.png)

### Skapa anslutningen

Om detta är första gången du använder SharePoint i agenten behöver du godkänna anslutningen.

* Om du ser **Inte ansluten**, klicka där.
* Välj **Skapa ny anslutning**.
* Välj **Anslut direkt (molntjänster)** och klicka på **Skapa**.
* Välj ditt konto och klicka på **Tillåt åtkomst** om du får upp en fråga.

När anslutningen är klar, klicka på **Skicka** eller **Lägg till** för att lägga till noden i flödet.

![Connector tillagd](assets/images-sv/chap06_ny/31.png)

### Konfigurera SharePoint-steget

1.  Klicka på de **tre prickarna (...)** i högra hörnet på den nya *Hämta objekt*-noden och välj **Egenskaper**.

    ![Tre prickar](assets/images-sv/chap06_ny/32.png)

2.  Se till att du är på fliken **Initiering**.

3.  I fältet **Användningsbeskrivning**, skriv:

    ```text
    Hämtar enheter från SharePoint-listan
    ```

    ![Egenskapspanel](assets/images-sv/chap06_ny/33.png)

4.  Gå till sektionen **Indata**.

    ![Indata](assets/images-sv/chap06_ny/34.png)

5.  **Webbplatsadress:** Välj din SharePoint-sida **IT Supporten**.

    ![Välj webbplats](assets/images-sv/chap06_ny/35.png)

6.  **Listnamn:** Välj listan **Enheter**.

    ![Välj lista](assets/images-sv/chap06_ny/36.png)

### Filtrera listan

Om vi inte filtrerar hämtar SharePoint alla enheter. Vi vill bara hämta enheter som är tillgängliga och matchar den enhetstyp användaren frågade efter.

1.  Hitta fältet **Filterfråga** under *Avancerade parametrar*.

    ![Filterfråga](assets/images-sv/chap06_ny/37.png)

2.  Klicka på de **tre prickarna (...)** vid fältet och välj **Formel**.

    ![Tre prickar](assets/images-sv/chap06_ny/38.png)

3.  Expandera formelfältet så att du ser bättre.

    ![Expandera formel](assets/images-sv/chap06_ny/39.png)

4.  Klistra in följande kod:

    ```powerfx
    Concatenate("Status eq 'Tillgänglig' and AssetType eq '", Topic.OnskadEnhetstyp, "'")
    ```

    Formeln bygger ihop en filterfråga som SharePoint förstår.

    Om användaren söker efter en bärbar dator blir resultatet ungefär:

    ```text
    Status eq 'Tillgänglig' and AssetType eq 'Bärbar dator'
    ```

    !!! info "Om din lista använder svenska interna kolumnnamn"
        I vissa SharePoint-miljöer kan det interna kolumnnamnet skilja sig från det som visas på skärmen. Om filtret inte ger några resultat, kontrollera vilket internt namn kolumnen **Resurstyp** har i just din lista och använd det namnet i formeln.

5.  Kontrollera att du får en **grön bock** vid formelfältet.

    ![Grön bock formel](assets/images-sv/chap06_ny/40.png)

6.  Klicka på **Infoga**.

7.  Valfritt men bra: Scrolla ner till **Begränsa kolumner efter vy** och välj **Alla objekt**.

    ![Välj vy](assets/images-sv/chap06_ny/41.png)

### Spara resultatet

Nu ska vi spara svaret från SharePoint i en variabel.

1.  I egenskapspanelen, klicka på fliken **Utdata**.

    ![Utdata-flik](assets/images-sv/chap06_ny/42.png)

2.  Klicka på variabelnamnet, som troligen heter något i stil med *HämtaObjekt*.

3.  Döp om den till:

    ```text
    HamtadeEnheter
    ```

    ![Utdatainställningar](assets/images-sv/chap06_ny/43.png)

4.  Ändra **Användning** till **Globalt**.

    Det gör att listan även kan användas av nästa ämne, där vi ska visa ett adaptivt kort.

    ![Utdatainställningar](assets/images-sv/chap06_ny/44.png)

5.  Stäng egenskapspanelen.

---

## 6.6 Koppla resultatet till ämnets utdata

SharePoint-steget sparar sitt svar i den globala variabeln `HamtadeEnheter`.

Men ämnet har också en egen utdatavariabel: `HittadeEnheter`. Nu ska vi koppla ihop dem.

1.  Lägg till en ny nod under SharePoint-noden.

2.  Välj **Variabelhantering** och sedan **Ange ett variabelvärde**.

    ![Ange variabel](assets/images-sv/chap06_ny/45.png)

3.  Under **Ange variabel**, välj ämnets utdatavariabel:

    ```text
    HittadeEnheter
    ```

    ![Ange variabel](assets/images-sv/chap06_ny/46.png)

4.  Under **Till värde**, välj **Formel**.

    ![Ange variabel](assets/images-sv/chap06_ny/47.png)

5.  Skriv:

    ```powerfx
    Global.HamtadeEnheter.value
    ```

    SharePoint skickar tillbaka ett paket med flera delar. Själva listan med rader ligger i `value`, så därför använder vi `.value` här.

    ![Formel för value](assets/images-sv/chap06_ny/48.png)

6.  Klicka på **Infoga**.

7.  Klicka på **Spara** högst upp till höger.

---

## 6.7 Uppdatera agentens instruktioner

Nu är ämnet klart, men agenten behöver veta när ämnet ska användas.

1.  Gå till fliken **Översikt**.

    ![Översikt-flik](assets/images-sv/chap06_ny/49.png)

2.  Vid **Instruktioner**, klicka på **Redigera**.

    ![Redigera instruktioner](assets/images-sv/chap06_ny/50.png)

3.  Lägg till följande rad sist i instruktionerna:

    ```text
    - Hjälp till att hitta tillgängliga enheter och ge fullständiga detaljer genom att använda [Tillgängliga Enheter]. Extrahera alltid OnskadEnhetstyp från indatan. Efter att ha presenterat detaljerna, fråga användaren om de vill beställa en enhet från listan.
    ```

    När du skriver `[Tillgängliga Enheter]`, välj ämnet från listan som visas så att det blir en riktig länk.

4.  Klicka på **Spara**.

---

## Testa flödet

1.  Öppna **Testa**-panelen.

2.  Klicka på ikonen för **Karta** och slå på **Spåra mellan ämnen**.

3.  Skriv:

    ```text
    Jag behöver en bärbar dator
    ```

    Agenten ska gå via grenen **Bärbar dator**, visa leveranstidsmeddelandet och sedan hämta data från SharePoint.

4.  Starta en ny test och skriv:

    ```text
    Jag behöver en surfplatta
    ```

    Agenten ska gå via **Alla andra villkor** och direkt vidare till SharePoint.

5.  När agenten frågar om du vill beställa, svara:

    ```text
    Ja tack
    ```

    Agenten vet ännu inte hur själva beställningen ska göras. Det bygger vi i nästa delar.

!!! success "Bra jobbat!"
    Du har nu byggt ett ämne som fångar upp vad användaren söker, gör ett enkelt vägval och hämtar matchande data från SharePoint.
