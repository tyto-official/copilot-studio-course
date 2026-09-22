# 6. Skapa agentens första skill

Lyserno Produktassistent kan nu kombinera produktkatalogen, showroominformationen på webbplatsen och aktuella poster från Centrallager. Arbetssättet fungerar, men de detaljerade reglerna ligger fortfarande i agentens globala instruktioner och följer därför med i varje samtal.

I det här kapitlet flyttar vi showroomprocessen till en egen skill. I Copilot Studios gränssnitt visas skills under **Färdigheter**.

När kapitlet är klart har du:

- sett hur en skill kan laddas upp eller skapas från början
- förstått hur namn, beskrivning och instruktioner används
- skapat `showroom-pafyllning` direkt i Copilot Studio
- tagit bort den dubblerade processen från agentens globala instruktioner
- testat att agenten aktiverar skillen och sammanfattar användarens val

!!! info "En skill laddas när den behövs"
    Agentens globala instruktioner gäller i varje samtal. En skill innehåller ett avgränsat arbetssätt som laddas när användarens uppgift matchar skillens beskrivning. Det ger mer plats åt den information som är relevant för den aktuella uppgiften.

---

## Del 1: Öppna Färdigheter

Gå till fliken **Bygg** för Lyserno Produktassistent. Välj plustecknet vid **Färdigheter** i panelen till höger.

![Färdigheter i agentens högra panel](../../assets/nextgen/chap06/1.png)

---

## Del 2: Välj hur skillen ska skapas

Dialogrutan **Lägg till färdighet** öppnas. Här finns två sätt att fortsätta:

- **Ladda upp en färdighet** används för en befintlig `SKILL.md` eller ett ZIP-paket som innehåller `SKILL.md` i paketets rot.
- **Skapa från början** används när namn, beskrivning och instruktioner ska skrivas direkt i Copilot Studio.

En uppladdad `SKILL.md` måste innehålla skillens namn och beskrivning i YAML-format. Ett ZIP-paket kan även innehålla referenser, mallar, skript eller andra filer som skillen behöver.

![Lägg till färdighet med alternativen Ladda upp en färdighet och Skapa från början](../../assets/nextgen/chap06/2.png)

I den här övningen väljer du **Skapa från början**.

---

## Del 3: Förstå skillens tre fält

Formuläret innehåller tre obligatoriska fält.

### Namn

Namnet identifierar skillen. Det får vara högst 64 tecken och ska vara kort, tydligt och stabilt. Använd gemener och bindestreck när flera ord behöver skiljas åt.

### Beskrivning

Beskrivningen talar om vad skillen gör och när den ska användas. Den får vara högst 1 024 tecken. Ta med ord och formuleringar som gör uppgiften lätt att känna igen, men håll beskrivningen avgränsad så att skillen inte aktiveras för närliggande uppgifter.

### Instruktioner

Instruktionerna beskriver hur uppgiften ska utföras när skillen har aktiverats. De kan innehålla arbetssteg, datakällor, verktyg, villkor, begränsningar och svarsformat.

![Skapa från början med tomma fält för namn, beskrivning och instruktioner](../../assets/nextgen/chap06/3.png)

Agent Skills rekommenderar att en skill bygger på verkliga arbetsuppgifter och projektspecifik erfarenhet. Lägg främst till sådant som agenten inte rimligen känner till utan skillen: interna fältnamn, verksamhetsregler, särskilda datakällor och den ordning som uppgiften ska följa. Undvik generella förklaringar av sådant modellen redan kan.

Håll skillen sammanhängande och lagom detaljerad. Beskriv ett återanvändbart arbetssätt i stället för ett svar på en enskild fråga. Testa sedan skillen med riktiga exempel och justera sådant som aktiveras för brett, missas eller leder till onödiga steg.

