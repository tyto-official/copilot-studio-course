# 9. Skapa arbetsorder med ett agentflöde

I föregående kapitel skapade vi godkännandet och valde **Nytt agentflöde** i den godkända grenen. Nu bygger vi flödet som skriver arbetsordern till T-Berg D&U, skickar ett bekräftelsemejl och returnerar den skapade arbetsorderns uppgifter.

När kapitlet är klart har du:

- byggt agentflödet **Skapa godkänd arbetsorder**
- kopplat flödets indata till åtgärden `Skapa arbetsorder` i T-Berg DU API
- skickat ett bekräftelsemejl med resultatet från connectorn
- returnerat arbetsorderns uppgifter till agenten
- namngett och publicerat flödet

!!! info "Spara med jämna mellanrum"
    Välj **Spara utkast** när en större del av flödet är klar. Publicera först när alla indata, åtgärder och utdata är konfigurerade.

---

## Del 1: Lägg till flödets indata

Det nya agentflödet öppnas i designern med utlösaren **När en agent anropar flödet** och svarsnoden **Respond to the agent**. Öppna utlösaren och välj **Lägg till indata**.

![Det nya agentflödet med Lägg till indata](../../assets/standard-advanced/chap09/3.png)

Välj typen **Text**.

![Menyn med Text som typ av indata](../../assets/standard-advanced/chap09/4.png)

Skapa först `assetId` och ange beskrivningen nedan.

Namn:

```text
assetId
```

Beskrivning:

```text
Verifierat objekt-ID från MaintenanceContext. Värdet får inte gissas eller ändras.
```

![Indatan assetId med beskrivning](../../assets/standard-advanced/chap09/5.png)

Lägg sedan till fem textfält till. Använd exakt följande namn och beskrivningar.

### title

Namn:

```text
title
```

Beskrivning:

```text
Kort rubrik som sammanfattar faultSummary utan att lägga till nya uppgifter.
```

### description

Namn:

```text
description
```

Beskrivning:

```text
Sammanfattning av felet. Ta med felkod, relevant felhistorik och resultatet från reservdelskontrollen när det finns. Texten sparas på arbetsordern och används i bekräftelsemejlet. Lägg inte till obekräftade uppgifter.
```

### priority

Namn:

```text
priority
```

Beskrivning:

```text
Prioritet P1–P4 från MaintenanceContext. Värdet får inte räknas om.
```

### technicianId

Namn:

```text
technicianId
```

Beskrivning:

```text
Använd technicianId från find_available_technicians oförändrat. Värdet är ett tekniker-ID eller UNASSIGNED. Fältet får aldrig lämnas tomt.
```

### reporterName

Namn:

```text
reporterName
```

Beskrivning:

```text
Namnet på användaren som bekräftade underlaget. Fylls med System.User.DisplayName när flödet läggs till i ämnet.
```

Kontrollera att utlösaren innehåller sex indata och att alla har typen **Text**.

![Utlösaren med flödets sex indata](../../assets/standard-advanced/chap09/6.png)

---

## Del 2: Lägg till connectorns skrivåtgärd

Välj plustecknet under utlösaren för att lägga till en åtgärd.

![Menyn för att lägga till en åtgärd under utlösaren](../../assets/standard-advanced/chap09/7.png)

Sök efter:

```text
Skapa arbetsorder
```

Byt från **Alla** till **Anpassad**.

![Sökningen efter Skapa arbetsorder](../../assets/standard-advanced/chap09/8.png)

Under `T-Berg DU API` väljer du åtgärden **Skapa arbetsorder**.

![Den anpassade åtgärden Skapa arbetsorder från T-Berg DU API](../../assets/standard-advanced/chap09/9.png)

---

## Del 3: Koppla indata till arbetsordern

Connectorn behöver fem värden. Samtliga ska komma från utlösaren.

### Koppla assetId

Ställ dig i `body/assetId`, välj **fx** och öppna **Dynamiskt innehåll**. Sök efter:

```text
assetId
```

Välj `assetId` under **När en agent anropar flödet** och välj **Lägg till**.

![Dynamiskt innehåll för body assetId](../../assets/standard-advanced/chap09/10.png)

### Koppla title

Gör på samma sätt i `body/title`. Sök efter och välj:

```text
title
```

![Dynamiskt innehåll för body title](../../assets/standard-advanced/chap09/11.png)

### Koppla description

I `body/description` söker du efter och väljer:

```text
description
```

![Dynamiskt innehåll för body description](../../assets/standard-advanced/chap09/12.png)

### Koppla priority

Öppna listan i `body/priority`. I stället för att välja `P1`, `P2`, `P3` eller `P4` väljer du **Ange anpassat värde**.

![Prioritetsfältet med valet Ange anpassat värde](../../assets/standard-advanced/chap09/13.png)

Välj **fx**, öppna **Dynamiskt innehåll** och sök efter:

```text
priority
```

Välj `priority` från utlösaren och välj **Lägg till**.

![Dynamiskt innehåll för body priority](../../assets/standard-advanced/chap09/14.png)

### Koppla technicianId

