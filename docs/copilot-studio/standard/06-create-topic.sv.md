# 6. Skapa ett ämne

Nu ska du skapa ämnet **Tillgängliga enheter**. Ämnet tar emot den enhetstyp som användaren frågar efter, hämtar matchande enheter från SharePoint och lämnar tillbaka resultatet till agenten.

I slutet av övningen uppdaterar du agentens instruktioner i två steg. Först ser du vad en kort instruktion ger för svar. Sedan gör du instruktionen tydligare så att agenten visar enheternas uppgifter, bilder och priser på ett mer användbart sätt.

---

## Del 1: Skapa ämnet

Gå till fliken **Ämnen**. Klicka på **+ Lägg till ett ämne** och välj **Från tomt**.

![Menyn Lägg till ett ämne med alternativet Från tomt](../../assets/standard/images-sv/chap06/1.png)

Ge ämnet följande namn:

```text
Tillgängliga enheter
```

Skriv sedan följande under **Beskriv kortfattat vad ämnet gör**:

```text
Använd ämnet när någon frågar efter en ny dator, bärbar dator, stationär dator eller surfplatta, eller vill veta vilka enheter som finns tillgängliga. Ämnet returnerar en lista med matchande enheter. Presentera resultatet och fråga om användaren vill begära en enhet.
```

Klicka på **Spara**.

![Ämnet Tillgängliga enheter med namn och beskrivning](../../assets/standard/images-sv/chap06/2.png)

---

## Del 2: Skapa ämnets indata och utdata

Ämnet behöver en indatavariabel för enhetstypen och en utdatavariabel för de enheter som SharePoint returnerar.

### Skapa indatavariabeln

Klicka på **Detaljer** i verktygsfältet och öppna fliken **Indata**.

![Detaljpanelen med flikarna Ämnesinformation, Indata och Utdata](../../assets/standard/images-sv/chap06/3.png)

Klicka på **Skapa en ny variabel**.

![Fliken Indata innan någon variabel har skapats](../../assets/standard/images-sv/chap06/4.png)

Fyll i indatavariabeln så här:

1. Ange variabelnamnet:

    ```text
    OnskadEnhetstyp
    ```

2. Låt **Hur ska handläggaren fylla i dessa indata?** vara **Fyll i dynamiskt med det bästa alternativet (standard)**.
3. Låt **Variabelns datatyp** vara **String**.
4. Använd samma namn som visningsnamn:

    ```text
    OnskadEnhetstyp
    ```

5. Under **Identifiera som**, välj **Användarens hela svar**.

![Inställningarna för indatavariabeln och valet Användarens hela svar](../../assets/standard/images-sv/chap06/5.png)

Skriv följande beskrivning:

```text
Typ av enhet som användaren frågar efter. Returnera exakt ett av värdena Laptop, Desktop eller Tablet. Bärbar dator och laptop blir Laptop. Stationär dator och fast dator blir Desktop. Surfplatta, iPad och tablet blir Tablet. Returnera bara värdet, inte användarens fullständiga mening.
```

Beskrivningen hjälper agenten att omvandla olika sätt att uttrycka samma sak till de värden som finns i SharePoint-listan.

![Den färdiga indatavariabeln med beskrivning](../../assets/standard/images-sv/chap06/6.png)

### Skapa utdatavariabeln

Öppna fliken **Utdata** och klicka på **Skapa en ny variabel**.

![Fliken Utdata innan någon variabel har skapats](../../assets/standard/images-sv/chap06/7.png)

Ange variabelnamnet:

```text
HittadeEnheter
```

Ändra sedan **Variabelns datatyp** till **Tabell**. SharePoint kan returnera flera enheter, så resultatet behöver lagras som en tabell och inte som en enda textsträng.

![Utdatavariabeln HittadeEnheter med datatypen Tabell vald](../../assets/standard/images-sv/chap06/8.png)

Skriv följande beskrivning:

```text
De tillgängliga enheter som matchar den efterfrågade enhetstypen. Varje rad innehåller enhetens ID, modell, tillverkare, färg och pris.
```

Klicka på **Spara**.

![Den färdiga utdatavariabeln med beskrivning](../../assets/standard/images-sv/chap06/9.png)

---

## Del 3: Hämta tillgängliga enheter från SharePoint

