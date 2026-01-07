# 5. Ge Agenten Kunskap

Just nu är vår agent trevlig, men den vet ingenting om vårt företag. Den misslyckades ju nyss med att svara på när supporten har öppet.

Nu ska vi ändra på det! Vi ska ge agenten två typer av kunskap:

1.  **Intern kunskap:** Ett dokument med vår IT-policy.
2.  **Extern kunskap:** Microsofts officiella hjälpsidor för Windows.

---

## Steg 1: Skapa Policy-dokumentet

Vi behöver en fil att ladda upp. För att göra det enkelt skapar vi en direkt på datorn.

1. Öppna **Anteckningar** (Notepad) eller **Word** på din dator.
2. Kopiera texten i rutan nedan och klistra in den i ditt dokument:

```text
**IT-Policy och Rutiner för Anställda**
Version: 2025-1.0

**1. Kontakt och Öppettider**
Generell IT-support nås på telefon (08-123 45 67) eller via Teams.
Supportens öppettider är:
- Vardagar: 08:00 – 17:00
- Lunchstängt: 12:00 – 13:00

**2. Uthämtning av ny utrustning**
Beställda datorer och telefoner kan hämtas ut i IT-receptionen (Plan 3).
Öppettider för just uthämtning är begränsade till:
- Måndagar: 09:00 – 11:00
- Torsdagar: 13:00 – 15:00

**3. Installation av programvara**
Det är tillåtet att installera arbetsrelaterade program (t.ex. Spotify, VS Code).
Det är **strängt förbjudet** att installera spelplattformar (t.ex. Steam, Epic Games) på företagets datorer.

**4. Skadad utrustning**
Vid skada orsakad av oaktsamhet (t.ex. kaffespill) utgår en självrisk på 500 kr.
```

3. Spara filen på skrivbordet (eller någonstans du hittar den) och döp den till `IT_Policy.docx` (eller `.txt` / `.pdf`).

---

## Steg 2: Ladda upp dokumentet (Intern kunskap)

Nu ska vi lära agenten innehållet i filen.

1. Se till att du är inne i din agent (**IT Support Helper**).
2. Leta upp sektionen **Knowledge** (oftast mitt på sidan eller under fliken Knowledge) och klicka på **+ Add knowledge**.

    ![Meny för att lägga till kunskap](assets/images/chap05/knowledge-add-menu.png)

3. Välj **Upload file** (eller *Click to browse*).

    ![Välja filen](assets/images/chap05/knowledge-choose-onedrive.png)

4. Leta upp filen `IT_Policy` som du nyss skapade och välj den genom att klicka på den och sedan klicka på **Confirm selection**.

    ![Välja filen](assets/images/chap05/knowledge-browse.png)

5. Klicka på **Add to agent**.

    ![Bekräfta uppladdning](assets/images/chap05/knowledge-confirm-file.png)

*Nu börjar Copilot Studio bearbeta filen ("Indexing"). Detta kan ta någon minut beroende på filens storlek. Under tiden gör vi nästa steg!*

---

## Steg 3: Lägg till en webbsida (Extern kunskap)

Vi vill inte behöva skriva instruktioner för hur man använder Windows 11 själva. Det har Microsoft redan gjort. Vi pekar agenten dit istället.

1. Klicka på **+ Add knowledge** igen.
2. Välj **Public websites**.
3. I rutan för URL, klistra in:
    `https://support.microsoft.com/sv-se/windows`

    ![Lägga till webbsida](assets/images/chap05/knowledge-web-input.png)

4. Klicka på **Add** och sedan **Add to agent**.

---

## Steg 4: Testa Kunskapen

Nu har vi gett agenten både interna regler och extern expertis. Dags att se om det fungerar!

*(Kontrollera att statusen på dina källor är "Ready" innan du testar).*

### Test 1: Den interna frågan (Revansch!)
Förra gången visste agenten inte när vi hade öppet.

1. Gå till testchatten och klicka på "Refresh" (pilen) högst upp för att starta om konversationen.
2. Fråga:
    > *Vilka tider har IT-supporten öppet?*

**Förväntat resultat:**
Nu ska agenten svara korrekt (Måndagar 09-11 och Torsdagar 13-15).

### Test 2: Den externa frågan
Nu testar vi om den kan söka på webben.

1. Fråga:
    > *Hur tar jag en skärmdump i Windows 11?*

**Förväntat resultat:**
Agenten ska ge dig en steg-för-steg guide hämtad från Microsofts hemsida.

### Analysera källan
Titta noga på agentens svar. Under svaret (eller om du klickar på fotnoterna `[1]`) kan du se var den hittade informationen.

* På fråga 1 ska det stå **IT_Policy**.
* På fråga 2 ska det stå **support.microsoft.com**.

![Lyckat test med källhänvisning](assets/images/chap05/knowledge-test-success.png)

!!! success "Succé!"
    Du har nu byggt en **hybrid-agent**! Den kombinerar dina unika företagsregler med allmän kunskap från internet.
    
    *(Vi väntar lite med SharePoint-listan för att säkerställa att alla har rätt behörigheter, men principen är exakt densamma).*