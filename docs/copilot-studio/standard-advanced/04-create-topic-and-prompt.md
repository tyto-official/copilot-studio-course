# 4. Skapa ämnet och analysera felbilden

Agenten kan ta emot en bild, men den har ännu ingen styrd process för felanmälan. Nu skapar vi ämnet som tar över dialogen och prompten som läser felbeskrivningen och bilden.

När kapitlet är klart har du:

- skapat ämnet **Rapportera utrustningsfel**
- lagt till ämnets in- och utdata
- bett användaren om en felbild med två bildexempel
- skapat prompten **Analysera felanmälan**
- bestämt ett fast JSON-format för promptens svar

!!! info "Spara efter varje färdig nod"
    Välj **Spara** när en nod är färdig. Då är det enklare att hitta var ett fel uppstod, och du riskerar inte att förlora flera steg på en gång.

---

## Del 1: Skapa ett tomt ämne

Öppna fliken **Ämnen** i agenten. Här finns de ämnen som följer med från början.

![Listan med förkonfigurerade ämnen i Lyserno Driftassistent](../../assets/standard-advanced/chap04/2.png)

Välj **Lägg till ett ämne** och sedan **Från tom**.

![Menyn Lägg till ett ämne med valet Från tom](../../assets/standard-advanced/chap04/3.png)

Ett tomt ämne öppnas i ämnesbyggaren.

![Ett tomt ämne i ämnesbyggaren](../../assets/standard-advanced/chap04/4.png)

Byt namn på ämnet:

```text
Rapportera utrustningsfel
```

I startnoden skriver du modellbeskrivningen:

```text
Använd ämnet när en intern användare vill rapportera fel, skada, läckage, driftstopp, onormalt ljud eller en annan avvikelse på utrustning i Lysernos produktion. Om answered är false ska agenten fortsätta med MaintenanceContext som verifierat underlag; om värdet är true ska svaret inte upprepas.
```

![Ämnet med namn och modellbeskrivning](../../assets/standard-advanced/chap04/7.png)

Beskrivningen hjälper den generativa orkestreringen att välja ämnet. Den första meningen beskriver när ämnet ska användas. Den andra beskriver vad agenten ska göra med ämnets utdata.

Välj **Spara**.

---

## Del 2: Lägg till ämnets in- och utdata

Välj **Detaljer** uppe till höger. Under **Ämnesinformation** kan du kontrollera att namn och modellbeskrivning stämmer.

![Detaljer med ämnets namn och modellbeskrivning](../../assets/standard-advanced/chap04/8.png)

### Indata

Öppna fliken **Indata** och välj **Skapa en ny variabel**.

![Fliken Indata med valet Skapa en ny variabel](../../assets/standard-advanced/chap04/9.png)

Ange följande namn:

```text
FaultDescription
```

Ange beskrivningen:

```text
Användarens ursprungliga beskrivning av utrustningsfelet, inklusive objekt, plats, symtom och påverkan när detta nämns.
```

Behåll typen **String** och välj **Användarens hela svar** under **Identifiera som**.

![Indatavariabeln FaultDescription med typ och beskrivning](../../assets/standard-advanced/chap04/11.png)

### Utdata

Öppna fliken **Utdata** och skapa två variabler.

Den första heter:

```text
answered
```

Sätt typen till **Boolean** och använd beskrivningen:

```text
True om ämnet redan har besvarat ärendet, annars false. I detta ämne sätts värdet till false när underlaget är verifierat men ärendet ska fortsätta i agenten.
```

![Utdatavariabeln answered med typen Boolean](../../assets/standard-advanced/chap04/13.png)

Den andra heter:

```text
MaintenanceContext
```

Behåll typen **String** och använd beskrivningen:

```text
Verifierat underlag i JSON-format. Använd assetId och errorCode med get_fault_history och requiredSkill med find_available_technicians. serviceType och impactLevel avgör om find_spare_parts ska anropas. impactLevel och priority ska behållas till det godkända skrivsteget.
```

![Utdatavariabeln MaintenanceContext med typen String](../../assets/standard-advanced/chap04/14.png)