I den här kursversionen lägger du SharePoint-noden direkt under utlösaren. Det kringgår ett problem som kan få ämnesredigeraren att låsa sig när **Hämta objekten** placeras efter en fråge- eller meddelandenod. Ett villkor kan läggas till senare när den kombinationen fungerar stabilt igen.

### Lägg till verktyget Hämta objekten

Stäng detaljpanelen om den fortfarande är öppen. Klicka på **plusknappen (+)** under utlösaren och välj **Lägg till ett verktyg**. Gå till **Anslutningsprogram** och sök efter:

```text
Hämta objekten
```

Välj SharePoint-åtgärden. Om Copilot Studio visas på engelska söker du efter **Get items**.

![Sökning efter SharePoint-åtgärden Hämta objekten](../../assets/standard/images-sv/chap06/10.png)

Första gången du använder åtgärden behöver du skapa eller välja en SharePoint-anslutning. Kontrollera kontot och klicka på **Skicka**.

![Val av anslutning för SharePoint-åtgärden Hämta objekten](../../assets/standard/images-sv/chap06/11.png)

När noden har lagts till döper du den till:

```text
Kontrollera enhetstyp
```

![SharePoint-noden med namnet Kontrollera enhetstyp](../../assets/standard/images-sv/chap06/12.png)

### Beskriv hur verktyget ska användas

Klicka på de tre punkterna i nodens övre högra hörn och välj **Egenskaper**.

![Menyn på SharePoint-noden med alternativet Egenskaper](../../assets/standard/images-sv/chap06/13.png)

På fliken **Initiering** skriver du följande under **Användningsbeskrivning**:

```text
Hämtar de enheter i SharePoint-listan Enheter som är tillgängliga och matchar den enhetstyp som användaren frågar efter.
```

Använd texten ovan även om en annan exempeltext visas i bilden.

![Fliken Initiering för SharePoint-noden](../../assets/standard/images-sv/chap06/14.png)

### Välj webbplats och lista

Öppna fliken **Indata**. Under **Site Address** väljer du SharePoint-webbplatsen **Lyserno IT-support**.

![Val av SharePoint-webbplatsen Lyserno IT-support](../../assets/standard/images-sv/chap06/15.png)

Under **List Name** väljer du listan **Enheter**.

![Val av SharePoint-listan Enheter](../../assets/standard/images-sv/chap06/16.png)

### Filtrera enheterna

Under **Avancerade parametrar** letar du upp **Filter Query**. Håll muspekaren över fältet, klicka på de tre punkterna och byt från **Anpassad** till **Formel**. Klicka sedan på ikonen för att expandera formelredigeraren.

![Filter Query inställt för en Power Fx-formel](../../assets/standard/images-sv/chap06/17.png)

Klistra in följande formel:

```powerfx
Concatenate("Status eq 'Tillgänglig' and AssetType eq '", Topic.OnskadEnhetstyp, "'")
```

Formeln hämtar bara poster som har statusen `Tillgänglig` och den enhetstyp som indatavariabeln innehåller. Värdena måste stämma exakt med SharePoint-listan: `Laptop`, `Desktop` eller `Tablet`.

Kontrollera att förhandsgranskningen inte visar något fel och klicka på **Infoga**.

![Den färdiga filterformeln i Power Fx-redigeraren](../../assets/standard/images-sv/chap06/18.png)

Längst ner under de avancerade parametrarna väljer du **Alla objekt** för **Limit Columns by View**.

![Vyn Alla objekt vald för Limit Columns by View](../../assets/standard/images-sv/chap06/19.png)

### Spara SharePoint-resultatet globalt

Öppna fliken **Utdata**. Resultatet heter först `GetItems` och har datatypen **Record**. Klicka på variabeln för att öppna dess egenskaper.

![SharePoint-nodens utdata innan variabeln har döpts om](../../assets/standard/images-sv/chap06/20.png)

Döp om variabeln till:

```text
HamtadeEnheter
```

![Variabeln HamtadeEnheter med användningen Ämne](../../assets/standard/images-sv/chap06/21.png)

Ändra **Användning** från **Ämne** till **Global**. Det fullständiga namnet blir då `Global.HamtadeEnheter`. Du ska inte skriva in namnet själv. Det ändras automatiskt när du väljer **Global**.

Den globala variabeln används igen senare i kursen när agenten ska arbeta vidare med de enheter som hämtats.

