# 10. Koppla flödet och slutför skillen

Agentflödet är publicerat, men agenten behöver tydlig information om när verktyget ska användas och vilka värden som ska skickas. I det här kapitlet kontrollerar du verktygets inställningar och ersätter den befintliga skillen med version 3.

När kapitlet är klart kan agenten:

- samla in och återanvända uppgifter som redan finns i samtalet
- visa ett fullständigt underlag och be om bekräftelse
- anropa **Hantera showroompåfyllning** med rätt indata
- återge om lagret reserverades eller om begäran skickades för manuell granskning

---

## Del 1: Gå tillbaka till agenten

Välj **Lyserno Produktassistent** uppe till vänster i arbetsflödet.

![Länken Lyserno Produktassistent i arbetsflödets övre vänstra hörn](../../assets/nextgen/chap10/1.png)

Om Copilot Studio frågar om du vill lämna osparade ändringar väljer du **Kasta bort** endast om flödet redan är publicerat och du inte har gjort fler ändringar som ska sparas.

Du kommer tillbaka till agenten och dialogrutan **Information om arbetsflöde** öppnas.

---

## Del 2: Beskriv arbetsflödesverktyget

Kontrollera att namnet är:

```text
Hantera showroompåfyllning
```

Ange följande beskrivning:

```text
Använd när användaren har bekräftat produktvariant, antal och exakt showroom. Flödet hämtar den valda produkten från Centrallager och kontrollerar aktuellt saldo och villkoren för standardprocessen. Om villkoren är uppfyllda reserveras antalet och ett bekräftelsemejl skickas. Annars skickas begäran för manuell granskning utan att lagret ändras. Flödet returnerar status och meddelande.
```

Beskrivningen talar om för agenten när verktyget är relevant och vad de två möjliga vägarna innebär.

![Arbetsflödesverktygets namn och beskrivning](../../assets/nextgen/chap10/2.png)

---

## Del 3: Kontrollera verktygets indata

Öppna **Indata**. Kontrollera att alla fem värden har rätt namn och beskrivning:

<div class="table-nowrap-first" markdown="1">

| Indata | Beskrivning |
| --- | --- |
| `ItemID` | SharePoint-ID för den valda produktvarianten i listan Centrallager. Använd inte SKU eller ProductModelID. |
| `Quantity` | Antal enheter som användaren har bekräftat. Måste vara ett positivt heltal. |
| `ShowroomName` | Verifierat exakt namn på det showroom som ska ta emot produkterna. |
| `ShowroomType` | Verifierad showroomtyp: Showroomstudio eller Flagship. |
| `Country` | Verifierat mottagarland: Sverige eller Norge. |

</div>

Behåll **AI** under **Hur fylls det här i?** för samtliga värden. Agenten ska fylla dem från samtalet och skillens instruktioner när verktyget anropas.

![ItemID och övriga indata har namn, beskrivningar och fylls med AI](../../assets/nextgen/chap10/3.png)

---

## Del 4: Kontrollera verktygets utdata

Öppna **Utdata** och kontrollera att arbetsflödet returnerar:

| Utdata | Typ |
| --- | --- |
| `ResultStatus` | String |
| `ResultMessage` | String |

`ResultStatus` visar vilken väg flödet tog. `ResultMessage` innehåller meddelandet som agenten ska återge för användaren.

![ResultStatus och ResultMessage visas under arbetsflödets utdata](../../assets/nextgen/chap10/4.png)

Välj **Spara**.

---

## Del 5: Kontrollera att verktyget har lagts till

Arbetsflödet visas nu under **Verktyg** tillsammans med **Hämta produkter från Centrallager**.

![Hantera showroompåfyllning visas under Verktyg](../../assets/nextgen/chap10/5.png)

---

## Del 6: Ersätt skillen med version 3

Ladda ner ZIP-filen:

<p><a class="button button--primary button--download" href="../../../downloads/nextgen/showroom-pafyllning-v3/showroom-pafyllning-v3.zip" download>Ladda ner showroom-pafyllning v3</a></p>

ZIP-filen innehåller `SKILL.md` direkt i rotmappen. Filens metadata anger version `3.0.0`.

Klicka på krysset vid den befintliga skillen `showroom-pafyllning`. Bekräfta med **Ta bort**.

![Bekräftelsen för att ta bort den befintliga skillen](../../assets/nextgen/chap10/6.png)

När skillen har tagits bort väljer du plustecknet vid **Färdigheter**.

![Färdigheter är tomt och den nya skillen kan läggas till](../../assets/nextgen/chap10/7.png)

