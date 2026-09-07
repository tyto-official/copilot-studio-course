# Utkast: Importera listan Lyserno-Enheter

Den här versionen sparades när standardkursen gick tillbaka till att använda den färdiga SharePoint-listan **Enheter**. Filen ligger utanför `docs` och visas därför inte på kurswebbplatsen.

## Del 5: Importera listan Lyserno-Enheter

I stället för att skriva in enheterna manuellt importerar vi en färdig Excel-tabell. Alla deltagare får då samma värden och samma kolumnordning.

Filen innehåller:

- fyra laptops
- två stationära datorer
- tre surfplattor
- två reserverade enheter, så att kursens filter går att testa

### 1. Ladda ner kursfilen

<p><a class="button button--primary button--download" href="../../downloads/standard/Lyserno-Enheter.xlsx" download>Ladda ner Lyserno-Enheter.xlsx</a></p>

Spara filen på en plats du enkelt hittar. Excel-tabellen i filen heter **Enheter**.

### 2. Skapa en lista från Excel

1. Gå tillbaka till startsidan för **Lyserno IT-support**.
2. Välj **+ Ny** och sedan **Lista**.

![Menyn Ny med alternativet Lista](../../assets/standard/images-sv/chap01/20.png)

3. Under **Importera från** väljer du **Excel**.

![Fönstret Hur vill du börja med alternativet Excel](../../assets/standard/images-sv/chap01/21.png)

### 3. Ladda upp Excel-filen

Välj **Ladda upp fil** eller dra in filen i fönstret.

```text
Lyserno-Enheter.xlsx
```

![Importera från Excel med knappen Ladda upp fil](../../assets/standard/images-sv/chap01/22.png)

Om du drar in filen behöver du markera den innan du kan välja **Nästa**. Om du använder knappen **Ladda upp fil** går du normalt direkt till nästa steg.

![Den uppladdade Excel-filen markerad inför importen](../../assets/standard/images-sv/chap01/23.png)

Kontrollera att tabellen **Enheter** är vald högst upp i förhandsgranskningen.

![Förhandsgranskningen av data från Excel](../../assets/standard/images-sv/chap01/24.png)

Förhandsgranskningen ska visa nio rader och följande kolumner:

- `Title`
- `Status`
- `Manufacturer`
- `Model`
- `AssetType`
- `Color`
- `SerialNumber`
- `PurchaseDate`
- `PurchasePrice`
- `OrderNumber`
- `Image`

### 4. Anpassa kolumntyperna

SharePoint tolkar flera kolumner som enradig text. Ändra följande kolumner i förhandsgranskningen:

| Kolumn | Datatyp |
| --- | --- |
| `Status` | **Val** |
| `Manufacturer` | **Val** |
| `AssetType` | **Val** |
| `Color` | **Val** |
| `PurchaseDate` | **Datum och tid** |
| `PurchasePrice` | **Valuta** |

Låt `Title`, `Model`, `SerialNumber`, `OrderNumber` och `Image` vara enradig text.

Ändra först `Status` till **Val**.

![Kolumnen Status ändras till Val](../../assets/standard/images-sv/chap01/25.png)

Ändra `Manufacturer` till **Val**.

![Kolumnen Manufacturer ändras till Val](../../assets/standard/images-sv/chap01/26.png)

Ändra `AssetType` till **Val**.

![Kolumnen AssetType ändras till Val](../../assets/standard/images-sv/chap01/27.png)

Ändra `Color` till **Val**.

![Kolumnen Color ändras till Val](../../assets/standard/images-sv/chap01/28.png)

Ändra `PurchaseDate` till **Datum och tid**.

![Kolumnen PurchaseDate ändras till Datum och tid](../../assets/standard/images-sv/chap01/29.png)

Ändra `PurchasePrice` till **Valuta**.

![Kolumnen PurchasePrice ändras till Valuta](../../assets/standard/images-sv/chap01/30.png)

Kontrollera en sista gång att kolumnerna har rätt typ.

![Förhandsgranskningen med de färdiga kolumntyperna](../../assets/standard/images-sv/chap01/31.png)

Välj **Nästa** när typerna är klara.

### 5. Skapa listan

Kontrollera att listans namn är exakt:

```text
Lyserno-Enheter
```

Låt **Visa i webbplatsnavigering** vara markerat och välj **Skapa**.

![Skapa listan med namnet Lyserno-Enheter](../../assets/standard/images-sv/chap01/32.png)

### 6. Ändra valutaformatet

När listan öppnas kan priserna visas i dollar trots att kolumnen har typen valuta.

![Den skapade listan med priser i dollar](../../assets/standard/images-sv/chap01/33.png)

