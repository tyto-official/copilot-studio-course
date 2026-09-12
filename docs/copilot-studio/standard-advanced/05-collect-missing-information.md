# 5. Samla in objekt och påverkan

Prompten är skapad, men ämnet använder ännu inte resultatet. Nu kopplar vi promptens in- och utdata, sparar objekt-ID och påverkan och ställer följdfrågor när något saknas.

När kapitlet är klart har du:

- kopplat ämnets felbeskrivning och bild till prompten
- sparat promptens svar i `FaultAnalysis`
- bett om ett objekt-ID när analysen inte hittar något
- validerat objekt-ID med en egen regex-entitet
- bett användaren välja påverkan när prompten returnerar `Okänd`

!!! info "Fortsätt spara efter varje nod"
    Välj **Spara** när du har fyllt i och namngett en nod. Gör samma sak efter varje villkor och frågenod.

---

## Del 1: Koppla promptens indata

När du stänger promptbyggaren ligger prompten som en ny nod i ämnet. Byt namn på noden till:

```text
Analysera felbeskrivning och bild
```

![Promptnoden innan in- och utdata har kopplats](../../assets/standard-advanced/chap05/46.png)

Koppla promptens indata så här:

| Promptens indata | Ämnets variabel |
|---|---|
| `Felbeskrivning` | `FaultDescription` |
| `Felbild` | `FaultImage` |

Öppna variabelväljaren för respektive fält och välj variabeln med samma innehåll. Noden visar ett felmeddelande tills båda är kopplade.

![Variabelväljaren öppen för promptens indata](../../assets/standard-advanced/chap05/47.png)

Under **Utdata** öppnar du variabelväljaren och väljer **Skapa en ny variabel**.

![Utdata med valet Skapa en ny variabel](../../assets/standard-advanced/chap05/49.png)

Variabeln får det tillfälliga namnet `Var1`. Typen är redan **record**, eftersom den härleds från promptens JSON-format.

![Variabelns egenskaper med det tillfälliga namnet Var1](../../assets/standard-advanced/chap05/50.png)

Byt namn på den till:

```text
FaultAnalysis
```

![Variabeln omdöpt till FaultAnalysis](../../assets/standard-advanced/chap05/51.png)

Välj **Spara**.

---

## Del 2: Spara objekt-ID från analysen

Lägg till **Variabelhantering** > **Ange ett variabelvärde** under promptnoden.

![Menyn Variabelhantering med valet Ange ett variabelvärde](../../assets/standard-advanced/chap05/52.png)

Byt namn på noden till:

```text
Sätt objekt-ID från analys
```

![Den tomma noden Sätt objekt-ID från analys](../../assets/standard-advanced/chap05/54.png)

Öppna **Ange variabel** och välj **Skapa en ny variabel**.

![Variabelväljaren med valet Skapa en ny variabel](../../assets/standard-advanced/chap05/55.png)

Ge variabeln namnet:

```text
AssetId
```

Typen står som **unknown** tills du har valt ett värde.

![Variabeln AssetId med typen unknown](../../assets/standard-advanced/chap05/58.png)

I **Till värde** väljer du:

```text
Topic.FaultAnalysis.structuredOutput.assetIdCandidate
```

!!! tip "Sök i stället för att bläddra"
    Skriv `assetIdCandidate` i sökrutan i variabelväljaren. Då slipper du öppna `FaultAnalysis` och leta dig ned genom varje nivå.

När värdet är valt blir `AssetId` automatiskt en sträng.

Välj **Spara**.

---

## Del 3: Fråga när objekt-ID saknas

Lägg till ett villkor under den färdiga noden.

![Den färdiga noden och menyn med valet Lägg till ett villkor](../../assets/standard-advanced/chap05/60.png)

Villkoret får två grenar.

![Den tomma villkorsgruppen med två grenar](../../assets/standard-advanced/chap05/61.png)

Byt namn på den vänstra grenen till:

```text
Kontrollera objekt-ID
```

Öppna variabelväljaren i grenen och välj `AssetId`.

![Variabelväljaren för villkoret](../../assets/standard-advanced/chap05/62.png)

Öppna operatorlistan och välj **är tom**.

![Operatorlistan med valet är tom](../../assets/standard-advanced/chap05/63.png)

Värdefältet försvinner, eftersom operatorn inte behöver något jämförelsevärde.

![Villkoret Kontrollera objekt-ID med operatorn är tom](../../assets/standard-advanced/chap05/64.png)

Den vänstra grenen körs bara när prompten inte hittade ett giltigt objekt-ID. **Alla övriga villkor** fortsätter utan någon fråga.

