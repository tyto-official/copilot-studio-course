# 10. Koppla en underordnad agent

I det här kapitlet kopplar vi en underordnad agent till **Lyserno IT-assistent**. När ett nytt mejl kommer in lämnar huvudagenten över mejlet till **Mejlagent**. Mejlagent bedömer om mejlet gäller en enhetsbeställning eller ett supportärende och publicerar en sammanfattning i Teams.

Flödet blir:

1. Ett nytt mejl kommer till inkorgen.
2. E-postutlösaren skickar mejlet till Lyserno IT-assistent.
3. Huvudagenten lämnar över mejlet till Mejlagent.
4. Mejlagent sammanfattar mejlet och använder ett Teams-verktyg.
5. IT får sammanfattningen i en Teams-chatt.

## Del 1: Skapa e-postutlösaren

Gå till agentens **Översikt**. Under **Utlösare** klickar du på **Lägg till utlösare**.

![Lägg till en utlösare från agentens översikt](../../assets/standard/images-sv/chap10/1.png)

Sök efter:

```text
När ett nytt e-postmeddelande tas emot
```

Välj **När ett nytt e-postmeddelande tas emot (V3)** och klicka på **Nästa**.

![Välj utlösaren När ett nytt e-postmeddelande tas emot](../../assets/standard/images-sv/chap10/2.png)

Kontrollera att anslutningarna till Copilot Studio och Office 365 Outlook är klara. Klicka sedan på **Nästa**.

![Kontrollera utlösarens anslutningar](../../assets/standard/images-sv/chap10/3.png)

Öppna fältet **Mapp** och välj **Inkorg**. Om du använder flera inkorgar väljer du den som agenten ska bevaka.

![Välj Inkorg som mapp för e-postutlösaren](../../assets/standard/images-sv/chap10/4.png)

Låt de övriga filtren vara tomma. Då kan agenten ta emot både enhetsbeställningar och supportärenden. Klicka på **Skapa utlösare**.

![Skapa den konfigurerade e-postutlösaren](../../assets/standard/images-sv/chap10/5.png)

## Del 2: Skapa Mejlagent

När utlösaren har skapats visas den på agentens översikt. Scrolla ner till **Agenter** och klicka på **Lägg till agent**.

![Öppna området Agenter från översikten](../../assets/standard/images-sv/chap10/6.png)

Här kan du antingen välja en agent som redan finns i miljön eller skapa en ny underordnad agent. Välj **Ny underordnad agent**.

![Välj Ny underordnad agent](../../assets/standard/images-sv/chap10/7.png)

Ange följande namn:

```text
Mejlagent
```

Låt **När ska detta användas?** stå kvar på alternativet där agenten väljer baserat på beskrivningen.

Ange sedan följande beskrivning:

```text
Läser inkommande mejl, avgör om de gäller en enhetsbeställning eller ett supportärende och meddelar IT i Teams.
```

![Ange namn och beskrivning för Mejlagent](../../assets/standard/images-sv/chap10/8.png)

## Del 3: Lägg till Teams-verktyget

Scrolla ner till **Verktyg** i Mejlagent och klicka på **Lägg till**.

![Lägg till ett verktyg i Mejlagent](../../assets/standard/images-sv/chap10/9.png)

Sök efter:

```text
Publicera meddelande i en chatt eller en kanal
```

![Sök efter Teams-verktyget](../../assets/standard/images-sv/chap10/10.png)

Välj **Publicera meddelande i en chatt eller en kanal** under **Microsoft Teams**.

![Välj Teams-åtgärden Publicera meddelande i en chatt eller en kanal](../../assets/standard/images-sv/chap10/11.png)

Kontrollera Teams-anslutningen och klicka på **Lägg till och konfigurera**.

![Kontrollera anslutningen och lägg till Teams-verktyget](../../assets/standard/images-sv/chap10/12.png)

## Del 4: Konfigurera Teams-verktyget

Under **Detaljer** anger du följande namn:

```text
Meddela IT i Teams
```

Ange följande beskrivning:

```text
Publicerar en sammanfattning av ett inkommet mejl i IT-supportens Teams-chatt.
```

Klicka på **Spara** innan du går vidare till indatan.

![Ange namn och beskrivning för Teams-verktyget](../../assets/standard/images-sv/chap10/13.png)

Öppna **Indata**. Till en början visas fälten **Post as**, **Post in** och **Post message request**. Vilka fält som visas ändras när du gör dina val.

![Verktygets ursprungliga indatafält](../../assets/standard/images-sv/chap10/14.png)

Vid **Post as** klickar du på **Dynamisk ifyllning med AI** och väljer **Anpassat värde**.