`answered` används av orkestreringen för att avgöra om ämnet är klart. `MaintenanceContext` kommer senare att bära det verifierade underlaget till agentens verktyg.

Välj **Spara** och stäng detaljerna.

---

## Del 3: Be om en felbild

Välj plustecknet under startnoden och lägg till **Ställ en fråga**.

![Menyn under startnoden med valet Ställ en fråga](../../assets/standard-advanced/chap04/15.png)

Byt namn på noden till:

```text
Be om felbild
```

Skriv frågan:

```text
Ladda upp en tydlig bild där objekt-ID, eventuell felkod och det synliga felet framgår.
```

![Frågenoden Be om felbild med frågetexten](../../assets/standard-advanced/chap04/17.png)

### Lägg till två bildexempel

Välj **Lägg till** i frågans verktygsrad och sedan **Bild**.

![Menyn Lägg till med valet Bild](../../assets/standard-advanced/chap04/18.png)

För den tydliga bilden anger du titeln:

```text
Exempel på en tydlig bild
```

och adressen:

```text
https://tyto-official.github.io/copilot-studio-course/assets/standard-advanced/chap04/bra_exempel.png
```

![Egenskaperna för den tydliga exempelbilden](../../assets/standard-advanced/chap04/20.png)

Lägg till en bild till. Ange titeln:

```text
Exempel på en otydlig bild
```

och adressen:

```text
https://tyto-official.github.io/copilot-studio-course/assets/standard-advanced/chap04/daligt_exempel.png
```

![Egenskaperna för den otydliga exempelbilden](../../assets/standard-advanced/chap04/22.png)

Under **Identifiera** väljer du **Fil**. Sök på `Fil` om listan är lång.

![Panelen Välj information att identifiera med entiteten Fil](../../assets/standard-advanced/chap04/23.png)

Skapa sedan variabeln:

```text
FaultImage
```

Variabeltypen blir **file** automatiskt.

![Frågenoden sparar användarens fil i FaultImage](../../assets/standard-advanced/chap04/25.png)

Välj **Spara**.

---

## Del 4: Skapa prompten

Välj plustecknet under frågenoden. Gå till **Lägg till ett verktyg** och välj **Ny prompt**.

![Menyn Lägg till ett verktyg med valet Ny prompt](../../assets/standard-advanced/chap04/27.png)

Promptbyggaren öppnas med ett tillfälligt namn och en förvald modell.

![Promptbyggaren direkt efter att den har öppnats](../../assets/standard-advanced/chap04/28.png)

Byt namn på prompten till:

```text
Analysera felanmälan
```

![Prompten med namnet Analysera felanmälan](../../assets/standard-advanced/chap04/30.png)

Öppna modellistan och välj **GPT-5 reasoning**.

![Modellistan med GPT-5 reasoning](../../assets/standard-advanced/chap04/31.png)

Vilka modeller som visas kan skilja sig mellan miljöer. Välj en modell som kan analysera både text och bild. Skärmbilderna använder **GPT-5 reasoning**.

Menyn med tre punkter ligger till vänster om modellvalet. Där finns **Inställningar**.

![Menyn med tre punkter där Inställningar finns](../../assets/standard-advanced/chap04/32.png)

Där kan du bland annat ändra temperatur, innehållsmoderering och kodtolk. Vi behåller standardvärdena och låter kodtolken vara avstängd.

![Promptens inställningar med kodtolken avstängd](../../assets/standard-advanced/chap04/33.png)

### Lägg in instruktionerna

Klistra in följande text i instruktionerna:

```text
Du analyserar en intern felanmälan om utrustning i en produktionsmiljö.

Använd felbeskrivningen och bilden för att ta fram de efterfrågade uppgifterna. Använd bara information som uttryckligen står i texten eller tydligt syns i bilden.

Felbeskrivning:

[infoga Felbeskrivning]

Felbild:

[infoga Felbild]

Regler:

- assetIdCandidate ska innehålla ett möjligt objekt-ID i formatet LO-TT-NNN, exempelvis LO-PU-017 eller LO-VA-012.
- Läs objekt-ID från texten eller en tydligt synlig märkning i bilden.
- Returnera objekt-ID med versaler, även om användaren har skrivit det med gemener.
- Om inget objekt-ID med detta format kan hittas, returnera en tom sträng.
- Om texten och bilden visar olika objekt-ID, returnera en tom sträng.
- faultSummary ska vara en kort och saklig sammanfattning av det rapporterade och synliga felet.
- errorCode ska innehålla en felkod som uttryckligen står i texten eller tydligt syns i bilden. Returnera annars en tom sträng.
- impactLevel ska vara exakt ett av följande värden: Liten, Begränsad, Stoppad, Säkerhetsrisk eller Okänd.
- impactLevel beskriver den påverkan som användaren uttryckligen anger i felbeskrivningen.
- Dra inte slutsatser om påverkan enbart från bilden.
- Liten: användaren anger att felet inte påverkar driften eller säkerheten.
- Begränsad: användaren anger att utrustningen fortfarande fungerar men med nedsatt funktion.
- Stoppad: användaren anger att utrustningen inte kan användas eller står stilla.
- Säkerhetsrisk: användaren beskriver en konkret risk för människor.
- Okänd: användaren beskriver symptom men anger inte hur driften eller människor påverkas.
- Läckage, onormalt ljud, larm, felkod eller en grön indikator räcker inte för att avgöra påverkan.
- Sätt inte prioritet, kritikalitet, SLA eller rekommenderad åtgärd.
- Gissa inte vilken utrustning det gäller.
- Svara endast enligt det angivna JSON-formatet.
- Lägg inte svaret i ett JSON-kodblock.
```

De två raderna inom hakparenteser är platshållare. Vi ersätter dem med riktiga indatafält i nästa steg.

![Instruktionerna inklistrade med de två platshållarna](../../assets/standard-advanced/chap04/34.png)

### Skapa promptens indata

Markera raden `[infoga Felbeskrivning]` och skriv `/`. Välj **Text** i menyn.

![Menyn för att lägga till indata med valet Text](../../assets/standard-advanced/chap04/35.png)

Ge indatan namnet:

```text
Felbeskrivning
```

Fältet **Exempeldata** kan du lämna tomt. Det används bara när du testar prompten inifrån promptbyggaren.

![Textindatan Felbeskrivning med namn och exempeldata](../../assets/standard-advanced/chap04/36.png)

Markera sedan raden `[infoga Felbild]` och skriv `/`. Välj **Bild eller dokument**.

![Menyn för att lägga till indata med valet Bild eller dokument](../../assets/standard-advanced/chap04/37.png)

Ge indatan namnet:

```text
Felbild
```

![Dokumentindatan Felbild](../../assets/standard-advanced/chap04/38.png)

De två namnen visas nu som indatafält direkt i prompttexten.

![Prompten med indatafälten Felbeskrivning och Felbild](../../assets/standard-advanced/chap04/39.png)

---

## Del 5: Bestäm svarets JSON-format

Under **Modellsvar** öppnar du listan **Utdata** och väljer **JSON**.

![Listan Utdata med valet JSON](../../assets/standard-advanced/chap04/40.png)

Välj **Anpassa JSON** och klistra in exemplet:

```json
{
  "assetIdCandidate": "LO-KY-003",
  "faultSummary": "Objekt LO-KY-003 har kraftig isbildning på rör och värmeväxlare.",
  "errorCode": "E-18",
  "impactLevel": "Okänd"
}
```

![Det anpassade JSON-formatet för promptens svar](../../assets/standard-advanced/chap04/42.png)

Exemplet bestämmer fältnamn och datatyper. Värdena är bara exempel; prompten ska fylla dem med uppgifter från den aktuella felanmälan.

Välj **Använd** och sedan **Spara**.

![Den färdiga prompten med instruktioner, två indata och anpassat JSON-format](../../assets/standard-advanced/chap04/44.png)

---

!!! success "Ämnet kan nu analysera text och bild"
    Ämnet tar emot en felbeskrivning och en bild. Prompten returnerar objekt-ID, felsammanfattning, felkod och påverkan som ett strukturerat record. I nästa kapitel kopplar vi dessa värden till ämnets variabler och frågar bara efter det som saknas.
