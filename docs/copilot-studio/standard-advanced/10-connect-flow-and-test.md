# 10. Koppla flödet till ämnet och testa hela kedjan

Ämnet kan nu samla in användarens godkännande, och agentflödet kan skapa arbetsordern. I det här kapitlet kopplar vi ihop dem. Därefter visar ämnet resultatet, avslutar processen och vi testar hela vägen från felanmälan till arbetsorder och bekräftelsemejl.

När kapitlet är klart har du:

- lagt till **Skapa godkänd arbetsorder** i den godkända grenen
- kopplat ämnets indata till agentflödets indata
- byggt ett slutmeddelande med flödets utdata
- hanterat en saknad tekniker med ett Power Fx-uttryck
- avslutat alla ämnen efter en skapad arbetsorder
- uppdaterat agentens instruktioner
- verifierat resultatet i chatten, mejlet och T-Berg D&U

---

## Del 1: Lägg till det publicerade flödet

Gå tillbaka till ämnet **Granska och skapa arbetsorder**. Ställ dig vid plustecknet i den godkända grenen under villkoret **Kontrollera godkännande**.

Välj **Lägg till ett verktyg**. Det publicerade flödet **Skapa godkänd arbetsorder** ska visas i listan. Om det inte syns direkt kan du söka efter namnet.

Välj flödet. Nodens namn är redan rätt och ska inte ändras.

![Det publicerade flödet Skapa godkänd arbetsorder väljs i ämnets godkända gren](../../assets/standard-advanced/chap10/1.png)

---

## Del 2: Koppla ämnets indata till flödet

Flödet behöver sex värden. De första fem kommer från ämnets indatavariabler. Rapportörens namn hämtas från den inloggade användaren.

### Koppla assetId

Öppna variabelväljaren för `assetId`. Sök efter:

```text
assetId
```

Välj `assetId` under **Anpassad**. Fältet ska visa `Topic.assetId`.

![Indatan assetId kopplad till Topic assetId](../../assets/standard-advanced/chap10/2.png)

### Koppla title

Öppna variabelväljaren för `title`, sök efter följande värde och välj det under **Anpassad**:

```text
title
```

![Indatan title kopplad till Topic title](../../assets/standard-advanced/chap10/3.png)

### Koppla description

Öppna variabelväljaren för `description`, sök efter följande värde och välj det under **Anpassad**:

```text
description
```

![Indatan description kopplad till Topic description](../../assets/standard-advanced/chap10/4.png)

### Koppla priority

Öppna variabelväljaren för `priority`, sök efter följande värde och välj det under **Anpassad**:

```text
priority
```

![Indatan priority kopplad till Topic priority](../../assets/standard-advanced/chap10/5.png)

### Koppla technicianId

Öppna variabelväljaren för `technicianId`, sök efter följande värde och välj det under **Anpassad**:

```text
technicianId
```

![Indatan technicianId kopplad till Topic technicianId](../../assets/standard-advanced/chap10/6.png)

### Koppla reporterName

Öppna variabelväljaren för `reporterName` och gå till fliken **System**. Sök efter:

```text
user
```

Välj **User.DisplayName**. Fältet ska visa `System.User.DisplayName`.

![Indatan reporterName kopplad till System User DisplayName](../../assets/standard-advanced/chap10/7.png)

Kontrollera också att flödets utdata är kopplade till följande ämnesvariabler:

| Utdata från flödet | Ämnesvariabel |
|---|---|
| `workorderid` | `workOrderId` |
| `status` | `status` |
| `assetid` | `assetId` |
| `technicianname` | `technicianName` |
| `createdat` | `createdAt` |
| `description` | `description` |

Variablerna används efter flödesnoden. De ska vara ämnesspecifika, inte globala.

---

## Del 3: Lägg till meddelandet efter skapad arbetsorder

Ställ dig under flödesnoden och välj **Skicka ett meddelande**.

![Menyn under flödesnoden med valet Skicka ett meddelande](../../assets/standard-advanced/chap10/8.png)

Byt namn på noden till:

```text
Bekräfta skapad arbetsorder
```

Klistra in följande text i meddelandet:

```text
Arbetsordern har skapats.

Arbetsorder-ID: [workOrderId]
Objekt-ID: [assetId]
Status: [status]
Tekniker: [technicianName]
Skapad: [createdAt]

Ett bekräftelsemejl har skickats.
```

![Meddelandenoden med text och platshållare](../../assets/standard-advanced/chap10/9.png)

Markera de fem raderna från **Arbetsorder-ID** till **Skapad** och välj **Punktlista** i verktygsfältet.

![De fem resultatraderna markerade för att göras till en punktlista](../../assets/standard-advanced/chap10/10.png)

Kontrollera att endast resultatraderna ingår i punktlistan.