![Variabeln HamtadeEnheter ändrad till global användning](../../assets/standard/images-sv/chap06/22.png)

---

## Del 4: Koppla resultatet till ämnets utdata

SharePoint-åtgärden returnerar ett helt svarspaket. Själva raderna ligger i egenskapen `value`. Nu ska du lägga dessa rader i ämnets utdatavariabel `HittadeEnheter`.

Klicka på **plusknappen (+)** under SharePoint-noden. Välj **Variabelhantering** och sedan **Ange variabelvärde**.

![Menyn Variabelhantering med alternativet Ange variabelvärde](../../assets/standard/images-sv/chap06/23.png)

Döp noden till:

```text
Spara matchande enheter
```

Under **Ange variabel** väljer du ämnets utdatavariabel:

```text
HittadeEnheter
```

![Utdatavariabeln HittadeEnheter vald i noden](../../assets/standard/images-sv/chap06/24.png)

Vid **Till värde** öppnar du formelredigeraren och skriver:

```powerfx
Global.HamtadeEnheter.value
```

Kontrollera att formeln ger en tabell och klicka på **Infoga**.

![Formeln som kopplar SharePoint-raderna till ämnets utdata](../../assets/standard/images-sv/chap06/25.png)

Klicka på **Spara**. Ämnet ska nu bestå av utlösaren, SharePoint-noden **Kontrollera enhetstyp** och variabelnoden **Spara matchande enheter**. Gå sedan tillbaka till **Översikt**.

![Det färdiga ämnesflödet med tre noder](../../assets/standard/images-sv/chap06/26.png)

---

## Del 5: Använd ämnet i agentens instruktioner

På fliken **Översikt** klickar du på **Redigera** vid agentens instruktioner. Lägg först till den här korta instruktionen under **Arbetssätt**:

```text
- När användaren frågar vilka enheter som finns tillgängliga, använd /Tillgängliga enheter. Presentera enheterna som ämnet returnerar och fråga om användaren vill begära någon av dem.
```

Ämnet måste infogas som en riktig referens. När du kommer till ämnesnamnet skriver du `/` och väljer **Tillgängliga enheter** i listan med förslag. Om du bara klistrar in `/Tillgängliga enheter` blir det vanlig text och agenten får inte samma tydliga koppling till ämnet.

![Ämnet Tillgängliga enheter valt från förslagen i instruktionerna](../../assets/standard/images-sv/chap06/27.png)

Klicka på **Spara** och öppna testpanelen. Starta en ny testsession och skriv:

```text
Jag behöver en bärbar dator
```

Första gången ämnet använder SharePoint kan du behöva klicka på **Tillåt** för att godkänna anslutningen. Agenten hittar rätt enheter, men den korta instruktionen kan ge ett kompakt och ganska oformaterat svar.

![Det första testet med ett kortfattat svar från agenten](../../assets/standard/images-sv/chap06/28.png)

### Gör instruktionen tydligare

Gå tillbaka till instruktionerna. Behåll inledningen fram till och med referensen till ämnet **Tillgängliga enheter**, men ersätt resten med följande text:

```text
Presentera varje enhet med modell, tillverkare, enhetstyp, färg och pris. Visa även enhetens bild direkt i svaret när en bildlänk finns. Skriv inte ut bildadressen som vanlig text. Använd bara uppgifterna som ämnet returnerar och fyll inte i information som saknas. Behåll valutan från datakällan. Om ingen valuta anges ska priset visas i USD. Fråga därefter om användaren vill begära någon av enheterna.
```

Klicka sedan på **Spara**.

![Den utvecklade instruktionen med en referens till ämnet](../../assets/standard/images-sv/chap06/29.png)

Starta en ny testsession och använd samma fråga igen:

```text
Jag behöver en bärbar dator
```

Agenten ska nu visa varje tillgänglig bärbar dator med de efterfrågade uppgifterna och bilden direkt i svaret. Den ska inte ta med enheter som har statusen **Bokat**.

![Det förbättrade testsvar som visar enhetsbilder och fullständiga uppgifter](../../assets/standard/images-sv/chap06/30.png)

!!! success "Ämnet är klart"
    Du har skapat ett ämne som tar emot en enhetstyp, filtrerar SharePoint-listan och returnerar matchande enheter till agenten. Du har också sett hur tydligare instruktioner förändrar hur resultatet presenteras.
