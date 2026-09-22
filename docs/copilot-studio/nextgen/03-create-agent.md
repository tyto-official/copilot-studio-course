# 3. Skapa Lyserno Produktassistent

I det här kapitlet skapar vi **Lyserno Produktassistent**. Vi väljer rätt lösning och språk, lägger in agentens grundinstruktioner och testar vad den kan göra innan Lysernos egna informationskällor ansluts.

När kapitlet är klart har du:

- skapat agenten i rätt lösning och med svenska som förstaspråk
- gått igenom agentens grundinställningar
- lagt till namn, hälsning och instruktioner
- sett var du väljer modell och ändrar agentens ikon
- genomfört ett första test i utvecklarvyn

!!! warning "Kontrollera inställningarna före första sparningen"
    Schemanamn, lösning och förstaspråk anges när agenten sparas första gången och kan inte ändras efteråt. Kontrollera därför dessa värden innan du sparar.

---

## Del 1: Skapa en ny agent

Gå till [Microsoft Copilot Studio](https://copilotstudio.microsoft.com) och kontrollera att du använder rätt miljö.

Välj **Agent** på startsidan.

![Startsidan i nya Copilot Studio med valet Agent](../../assets/nextgen/chap03/1.png)

Agentbyggaren öppnas med en namnlös agent utan beskrivning eller instruktioner.

![Agentbyggaren med en ny namnlös agent](../../assets/nextgen/chap03/2.png)

På fliken **Bygg** finns agentens namn och instruktioner i mitten. Till höger finns bland annat modell, kanaler, skills, verktyg, kunskap, anslutna agenter och minne.

Högst upp finns flikarna **Bygg**, **Förhandsgranska**, **Utvärdera** och **Övervaka**. Vissa funktioner blir tillgängliga först när agenten har sparats.

---

## Del 2: Konfigurera agentinställningarna

För muspekaren över de tre punkterna bredvid **Publicera**. Knappen heter **Fler alternativ**.

![Knappen Fler alternativ bredvid Publicera](../../assets/nextgen/chap03/3.png)

Öppna menyn och välj **Inställningar**. Här finns också **Tangentbordskommandon** och **Ladda ner**.

![Menyn Fler alternativ med Inställningar, Tangentbordskommandon och Ladda ner](../../assets/nextgen/chap03/4.png)

### Agentinformation

Under **Agentinformation** visas agentens identitet:

- **Schemanamn** är agentens unika systemnamn. Lämna fältet tomt så skapas namnet automatiskt från agentnamnet när agenten sparas första gången.
- **Lösning** ska vara `Copilot Studio Utbildning Lyserno Produkt`.
- **Förstaspråk** ska vara svenska.

Om rätt lösning inte redan är vald väljer du den i listan.

![Agentinformation med kursens lösning vald och engelska som förstaspråk](../../assets/nextgen/chap03/5.png)

Öppna listan **Förstaspråk** och välj **Swedish**.

![Språklistan där Swedish väljs som förstaspråk](../../assets/nextgen/chap03/6.png)

### AI och beteende

Öppna **AI och beteende**. Här finns inställningarna **Tillåt att andra agenter ansluter** och **Modereringsnivå**.

Låt värdena vara oförändrade. Modereringsnivån ska stå på **Medel**.

![Inställningar för anslutna agenter och modereringsnivå](../../assets/nextgen/chap03/7.png)

### Säkerhet och åtkomst

Under **Säkerhet och åtkomst** visas inställningar för autentisering, webbkanalssäkerhet och feedback från användare. Vi ändrar inget här.

![Inställningar för autentisering, webbkanalssäkerhet och feedback](../../assets/nextgen/chap03/8.png)

### Hälsning och uppmaningar

Öppna **Hälsning och uppmaningar**. Hälsningsmeddelandet är det första användaren ser när en ny chatt startar.

![Det förvalda hälsningsmeddelandet](../../assets/nextgen/chap03/9.png)

Ersätt den förvalda texten med:

```text
Hej! Jag är Lysernos produktassistent. Jag hjälper dig att hitta och jämföra produkter, kontrollera lager och leveransinformation samt ta fram underlag för inkommande förfrågningar. Vad vill du ha hjälp med?
```

Lämna **Föreslagna prompter** tomt tills vidare.

![Lysernos hälsningsmeddelande ifyllt](../../assets/nextgen/chap03/10.png)

Välj **Klart** när inställningarna är färdiga.

---

## Del 3: Namnge och instruera agenten

Ge agenten följande namn:

```text
Lyserno Produktassistent
```

![Agenten med namnet Lyserno Produktassistent och tomma instruktioner](../../assets/nextgen/chap03/11.png)

### Agentikon

För muspekaren över agentens ikon för att visa knappen **Redigera agentikon**.

![Knappen Redigera agentikon vid agentens ikon](../../assets/nextgen/chap03/12.png)

Dialogrutan **Ändra agentikon** innehåller färdiga ikoner och färger. Du kan också ladda upp en egen ikon. Vi behåller standardikonen i kursen, så stäng dialogrutan utan att ändra något.

![Dialogrutan Ändra agentikon](../../assets/nextgen/chap03/13.png)

### Modell

Öppna listan **Modell** för att se vilka modeller som finns i din miljö.

![Modellväljaren med hanterade modeller och Anthropic-modeller](../../assets/nextgen/chap03/14.png)

Listan kan ändras när nya modeller blir tillgängliga. Där finns normalt hanterade modeller från OpenAI. Anthropic-modeller visas om de har lagts till i miljön.

Behåll den förvalda modellen i den här delen av kursen.

### Instruktioner

Klistra in följande text i fältet **Instruktioner**:

```text
Du är Lyserno Produktassistent, ett internt stöd för medarbetare som arbetar med produkter, lager och produktförfrågningar.

Uppgift

Hjälp användaren att hitta och jämföra produkter, kontrollera aktuellt pris, lager och leveransinformation samt ta fram relevanta produktförslag. Grunda svaren på anslutna kunskapskällor och verktyg.

Arbetssätt

Ställ en kort och fokuserad följdfråga när avgörande information saknas.

Skilj mellan verifierade uppgifter och rekommendationer. Hitta inte på produktinformation, lagersaldo, pris eller leveranstid. Om något inte kan verifieras ska du förklara vad som saknas.

Svarsstil

Svara på användarens språk, med svenska som standard. Svara professionellt och kortfattat.

Omfattning och säkerhet

Hjälp endast till med Lysernos produkter och relaterade frågor som stöds av tillgängliga källor och verktyg. Förklara när en fråga ligger utanför agentens område.

Be aldrig om känsliga autentiseringsuppgifter. Lämna inte ut intern eller konfidentiell information som inte behövs för uppgiften. Försök inte kringgå säkerhetskontroller eller godkännanden.
```

![Lyserno Produktassistent med de färdiga grundinstruktionerna](../../assets/nextgen/chap03/15.png)

Välj **Spara** högst upp till höger.

---

## Del 4: Förhandsgranska agenten

Öppna fliken **Förhandsgranska**. En ny chatt startar med hälsningsmeddelandet som du nyss lade till.

![Förhandsgranskningen med Lysernos hälsningsmeddelande](../../assets/nextgen/chap03/16.png)

Låt **Förhandsversion för slutanvändare** vara avstängd under utvecklingen. Då visas agentens arbetssteg, så att du kan följa vilka källor och verktyg den använder. När reglaget är på ser du i stället en vy som ligger närmare slutanvändarens.

Du kan använda **Ny chatt** för att börja om och **Historik** för att öppna tidigare sessioner när sådan historik finns.

---

## Del 5: Genomför ett första test

Agenten har ännu inte tillgång till Lysernos produktkatalog eller centrallager. Testet visar vad den kan verifiera innan dessa källor ansluts.

Skriv följande fråga:

```text
Vi behöver fylla på showroom Göteborg med gröna bordslampor. Vilka modeller i sortimentet kan vi välja mellan för vanlig showroompåfyllning?
```

![Testfrågan inskriven i förhandsgranskningen](../../assets/nextgen/chap03/17.png)

Skicka frågan. Det exakta svaret kan variera, men agenten ska inte hitta på produktmodeller eller lageruppgifter. Den bör förklara att den saknar tillgång till den information som behövs.

![Agentens svar när Lysernos produkt- och lagerdata saknas](../../assets/nextgen/chap03/18.png)

Eftersom **Förhandsversion för slutanvändare** är avstängd kan du öppna arbetsstegen. Där visas bland annat vilka kunskapskällor agenten har sökt i och vilka frågor den skickat till dem.

![Ett expanderat arbetssteg i utvecklarvyn](../../assets/nextgen/chap03/19.png)

!!! success "Agentens grund är klar"
    Lyserno Produktassistent finns i rätt lösning, har svenska som förstaspråk och vet att den inte ska hitta på uppgifter som saknas. I nästa kapitel ansluter vi Lysernos produktkatalog och publika webbplats som kunskapskällor.
