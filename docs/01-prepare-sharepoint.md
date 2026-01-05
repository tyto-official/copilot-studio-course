# 1. Förbered SharePoint

Vår IT-support agent behöver data för att kunna svara på frågor. Vi ska nu skapa en SharePoint-sajt som innehåller information om hårdvara (Laptops, skärmar etc.).

För att spara tid använder vi en färdig mall från Microsoft.

---

## Steg 1: Gå till SharePoint

Vi navigerar dit direkt från Power Apps.

1. Klicka på **Våfflan** (App launchern) bestående av 9 prickar högst upp i vänstra hörnet.

![Klicka på våfflan](assets/images/chap01/sp-step1-waffle.jpg)

2. I menyn som fälls ut, klicka på **SharePoint**.

![Välj SharePoint i menyn](assets/images/chap01/sp-step2-icon.jpg)

3. Du hamnar nu på startsidan för SharePoint. Klicka på **+ Create site** (eller *+ Skapa webbplats*).

![SharePoint startsida](assets/images/chap01/sp-step3-home.jpg)

---

## Steg 2: Välj mallen "IT Help Desk"

Nu ska vi välja rätt mall.

1. Du får två val. Välj **Team site** (Gruppwebbplats).

![Välj Team Site](assets/images/chap01/sp-step4-teamsite.jpg)

2. Klicka på fliken **Templates** (Mallar) högst upp.
3. Scrolla ner och klicka på rutan för **IT Help Desk**.
4. Klicka på knappen **Use template**.

![Välj mallen IT Help Desk i galleriet](assets/images/chap01/sp-step5-template.jpg)

*(Om du inte ser mallen, kontakta kursledaren för instruktioner om hur man skapar listan manuellt).*

---

## Steg 3: Konfigurera språk (Kritiskt!)

Detta är det viktigaste steget för att koden ska fungera senare.

1. **Site name:** Döp den till `IT-Support`.
2. Klicka på pilen för att fälla ut inställningarna (om de inte redan syns).
3. **Language:** Ändra detta till **English**.

![Välj English under språkinställningarna](assets/images/chap01/sp-step6-language.jpg)

!!! danger "Välj Engelska!"
    Även om du föredrar svenska menyer **MÅSTE** du välja **English** här.
    
    Om du väljer svenska kommer de interna namnen på kolumnerna heta saker som `Enhetstyp` istället för `DeviceType`, vilket gör att din Copilot inte kommer kunna läsa datan i senare övningar.

4. Klicka **Create site** / **Finish**.

---

## Steg 4: Anpassa listan "Devices"

Mallen har skapat en lista åt oss som heter **Devices**, men vi behöver lägga till bilder på produkterna.

1. På din nya sajt, klicka på **Site contents** i vänstermenyn (eller "Webbplatsinnehåll").
2. Klicka på listan som heter **Devices**.

![Hitta listan Devices under Site contents](assets/images/chap01/sp-step7-sitecontents.jpg)

3. Scrolla längst till höger i listan och klicka på **+ Add column**.
4. Välj typen **Hyperlink** (Länk).

![Lägg till kolumn av typen Hyperlink](assets/images/chap01/sp-step8-addcolumn.jpg)

5. Döp kolumnen till: `Image`
6. Klicka **Save**.

---

## Steg 5: Lägg in testdata

Vi behöver några produkter som agenten kan söka efter.

1. Öppna vår **[Bildbank](device-images.md)** i en ny flik.
2. Kopiera bildlänken för respektive produkt (Högerklicka -> Kopiera bildadress).
3. Gå tillbaka till SharePoint och lägg in följande rader i listan (via **+ New** eller **Edit in grid view**).

| Title | Manufacturer | Price | Image |
| :--- | :--- | :--- | :--- |
| **Surface Laptop 13** | Microsoft | 999 | *(Klistra in länk från Bildbanken)* |
| **Surface Laptop 15** | Microsoft | 1299 | *(Klistra in länk från Bildbanken)* |
| **Surface Pro** | Microsoft | 899 | *(Klistra in länk från Bildbanken)* |
| **Surface Studio** | Microsoft | 3500 | *(Klistra in länk från Bildbanken)* |

*(Du kan lämna övriga fält som Serial Number och Asset Type tomma).*

!!! warning "Viktigt för bilderna"
    För att bilderna ska synas i SharePoint måste webbplatsen vara publicerad (live). Om du kör detta lokalt på din dator (`localhost`) kommer länkarna inte fungera förrän du gjort en `git push`.

!!! success "Klart!"
    Nu har du en databas fylld med hårdvara. I nästa kapitel ska vi börja bygga själva agenten!