Läs mer i [Best practices for skill creators](https://agentskills.io/skill-creation/best-practices).

---

## Del 4: Skapa showroom-pafyllning

Fyll i följande värden.

### Namn

```text
showroom-pafyllning
```

### Beskrivning

```text
Använd när en medarbetare vill hitta produkter eller ta fram ett underlag för showroompåfyllning. Identifiera showroomet, matcha behovet mot produktkatalogen, kontrollera aktuella produkter i Centrallager och hjälp användaren att välja produkt och antal. Använd inte skillen för allmänna produktfrågor utan koppling till showroompåfyllning.
```

Beskrivningen innehåller både uppgiften och när skillen ska användas. Den sista meningen avgränsar skillen från allmänna produktfrågor, som kan innehålla samma produktord men inte handlar om showroompåfyllning.

### Instruktioner

Ersätt exempeltexten i fältet **Instruktioner** med följande innehåll:

```markdown
# Showroompåfyllning

## 1. Identifiera showroomet

Använd Lysernos publika webbplats som primär källa för att verifiera showroomets namn, typ, land, region, adress och öppettider. Fråga inte efter uppgifter som redan kan verifieras.

Om flera showroom matchar användarens beskrivning och rätt showroom inte kan identifieras ska du ställa en kort följdfråga.

## 2. Matcha produktbehovet

Matcha behovet mot Lyserno Lighting Collection 2026. Kontrollera sedan matchande modeller och varianter med Hämta produkter från Centrallager.

Verktygets fält:

Title = produktnamn
field_1 = SKU
field_2 = ProductModelID
field_3.Value = Variant
field_4 = ImageSource
field_5 = CurrentUnitPrice
field_6 = OnHandQuantity
field_7 = ReservedQuantity
field_8 = IncomingQuantity
field_9 = NextRestockDate
field_10.Value = SalesStatus
field_11.Value = ReplenishmentCode
ID = SharePoint Item ID

Matcha med ProductModelID och Variant. SKU identifierar produktvarianten.

## 3. Kontrollera lager och villkor

Disponibelt saldo = OnHandQuantity − ReservedQuantity.

Inkommande antal räknas inte som disponibelt. Redovisa inkommande antal och påfyllnadsdatum separat när det är relevant, utan att lova leverans det datumet.

Regler för vanlig showroompåfyllning:

- Available och RC10: får väljas om disponibelt saldo räcker.
- RC90: får inte beställas genom vanlig showroompåfyllning, oavsett SalesStatus och saldo.
- Blocked: får inte beställas, oavsett ReplenishmentCode och saldo.
- Backorder: är inte omedelbart tillgänglig.
- Saknad eller okänd status eller kod: får inte tolkas som tillåten.

Om antalet saknas får tillåtna produkter med positivt saldo visas, men bekräfta inte att saldot räcker för användarens behov.

## 4. Presentera produkterna

Visa alla tydliga produktmatchningar, inte bara huvudrekommendationen.

Presentera valbara produkter i en tabell med endast följande kolumner:

| Val | Produkt och användning | Pris/st | Disponibelt | Bild |
| --- | ---------------------- | ------- | ----------- | ---- |

Ange produktens namn, variant och en kort motivering under Produkt och användning.

Visa spärrade produkter och produkter med otillräckligt saldo separat med en kort förklaring.

Visa styckpriser i SEK, exempelvis 1 995 kr/st, och datum i svensk tidszon.

Använd ImageSource för små miniatyrbilder, cirka 80–120 pixlar breda. Visa en bildlänk om små bilder inte stöds. Ändra inte bildadressen. Utelämna bilden om adressen saknas.

Vid flera valbara produkter ska du märka dem A, B och så vidare. Koppla varje bokstav till rätt SKU och SharePoint Item ID utan att visa ID:t.

Vid endast en valbar produkt ska du inte använda någon bokstav.

## 5. Be om de uppgifter som saknas

När produkterna har presenterats ska du i samma meddelande fråga efter:

- vilket alternativ användaren vill gå vidare med, om flera produkter är valbara
- om användaren vill gå vidare med produkten, om endast en produkt är valbar
- önskat antal
- showroomets namn, typ eller land, om någon av uppgifterna fortfarande inte har kunnat verifieras

Fråga inte på nytt efter information som redan finns i samtalet eller har verifierats med Lysernos publika webbplats.

## 6. Kontrollera och sammanfatta

När användaren har valt produkt och angett antal ska du kontrollera om det aktuella disponibla saldot räcker.

Sammanfatta:

- showroom
- produkt
- SKU
- antal
- styckpris
- aktuellt disponibelt saldo
- om saldot räcker för det önskade antalet

Påstå inte att en beställning eller reservation har skapats.
```

Kontrollera fälten och välj **Skapa**.

![Showroom-pafyllning med namn, beskrivning och instruktioner](../../assets/nextgen/chap06/4.png)

---

## Del 5: Kontrollera att skillen har lagts till

När skillen har skapats visas `showroom-pafyllning` under **Färdigheter** i agentens högra panel.

![Showroom-pafyllning visas under Färdigheter](../../assets/nextgen/chap06/5.png)

Skillen kan nu aktiveras tillsammans med agentens befintliga kunskapskällor och verktyg. Källorna och verktygen måste vara anslutna till agenten, vilket vi gjorde i kapitel 4 och 5.

---

## Del 6: Förenkla agentens instruktioner

Arbetssättet för showroompåfyllning finns nu i skillen och ska inte ligga kvar i agentens globala instruktioner.

Öppna agentens instruktioner och ta bort:

1. de två stycken om Lysernos publika webbplats som lades till i kapitel 4
2. hela avsnittet **Showroompåfyllning** som lades till i kapitel 5, från rubriken till och med meningen om att ingen beställning eller reservation har skapats

Behåll de generella reglerna från kapitel 3. Lägg sedan till följande sist under **Arbetssätt**, direkt före **Svarsstil**:

```text
Showroompåfyllning

För förfrågningar om showroompåfyllning ska du använda skillen showroom-pafyllning.
```

Välj **Spara**.

![De globala instruktionerna har ersatt showroomprocessen med en hänvisning till skillen](../../assets/nextgen/chap06/6.png)

Agentens identitet, allmänna arbetssätt, svarsstil och säkerhetsregler ligger kvar globalt. De projektspecifika stegen för showroompåfyllning laddas nu bara när skillen används.

---

## Del 7: Testa skillen

Öppna **Förhandsgranska**, starta en ny chatt och ställ samma fråga som i föregående kapitel:

```text
Vi behöver fylla på showroom Göteborg med gröna bordslampor. Vilka modeller i sortimentet kan vi välja mellan för vanlig showroompåfyllning?
```

Låt **Förhandsversion för slutanvändare** vara avstängd så att agentens arbetssteg visas.

Öppna steget **Loading skill: showroom-pafyllning**. Där ser du att agenten har matchat frågan mot skillens beskrivning och laddat dess instruktioner.

![Agenten laddar showroom-pafyllning när frågan handlar om showroompåfyllning](../../assets/nextgen/chap06/7.png)

När agenten har visat produktalternativen väljer du en produkt och anger antal. I det visade exemplet fortsätter användaren med:

```text
Vi väljer Arcus T1 – Skogsgrön, 5 stycken.
```

Kontrollera att agentens nästa svar:

- avser rätt showroom och produktvariant
- visar SKU, antal, styckpris och aktuellt disponibelt saldo
- anger om saldot räcker för det önskade antalet
- inte påstår att en beställning eller reservation har skapats

Svaret kan även innehålla ett beräknat totalpris, men det är inte ett krav i den första versionen av skillen. Den exakta formuleringen kan variera mellan modeller.

![Agenten sammanfattar valet och förklarar att ingen beställning eller reservation har skapats](../../assets/nextgen/chap06/8.png)

!!! success "Första skillen är klar"
    Showroomprocessen ligger nu i en avgränsad skill i stället för i agentens globala instruktioner. Skillen använder samma kunskapskällor och verktyg som tidigare, men laddas bara när frågan handlar om showroompåfyllning.