### Lägg till frågan

Under den vänstra grenen lägger du till **Ställ en fråga**. Byt namn på noden till:

```text
Be om objekt-ID
```

Noden är röd tills du har skrivit frågan. **Identifiera** står på **Flervalsalternativ** från början, och det ändrar vi strax.

![Den tomma frågenoden Be om objekt-ID](../../assets/standard-advanced/chap05/66.png)

Skriv frågan:

```text
Vilket objekt gäller det? Ange objekt-ID i formatet LO-TT-NNN, till exempel LO-PU-017.
```

![Frågenoden Be om objekt-ID](../../assets/standard-advanced/chap05/67.png)

### Skapa en entitet för objekt-ID

Öppna **Identifiera** och välj **Skapa en entitet** högst upp i panelen.

![Panelen Välj information att identifiera med valet Skapa en entitet](../../assets/standard-advanced/chap05/68.png)

Välj sedan **Reguljärt uttryck (Regex)**.

![Valet Reguljärt uttryck när en ny entitet skapas](../../assets/standard-advanced/chap05/69.png)

Ange namnet:

```text
Lyserno objekt-ID
```

Ange beskrivningen:

```text
Identifierar Lysernos objekt-ID i användarens svar. Ett objekt-ID består av prefixet LO, en tvåställig typkod och ett tresiffrigt löpnummer, till exempel LO-PU-017 eller LO-VA-012.
```

Ange mönstret:

```regex
(?i)\bLO-[A-Z]{2}-[0-9]{3}\b
```

![Entiteten Lyserno objekt-ID med beskrivning och regex](../../assets/standard-advanced/chap05/71.png)

Välj **Spara**. Tillbaka i frågenoden ska **Identifiera** visa `Lyserno objekt-ID`.

Under **Spara användarsvar som** väljer du den befintliga variabeln:

```text
AssetId
```

![Frågan identifierar Lyserno objekt-ID och sparar svaret som AssetId](../../assets/standard-advanced/chap05/75.png)

### Tvinga frågan att visas

Öppna nodens meny med tre punkter och välj **Egenskaper**. Öppna **Frågebeteende**. Ändra **Hoppa över fråga** från **Formel** till **Manuella indata** och välj **Fråga varenda gång**.

![Frågebeteendet med Manuella indata valt](../../assets/standard-advanced/chap05/76.png)

![Inställningen Fråga varenda gång](../../assets/standard-advanced/chap05/77.png)

Det kan verka överflödigt eftersom frågan redan ligger i grenen `AssetId är tom`. Inställningen hindrar frågenoden från att hoppa över sig själv när variabeln har initierats tidigare i ämnet.

Välj **Spara**.

---

## Del 4: Spara påverkan från analysen

Lägg till **Variabelhantering** > **Ange ett variabelvärde** efter att objekt-ID-grenarna har gått ihop. Välj plustecknet under sammanslagningen, inte inne i någon av grenarna.

![Menyn efter att grenarna har gått ihop](../../assets/standard-advanced/chap05/78.png)

Byt namn på noden till:

```text
Sätt påverkan från analys
```

Öppna **Ange variabel** och välj **Skapa en ny variabel**.

![Variabelväljaren med valet Skapa en ny variabel](../../assets/standard-advanced/chap05/80.png)

Ge variabeln namnet:

```text
ImpactLevel
```

![Variabeln ImpactLevel med typen unknown](../../assets/standard-advanced/chap05/81.png)

I **Till värde** väljer du:

```text
Topic.FaultAnalysis.structuredOutput.impactLevel
```

!!! tip "Sök även här"
    Skriv `impactLevel` i sökrutan i variabelväljaren. Välj fältet under `FaultAnalysis.structuredOutput`, inte någon variabel med ett liknande namn.

![Värdet impactLevel under FaultAnalysis structuredOutput](../../assets/standard-advanced/chap05/82.png)

Välj **Spara**.

Det här är samma mönster som i Del 2, med samma fyra steg. Skillnaden är bara vilket fält som hämtas ur analysen.

---

## Del 5: Fråga när påverkan är okänd

Lägg till ett villkor under den färdiga noden.

![Den färdiga noden och menyn med valet Lägg till ett villkor](../../assets/standard-advanced/chap05/83.png)

Byt namn på den vänstra grenen till:

```text
Kontrollera påverkan
```

Öppna variabelväljaren och välj `ImpactLevel`.

![Variabelväljaren med ImpactLevel](../../assets/standard-advanced/chap05/85.png)