![Meddelandet med arbetsorderns resultat som punktlista](../../assets/standard-advanced/chap10/11.png)

---

## Del 4: Ersätt platshållarna med flödets utdata

Ta bort en platshållare i taget och låt markören stå kvar efter etiketten. Öppna variabelväljaren med **{x}**, sök efter variabeln och välj den under **Anpassad**.

### Arbetsorder-ID

Ersätt `[workOrderId]` med:

```text
workOrderId
```

Välj `Topic.workOrderId`.

![workOrderId väljs från ämnets variabler](../../assets/standard-advanced/chap10/12.png)

### Objekt-ID

Ersätt `[assetId]` med:

```text
assetId
```

Välj `Topic.assetId`.

![assetId väljs från ämnets variabler](../../assets/standard-advanced/chap10/13.png)

### Status

Ersätt `[status]` med:

```text
status
```

Välj `Topic.status`.

![status väljs från ämnets variabler](../../assets/standard-advanced/chap10/14.png)

### Tekniker

`technicianName` kan vara tomt när ingen tekniker har tilldelats. Ta bort `[technicianName]`, välj **fx** och klistra in följande formel:

```powerfx
If(
    IsBlank(Topic.technicianName),
    "Ej tilldelad",
    Topic.technicianName
)
```

Kontrollera den gröna bocken och välj **Infoga**.

![Power Fx-formeln som visar teknikern eller Ej tilldelad](../../assets/standard-advanced/chap10/15.png)

### Skapad

Ersätt `[createdAt]` med:

```text
createdAt
```

Välj `Topic.createdAt`.

![createdAt väljs från ämnets variabler](../../assets/standard-advanced/chap10/16.png)

!!! info "Varför kontrollerar vi technicianName?"
    Flödet kan skapa en arbetsorder med `technicianId` satt till `UNASSIGNED`. Då kan connectorn returnera ett tomt `technicianName`. Formeln visar **Ej tilldelad** i stället för en tom punkt i bekräftelsen.

---

## Del 5: Avsluta processen

Ställ dig under meddelandenoden. Välj **Ämneshantering** > **Avsluta alla ämnen**.

![Ämneshantering med valet Avsluta alla ämnen](../../assets/standard-advanced/chap10/17.png)

Processen ska sluta efter bekräftelsen. Då fortsätter inte agenten med ett extra genererat svar efter att arbetsordern har skapats.

Välj **Spara**.

---

## Del 6: Uppdatera agentens instruktioner

Gå tillbaka till agentens **Översikt** och öppna instruktionerna. Lägg in följande block efter avsnittet **Efter verifieringen** och före **Regler**:

```text
Skapa arbetsorder
När MCP-uppslagen är klara ska du använda /Granska och skapa arbetsorder. Fyll ämnets indata med det verifierade underlaget från MaintenanceContext och resultaten från MCP-verktygen.
```

Skriv snedstrecket och börja skriva ämnets namn. Välj **Granska och skapa arbetsorder** i förslagslistan så att texten blir en riktig ämnesreferens.

![Förslagslistan där ämnet Granska och skapa arbetsorder väljs](../../assets/standard-advanced/chap10/18.png)

Kontrollera att ämnet visas som en referens i instruktionen och välj **Spara**.

![Den uppdaterade instruktionen med en referens till ämnet](../../assets/standard-advanced/chap10/19.png)

---

## Del 7: Testa hela processen

Öppna testchatten och gör en fullständig felanmälan. Låt agenten verifiera objektet och genomföra MCP-uppslagen. När det adaptiva kortet visas väljer du **Godkänn och skapa**.

Efter en lyckad körning ska chatten visa:

- arbetsorder-ID
- objekt-ID
- status
- teknikerns namn eller **Ej tilldelad**
- tidpunkten då arbetsordern skapades
- att ett bekräftelsemejl har skickats

![Testchatten med godkännande och bekräftelsen på den skapade arbetsordern](../../assets/standard-advanced/chap10/20.png)

Öppna mejlet och kontrollera att arbetsorder-ID, objekt, status, prioritet, tekniker och beskrivning stämmer med underlaget i chatten.

![Bekräftelsemejlet för den skapade arbetsordern](../../assets/standard-advanced/chap10/21.png)

Öppna slutligen sidan **Arbetsorder** i T-Berg D&U. Kontrollera att samma arbetsorder finns där och att objekt, prioritet, tekniker och status stämmer.

![Den nya arbetsordern i T-Berg D&U](../../assets/standard-advanced/chap10/22.png)

---

!!! success "Hela kedjan fungerar"
    Agenten verifierar felanmälan, hämtar beslutsunderlag via MCP och lämnar uppgifterna till granskningsämnet. Arbetsordern skapas först efter användarens godkännande. Resultatet visas i chatten, skickas via mejl och sparas i T-Berg D&U.