I `body/technicianId` söker du efter och väljer:

```text
technicianId
```

![Dynamiskt innehåll för body technicianId](../../assets/standard-advanced/chap09/15.png)

`technicianId` ska alltid innehålla det värde som MCP-verktyget returnerade. Det kan vara ett riktigt tekniker-ID eller `UNASSIGNED`, men aldrig en tom sträng.

---

## Del 4: Lägg till bekräftelsemejlet

Välj plustecknet under `Skapa arbetsorder`.

![Menyn för att lägga till nästa åtgärd](../../assets/standard-advanced/chap09/16.png)

Sök efter:

```text
Skicka e-postmeddelande (V2)
```

Välj åtgärden från **Office 365 Outlook**.

![Office 365 Outlook-åtgärden Skicka e-postmeddelande V2](../../assets/standard-advanced/chap09/17.png)

Öppna nodens meny med de tre punkterna och välj **Byt namn**.

![Menyn för att byta namn på e-poståtgärden](../../assets/standard-advanced/chap09/18.png)

Ange nodnamnet:

```text
Skicka bekräftelsemejl
```

---

## Del 5: Ange mottagare och ämnesrad

I fältet **Till** anger du din egen e-postadress.

Ämnesraden ska byggas av vanlig text och två dynamiska värden:

```text
Arbetsorder [workOrderId] skapad för [assetId]
```

Skriv först `Arbetsorder `, välj **fx** och öppna **Dynamiskt innehåll**. Sök efter:

```text
workOrderId
```

Välj `workOrderId` under **Skapa arbetsorder**. Kontrollera att uttrycket visas i rutan och välj **Lägg till**.

![workOrderId läggs till i mejlets ämnesrad](../../assets/standard-advanced/chap09/19.png)

Skriv sedan ` skapad för `, öppna **fx** och sök efter:

```text
assetId
```

Välj `assetId` under **Skapa arbetsorder**, kontrollera uttrycket och välj **Lägg till**.

![assetId från Skapa arbetsorder läggs till i ämnesraden](../../assets/standard-advanced/chap09/20.png)

Välj inte `assetId` från utlösaren i det här steget. Mejlet ska använda det värde som connectorn returnerade efter att arbetsordern skapades.

---

## Del 6: Bygg mejlets innehåll

Klistra först in följande text i mejlets brödtext:

```text
Hej,

Arbetsorder [workOrderId] har skapats i T-Berg D&U.

Objekt: [assetId]
Status: [status]
Prioritet: [priority]
Ansvarig tekniker: [technicianName eller Ej tilldelad]

Beskrivning:
[description]

Rapporterad av: [reporterName]
```

![Mejlmallen med platshållare](../../assets/standard-advanced/chap09/21.png)

Ta bort en platshållare i taget och låt markören stå kvar på samma plats. Välj **fx** längst till höger och öppna **Dynamiskt innehåll**. Du kan också skriva `/` i mejltexten och välja **fx** i snabbmenyn.

Sök efter värdet, välj det under rätt nod och kontrollera att uttrycket visas i rutan högst upp. Välj sedan **Lägg till**. Upprepa detta för varje platshållare.

### Arbetsorder-ID

Ta bort `[workOrderId]`, öppna **fx** och **Dynamiskt innehåll** och sök efter:

```text
workOrderId
```

Välj `workOrderId` under **Skapa arbetsorder**. När uttrycket visas i rutan väljer du **Lägg till**.

![workOrderId infogat i mejltexten](../../assets/standard-advanced/chap09/22.png)

### Objekt-ID

Ta bort `[assetId]` och sök efter:

```text
assetId
```

Välj `assetId` under **Skapa arbetsorder**, kontrollera uttrycket och välj **Lägg till**. Välj inte värdet med samma namn under **När en agent anropar flödet**.

![assetId infogat i mejltexten](../../assets/standard-advanced/chap09/23.png)

### Status

Ta bort `[status]` och sök efter:

```text
status
```

Välj `status` under **Skapa arbetsorder**, kontrollera uttrycket och välj **Lägg till**.

![status infogat i mejltexten](../../assets/standard-advanced/chap09/24.png)

### Prioritet

Ta bort `[priority]` och sök efter:

```text
priority
```

Välj `priority` under **Skapa arbetsorder**, kontrollera uttrycket och välj **Lägg till**.

![priority infogat i mejltexten](../../assets/standard-advanced/chap09/25.png)

### Ansvarig tekniker

`technicianName` kan vara tomt när MCP-verktyget returnerade `UNASSIGNED`. Ta bort hela platshållaren `[technicianName eller Ej tilldelad]`, öppna **fx** och välj **Funktion**. Klistra in följande uttryck:

```text
if(
    empty(outputs('Skapa_arbetsorder')?['body/technicianName']),
    'Ej tilldelad',
    outputs('Skapa_arbetsorder')?['body/technicianName']
)
```

Kontrollera att uttrycket visas utan fel och välj **Lägg till**.

![Uttrycket som visar teknikern eller Ej tilldelad](../../assets/standard-advanced/chap09/26.png)