Välj **Ladda upp en färdighet**. Dra ZIP-filen till uppladdningsytan eller klicka i ytan för att välja filen.

![Dialogrutan för att ladda upp en skill som SKILL.md eller ZIP-fil](../../assets/nextgen/chap10/8.png)

Välj `showroom-pafyllning-v3.zip`. När uppladdningen är klar visas `showroom-pafyllning` åter under **Färdigheter**.

![Showroom-pafyllning har lagts till på nytt](../../assets/nextgen/chap10/9.png)

Öppna skillen. Kontrollera att metadata visar version `3.0.0` och att instruktionerna innehåller delarna om bekräftelse, arbetsflödet och resultatet.

![Den importerade skillen med beskrivning, metadata och instruktioner](../../assets/nextgen/chap10/10.png)

!!! info "Version 3 ersätter den tidigare skillen"
    V2 stannar efter policybedömningen och sammanfattningen. V3 ber dessutom om en slutlig bekräftelse, anropar **Hantera showroompåfyllning** med `ItemID`, `Quantity`, `ShowroomName`, `ShowroomType` och `Country` samt återger resultatet från `ResultStatus` och `ResultMessage`.

    Lägg inte till V3 som en parallell skill. Två skills med samma användningsområde kan ge motstridiga instruktioner.

---

## Del 7: Testa hela standardprocessen

Öppna **Förhandsgranska**, starta en ny chatt och skriv:

```text
Vi behöver fylla på showroom Göteborg med gröna bordslampor. Vilka modeller i sortimentet kan vi välja mellan för vanlig showroompåfyllning?
```

Välj sedan Arcus T1 – Skogsgrön och ange fem exemplar till Showroomstudio GML i Göteborg/Mölndal.

```text
Vi väljer Arcus T1 – Skogsgrön, 5 stycken, till Showroomstudio GML i Göteborg/Mölndal.
```

Agenten ska visa det fullständiga underlaget och be om en slutlig bekräftelse innan arbetsflödet körs. Bekräfta att uppgifterna stämmer.

!!! warning "Testet ändrar lagret"
    Den här körningen uppdaterar `ReservedQuantity` i Centrallager och skickar ett riktigt bekräftelsemejl. Kör inte samma test flera gånger om du inte först återställer värdet.

Efter körningen ska agenten återge att fem exemplar har reserverats och att bekräftelsemejlet har skickats.

![Agenten visar underlaget, får bekräftelse och återger arbetsflödets resultat](../../assets/nextgen/chap10/12.png)

Kontrollera att bekräftelsemejlet innehåller showroom, produkt, SKU, antal, pris och disponibelt saldo efter reservationen.

![Bekräftelsemejlet efter den genomförda reservationen](../../assets/nextgen/chap10/13.png)

---

## Del 8: Kontrollera att saldot ändrades

Före körningen har Arcus T1 – Skogsgrön 12 exemplar i lager och 3 reserverade. Det disponibla saldot är därför 9.

![Centrallager före körningen med ReservedQuantity 3](../../assets/nextgen/chap10/11.png)

Efter reservationen är `ReservedQuantity` 8. `OnHandQuantity` är fortfarande 12, vilket ger 4 disponibla exemplar.

![Centrallager efter körningen med ReservedQuantity 8](../../assets/nextgen/chap10/14.png)

Flödet har alltså lagt till de fem nya reservationerna till det tidigare värdet. Det har inte ersatt värdet med 5.

---

## Del 9: Granska körningen i arbetsflödet

Öppna **Hantera showroompåfyllning** och välj fliken **Aktivitet**.

![Fliken Aktivitet i det publicerade arbetsflödet](../../assets/nextgen/chap10/15.png)

Den senaste körningen visas i aktivitetslistan. Kontrollera att den har lyckats och öppna den.

![Den senaste lyckade körningen under Aktivitet](../../assets/nextgen/chap10/16.png)

Körningsvyn visar vilka noder och vilken gren som användes. I det här testet gick flödet genom **Standard – svensk showroomstudio**, uppdaterade det reserverade antalet, skickade reservationsbekräftelsen och returnerade resultatet. Grenen för manuell granskning hoppades över.

![Den lyckade körvägen genom standardprocessen](../../assets/nextgen/chap10/17.png)

!!! success "Hela processen fungerar"
    Agenten samlar in underlaget, ber om bekräftelse och anropar arbetsflödet. Flödet uppdaterar Centrallager, skickar mejlet och returnerar ett resultat som agenten återger för användaren.