![Ändra Post as till Anpassat värde](../../assets/standard/images-sv/chap10/15.png)

Välj sedan **Flow bot** som värde.

![Välj Flow bot för Post as](../../assets/standard/images-sv/chap10/16.png)

Ändra även **Post in** till **Anpassat värde** och välj **Chatta med en flowbot**.

![Välj Chatta med en flowbot för Post in](../../assets/standard/images-sv/chap10/17.png)

När de två valen är gjorda visas fältet **Recipient**. Ändra det till **Anpassat värde** och ange din egen e-postadress. Låt **Message** fyllas i dynamiskt med AI och klicka på **Anpassa**.

![Ange mottagare och öppna inställningarna för Message](../../assets/standard/images-sv/chap10/18.png)

Ange följande beskrivning för **Message**:

```text
Sammanfattning av mejlet: om det gäller en enhetsbeställning eller ett supportärende, vem som skrev och vad som efterfrågas.
```

Välj **Användarens hela svar** under **Identifiera som**. Stäng panelen och spara verktyget.

![Anpassa hur Message ska fyllas i](../../assets/standard/images-sv/chap10/19.png)

## Del 5: Ge Mejlagent instruktioner

Gå tillbaka till Mejlagents översikt. Klistra in följande under **Instruktioner**:

```text
Du är Lysernos mejlagent. Du hanterar inkommande mejl som huvudagenten skickar till dig.

1. Avgör om mejlet gäller en enhetsbeställning eller ett supportärende.
2. Plocka ut den information som IT behöver:
   - För en enhetsbeställning: önskad modell och vem som beställer.
   - För ett supportärende: vem som behöver hjälp och en beskrivning av felet.
3. Använd /Meddela IT i Teams för att publicera en kort sammanfattning i IT-supportens Teams-chatt.
```

![Lägg in instruktionerna i Mejlagent](../../assets/standard/images-sv/chap10/20.png)

Placera markören direkt efter `/Meddela IT i Teams`. Välj verktyget **Meddela IT i Teams** i listan som visas. Då ersätts den vanliga texten med en länk till verktyget.

![Välj Teams-verktyget i agentens instruktioner](../../assets/standard/images-sv/chap10/21.png)

Kontrollera att verktygets namn visas som ett länkat objekt och klicka på **Spara**.

![Kontrollera de färdiga instruktionerna och spara Mejlagent](../../assets/standard/images-sv/chap10/22.png)

## Del 6: Uppdatera huvudagentens instruktioner

Gå tillbaka till översikten för **Lyserno IT-assistent** och redigera agentens instruktioner. Lägg till följande punkt sist i instruktionerna:

```text
- För inkommande mejl som gäller enhetsbeställningar eller supportärenden, delegera till /Mejlagent och skicka med hela mejlets innehåll.
```

Placera markören direkt efter `/Mejlagent` och välj **Mejlagent** i listan.

![Lägg till Mejlagent i huvudagentens instruktioner](../../assets/standard/images-sv/chap10/23.png)

Kontrollera att **Mejlagent** visas som ett länkat objekt. Klicka sedan på **Spara**.

![Kontrollera den länkade agenten och spara instruktionerna](../../assets/standard/images-sv/chap10/24.png)

## Del 7: Testa hela kedjan

Börja i agentens testpanel och genomför en vanlig enhetsbeställning. Välj en enhet i det adaptiva kortet och skicka beställningen. Vänta tills mejlet med den nya enhetsförfrågan har kommit till inkorgen.

Gå sedan tillbaka till agentens **Översikt**. Klicka på testikonen vid utlösaren **När ett nytt e-postmeddelande tas emot (V3)**.

![Öppna testet för e-postutlösaren](../../assets/standard/images-sv/chap10/25.png)

Välj mejlet med enhetsförfrågan. Om det inte visas klickar du på uppdateringsikonen vid **Senast uppdaterad**. Klicka sedan på **Börja testa**.

![Välj det inkomna mejlet och starta testet](../../assets/standard/images-sv/chap10/26.png)

I testresultatet kan du följa hur huvudagenten lämnar över mejlet till **Mejlagent** och hur Mejlagent använder **Meddela IT i Teams**.

![Kontrollera att Mejlagent och Teams-verktyget har körts](../../assets/standard/images-sv/chap10/27.png)

Öppna Teams och kontrollera chatten med **Workflows**. Där ska det finnas ett meddelande som sammanfattar enhetsbeställningen.

!!! success "Klart"
    Du har nu kopplat ihop Outlook, huvudagenten, en underordnad agent och Teams. Ett inkommande mejl kan tas emot av huvudagenten, lämnas över till Mejlagent och sammanfattas i en Teams-chatt.