### Beskrivning

Ta bort `[description]` och sök efter:

```text
description
```

Välj `description` under **Skapa arbetsorder**, kontrollera uttrycket och välj **Lägg till**.

![description infogat i mejltexten](../../assets/standard-advanced/chap09/27.png)

### Rapporterad av

Ta bort `[reporterName]` och sök efter:

```text
reporterName
```

Välj `reporterName` under **När en agent anropar flödet**, kontrollera uttrycket och välj **Lägg till**.

![reporterName från utlösaren infogat i mejltexten](../../assets/standard-advanced/chap09/28.png)

---

## Del 7: Returnera resultatet till agenten

Öppna den sista noden, **Respond to the agent**, och välj **Lägg till utdata**.

![Svarsnoden med valet Lägg till utdata](../../assets/standard-advanced/chap09/29.png)

Välj typen **Text**.

![Menyn med Text som typ av utdata](../../assets/standard-advanced/chap09/30.png)

Skapa sex utdata. För varje utdata anger du namn och beskrivning. Under **Värde** öppnar du **fx** längst till höger och går till **Dynamiskt innehåll**. Kopiera värdet från rutan i instruktionen, sök efter det och välj träffen under **Skapa arbetsorder**. Kontrollera att uttrycket visas högst upp och välj **Lägg till**.

### workOrderId

Namn:

```text
workOrderId
```

Beskrivning:

```text
ID för den skapade arbetsordern.
```

Värde:

```text
workOrderId
```

Välj `workOrderId` under **Skapa arbetsorder**, kontrollera uttrycket och välj **Lägg till**.

![Utdatan workOrderId med dynamiskt värde](../../assets/standard-advanced/chap09/31.png)

### status

Namn:

```text
status
```

Beskrivning:

```text
Arbetsorderns status efter att den skapades.
```

Värde:

```text
status
```

Välj `status` under **Skapa arbetsorder**, kontrollera uttrycket och välj **Lägg till**.

![Utdatan status med dynamiskt värde](../../assets/standard-advanced/chap09/32.png)

### assetId

Namn:

```text
assetId
```

Beskrivning:

```text
Objekt-ID som arbetsordern skapades för.
```

Värde:

```text
assetId
```

Välj `assetId` under **Skapa arbetsorder**, kontrollera uttrycket och välj **Lägg till**.

![Utdatan assetId med dynamiskt värde](../../assets/standard-advanced/chap09/33.png)

### technicianName

Namn:

```text
technicianName
```

Beskrivning:

```text
Namnet på den tilldelade teknikern. Värdet kan vara tomt när ordern väntar på tilldelning.
```

Värde:

```text
technicianName
```

Välj `technicianName` under **Skapa arbetsorder**, kontrollera uttrycket och välj **Lägg till**.

![Utdatan technicianName med dynamiskt värde](../../assets/standard-advanced/chap09/34.png)

### createdAt

Namn:

```text
createdAt
```

Beskrivning:

```text
Tidpunkten då arbetsordern skapades.
```

Värde:

```text
createdAt
```

Välj `createdAt` under **Skapa arbetsorder**, kontrollera uttrycket och välj **Lägg till**.

![Utdatan createdAt med dynamiskt värde](../../assets/standard-advanced/chap09/35.png)

### description

Namn:

```text
description
```

Beskrivning:

```text
Beskrivningen som sparades på arbetsordern.
```

Värde:

```text
description
```

Välj `description` under **Skapa arbetsorder**, kontrollera uttrycket och välj **Lägg till**.

![Utdatan description med dynamiskt värde](../../assets/standard-advanced/chap09/36.png)

Välj **Spara utkast**.

---

## Del 8: Namnge och publicera flödet

Efter den första sparningen öppnar du flödets **Översikt** och väljer **Redigera** under **Information**.

![Agentflödets översikt med information och anslutningar](../../assets/standard-advanced/chap09/37.png)

Ange följande namn:

```text
Skapa godkänd arbetsorder
```

Beskrivning:

```text
Skapar en arbetsorder i T-Berg D&U, skickar ett bekräftelsemejl och returnerar den skapade arbetsorderns uppgifter till ämnet Granska och skapa arbetsorder.
```

Under **Planera** väljer du **Copilot Studio** om valet är tillgängligt. Välj sedan **Spara**.

![Flödets namn, beskrivning och Copilot Studio-plan](../../assets/standard-advanced/chap09/38.png)

Gå tillbaka till **Designer**. Kontrollera att flödet innehåller följande fyra noder:

1. `När en agent anropar flödet`
2. `Skapa arbetsorder`
3. `Skicka bekräftelsemejl`
4. `Respond to the agent`

Välj **Spara utkast** igen och sedan **Publicera**.

![Det färdiga agentflödet i designern](../../assets/standard-advanced/chap09/39.png)

---

!!! success "Agentflödet är publicerat"
    Flödet tar emot arbetsorderunderlaget, skapar arbetsordern, skickar bekräftelsemejlet och returnerar resultatet. I nästa kapitel kopplar vi det publicerade flödet till den godkända grenen i ämnet.