Välj operatorn **är lika med** och skriv värdet:

```text
Okänd
```

![Villkoret Kontrollera påverkan när ImpactLevel är Okänd](../../assets/standard-advanced/chap05/86.png)

Under den vänstra grenen lägger du till **Ställ en fråga**.

![Menyn i grenen med valet Ställ en fråga](../../assets/standard-advanced/chap05/87.png)

Byt namn på noden till:

```text
Be om påverkan
```

Använd följande fråga:

```text
Vilken påverkan har felet på drift eller säkerhet?

- Liten: driften och säkerheten påverkas inte.
- Begränsad: utrustningen fungerar med nedsatt funktion.
- Stoppad: utrustningen kan inte användas.
- Säkerhetsrisk: felet innebär en konkret risk för människor.
```

![Frågetexten inskriven i noden](../../assets/standard-advanced/chap05/88.png)

Förklaringarna i frågan är till för användaren. Prompten har redan samma definitioner i sina regler, så den som svarar och den som analyserar utgår från samma beskrivning.

Behåll **Flervalsalternativ**. Välj **Nytt alternativ** och skriv:

```text
Liten
```

![Det första alternativet Liten](../../assets/standard-advanced/chap05/89.png)

Lägg till de tre återstående på samma sätt:

```text
Begränsad
```

```text
Stoppad
```

```text
Säkerhetsrisk
```

![Alla fyra alternativen i frågenoden](../../assets/standard-advanced/chap05/90.png)

Alternativen måste stavas exakt som promptens värden. Skriver du `Stoppat` i stället för `Stoppad` matchar villkoret i nästa kapitel inte längre.

Skapa sedan variabeln för användarens val:

```text
ImpactChoice
```

Typen blir **choice**, eftersom den härleds från flervalsfrågan.

![Frågan med fyra alternativ och svaret sparat som ImpactChoice](../../assets/standard-advanced/chap05/91.png)

### Ta bort de villkor som skapades automatiskt

Copilot Studio lägger själv till en villkorsgren per alternativ när du skapar en flervalsfråga. De ligger direkt under frågan och vi använder dem inte, eftersom påverkan hanteras av en enda variabel.

Öppna de tre punkterna på varje villkorsnod och välj **Ta bort**. Ta även bort **Alla övriga villkor** som hör till dem.

![Villkorsnoderna som skapades automatiskt, med menyvalet Ta bort](../../assets/standard-advanced/chap05/92.png)

Välj **Spara**.

### Skriv tillbaka valet till ImpactLevel

Lägg till **Variabelhantering** > **Ange ett variabelvärde** direkt under frågan, fortfarande i grenen `Kontrollera påverkan`.

![Menyn under frågan med valet Ange ett variabelvärde](../../assets/standard-advanced/chap05/93.png)

Byt namn på noden till:

```text
Sätt vald påverkan
```

![Den tomma noden Sätt vald påverkan](../../assets/standard-advanced/chap05/94.png)

Öppna **Ange variabel** och sök på `ImpactLevel`. Välj variabeln `Topic.ImpactLevel`, inte fältet `FaultAnalysis.structuredOutput.impactLevel`. Vi skriver till ämnets arbetsvärde, inte tillbaka in i promptens svar.

![Variabelväljaren med ImpactLevel och promptens fält bredvid varandra](../../assets/standard-advanced/chap05/95.png)

Öppna **Till värde**, gå till fliken **Formel** och ange:

```powerfx
Text(Topic.ImpactChoice)
```

![Formelrutan med Text av ImpactChoice och utdata godkänd](../../assets/standard-advanced/chap05/96.png)

`ImpactChoice` är ett valobjekt. `Text` gör om det valda alternativet till samma strängformat som prompten använder. **Utdata** i rutan visar grön bock när formeln är giltig.

Välj **Infoga** och sedan **Spara**.

---

## Vad ämnet gör nu

Ämnet har två likadana kontrollmönster:

1. Använd promptens värde.
2. Kontrollera om värdet saknas eller är okänt.
3. Fråga användaren bara när det behövs.
4. Fortsätt med ett enhetligt strängvärde efter att grenarna har gått ihop.

Det gör att nästa steg kan använda `AssetId` och `ImpactLevel` utan att veta om värdet kom från prompten eller en följdfråga.

---

!!! success "Underlaget är redo att verifieras"
    Ämnet har nu ett objekt-ID i rätt format och ett värde för påverkan. I nästa kapitel skapar vi anslutningen till T-Berg DU och verifierar objektet mot underhållssystemet.