1. Öppna menyn för kolumnen `PurchasePrice`.
2. Välj **Kolumninställningar** och sedan **Redigera**.

![Kolumnmenyn för PurchasePrice](../../assets/standard/images-sv/chap01/34.png)

3. Under **Valutaformat** väljer du alternativet för Sverige, `123 456,00 kr (Sverige)`.

![Valutaformatet för Sverige i listan](../../assets/standard/images-sv/chap01/35.png)

4. Kontrollera valet och välj **Spara**.

![Svenskt valutaformat valt för PurchasePrice](../../assets/standard/images-sv/chap01/36.png)

Priserna ska nu visas i kronor.

![Listan med inköpspriser i kronor](../../assets/standard/images-sv/chap01/37.png)

### 7. Skapa en kolumn för klickbara bildlänkar

Kolumnen `Image` importerades som enradig text. Vi skapar därför en hyperlänkskolumn och kopierar bildadresserna dit.

1. Välj **+ Lägg till en kolumn**.
2. Leta upp **Hyperlänk** i listan med kolumntyper.

![Menyn Lägg till en kolumn med alternativet Hyperlänk](../../assets/standard/images-sv/chap01/38.png)

3. Markera **Hyperlänk** och välj **Nästa**.

![Hyperlänk vald som kolumntyp](../../assets/standard/images-sv/chap01/39.png)

4. Ange följande namn:

```text
Image URL
```

5. Lämna beskrivningen tom och välj **Spara**.

![Den nya hyperlänkskolumnen med namnet Image URL](../../assets/standard/images-sv/chap01/40.png)

### 8. Kopiera bildadresserna

1. Välj **Redigera i rutnätsvy** bredvid knappen **+ Nytt**.

![Knappen Redigera i rutnätsvy](../../assets/standard/images-sv/chap01/41.png)

2. Markera alla nio värden i kolumnen `Image`. Ta inte med kolumnrubriken.
3. Kopiera de markerade värdena.

![Alla bildadresser i kolumnen Image markerade](../../assets/standard/images-sv/chap01/42.png)

4. Markera den första tomma cellen under `Image URL` och klistra in värdena.

![Bildadresserna kopieras till kolumnen Image URL](../../assets/standard/images-sv/chap01/43.png)

Kontrollera att alla nio värden nu visas som klickbara länkar i `Image URL`. Välj **Avsluta rutnätsvy** när du är klar.

![Både den gamla textkolumnen och den nya hyperlänkskolumnen](../../assets/standard/images-sv/chap01/44.png)

### 9. Ta bort den gamla Image-kolumnen

Ta bara bort den gamla kolumnen när du har kontrollerat att alla nio länkar finns i `Image URL`.

1. Öppna menyn för kolumnen `Image`.
2. Välj **Kolumninställningar** och sedan **Redigera**.

![Kolumninställningar för den gamla Image-kolumnen](../../assets/standard/images-sv/chap01/45.png)

3. Välj **Ta bort** längst ner i panelen.

![Redigera kolumn med knappen Ta bort](../../assets/standard/images-sv/chap01/46.png)

4. SharePoint varnar att kolumnen och dess data tas bort permanent. Välj **Ta bort** för att bekräfta.

![Bekräftelsen för att ta bort Image-kolumnen](../../assets/standard/images-sv/chap01/47.png)

### 10. Kontrollera den färdiga listan

När listan öppnas ska den innehålla nio enheter. Kontrollera särskilt att:

- värdena i `AssetType` är `Laptop`, `Desktop` och `Tablet`
- värdena i `Status` är `Available` och `Reserved`
- priserna i `PurchasePrice` visas i kronor
- kolumnen `Image URL` innehåller klickbara länkar
- den gamla kolumnen `Image` inte längre finns
- minst två tillgängliga enheter finns för varje enhetstyp

![Den färdiga listan med Image URL som hyperlänkskolumn](../../assets/standard/images-sv/chap01/48.png)

!!! info "SharePoint kan visa interna fältnamn"
    När listan skapas från Excel får kolumnerna ibland interna namn som `field_1`, `field_2` och `field_3`. Visningsnamnen i listan är fortfarande `Status`, `Manufacturer`, `Model` och så vidare.

    Det är väntat. I senare kapitel väljer du fälten som Copilot Studio visar från den importerade listan. Byt inte namn på de importerade kolumnerna efteråt, eftersom det inte ändrar deras interna namn.

!!! success "Kursmiljön är klar"
    Du har nu tillgång till Copilot Studio, en personlig utvecklingsmiljö, SharePoint-webbplatsen **Lyserno IT-support** och listan **Lyserno-Enheter**. I nästa kapitel öppnar vi Copilot Studio och kontrollerar att standardupplevelsen används.
