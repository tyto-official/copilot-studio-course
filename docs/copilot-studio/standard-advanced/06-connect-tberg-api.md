# 6. Anslut T-Berg DU API och verifiera objektet

Ämnet har nu ett objekt-ID och ett värde för påverkan, men objektet har ännu inte verifierats mot underhållssystemet. Nu importerar vi T-Berg DU API som ett anpassat anslutningsprogram, skapar en anslutning och använder objektinformationen i ämnet.

När kapitlet är klart har du:

- importerat och konfigurerat **T-Berg DU API**
- skapat en tidsbegränsad testnyckel och anslutit den till connectorn
- testat objektuppslaget med `LO-PU-017`
- verifierat ämnets `AssetId` mot T-Berg D&U
- beräknat prioritet från påverkan och objektets kritikalitet
- byggt och kontrollerat `MaintenanceContext` i testchatten
- tagit bort det tillfälliga kontrollmeddelandet och lämnat underlaget tillbaka till agenten
- uppdaterat agentens instruktioner med en riktig referens till ämnet

!!! info "Spara efter varje färdig nod"
    När du är tillbaka i ämnesbyggaren väljer du **Spara** efter varje färdig nod. Då blir det enklare att hitta var ett fel uppstod.

---

## Del 1: Öppna anpassade anslutningsprogram

Stå vid plustecknet under `Sätt vald påverkan`, efter att grenarna har gått ihop. Välj **Lägg till ett verktyg** och öppna fliken **Verktyg** längst till höger.

![Menyn under ämnet med Lägg till ett verktyg och fliken Verktyg](../../assets/standard-advanced/chap06/1.png)

Välj **Lägg till ett verktyg**.

![Fliken Verktyg med valet Lägg till ett verktyg](../../assets/standard-advanced/chap06/2.png)

I verktygspanelen väljer du **Visa fler** under **Lägg till ny MCP**.

![Verktygspanelen med länken Visa fler](../../assets/standard-advanced/chap06/3.png)

Välj sedan **Lägg till ny Anpassat anslutningsprogram**.

![Den utökade verktygspanelen med Anpassat anslutningsprogram](../../assets/standard-advanced/chap06/4.png)

Power Apps öppnas på sidan **Anpassade anslutningsprogram**.

![Sidan Anpassade anslutningsprogram i Power Apps](../../assets/standard-advanced/chap06/5.png)

Välj **Ny anpassad anslutning** uppe till höger. I menyn väljer du **Importera en OpenAPI-fil**.

![Menyn Ny anpassad anslutning med valet Importera en OpenAPI-fil](../../assets/standard-advanced/chap06/6.png)

---

## Del 2: Importera OpenAPI-filen

Ladda först ner kursens OpenAPI-fil:

<p><a class="button button--primary button--download" href="../../../downloads/standard-advanced/tberg-du-connector.swagger.json" download>Ladda ner tberg-du-connector.swagger.json</a></p>

I dialogrutan anger du namnet:

```text
T-Berg DU API
```

Välj **Importera** och öppna filen `tberg-du-connector.swagger.json`. När filnamnet visas i dialogrutan väljer du **Fortsätt**.

![Dialogrutan Importera en OpenAPI-fil med namn och vald fil](../../assets/standard-advanced/chap06/7.png)

OpenAPI-filen är kontraktet mellan Power Platform och T-Berg D&U. Den beskriver adressen, autentiseringen, åtgärderna och vilka fält som skickas och returneras. Därför behöver du inte skriva in varje API-detalj för hand.

---

## Del 3: Kontrollera den allmänna informationen

Efter importen öppnas connectorns konfiguration på fliken **Allmänt**.

### Ladda upp connectorns ikon

Ladda ner T-Berg D&U-loggan:

<p><a class="button button--primary button--download" href="../../../downloads/standard-advanced/tberg-du-logo.png" download>Ladda ner T-Berg D&amp;U-loggan</a></p>

Välj **Ladda upp** och använd den nedladdade PNG-filen. Ange sedan bakgrundsfärgen:

```text
#fefefe
```

Kontrollera att **Anslut via lokal datagateway** inte är markerad. API:t är publikt tillgängligt över HTTPS och använder därför ingen lokal gateway.

Följande värden ska visas:

| Fält | Värde |
|---|---|
| Beskrivning | `Ger Lysernos driftassistent tillgång till objektinformation i T-Berg D&U och skapar godkända arbetsordrar. Samma tidsbegränsade T-Berg-testnyckel används för REST och MCP.` |
| Schema | `HTTPS` |
| Värd | `ca-tberg-du-api.orangesmoke-45b4d851.swedencentral.azurecontainerapps.io` |
| Bas-URL | `/api` |

![Connectorns allmänna information med ikon, beskrivning och API-adress](../../assets/standard-advanced/chap06/8.png)

Välj **Säkerhet**.

---

## Del 4: Konfigurera API-nyckeln

Kontrollera att autentiseringstypen är **API-nyckel**. Om ett annat värde visas väljer du **API-nyckel** i listan.

Ändra **Parameteretikett** från det generiska namnet `API-nyckel` till:

```text
T-Berg-testnyckel
```

Kontrollera samtidigt följande värden:

| Fält | Värde |
|---|---|
| Parameternamn | `x-workshop-key` |
| Parameterplats | `Sidhuvud` |

![Säkerhetsfliken med API-nyckeln T-Berg-testnyckel](../../assets/standard-advanced/chap06/9.png)

Parameteretiketten är namnet deltagaren ser när anslutningen skapas. `x-workshop-key` är det riktiga HTTP-headernamnet som API:t läser. Ändra inte headernamnet.

Välj **Definition**.

---

## Del 5: Kontrollera åtgärderna

OpenAPI-filen har skapat två åtgärder. Vi ändrar inget här, men går igenom båda för att se vad connectorn kan göra.

### GetAsset

Välj `GetAsset` under **Åtgärder**. Under **Allmänt** ska följande information visas:

| Fält | Värde |
|---|---|
| Sammanfattning | `Verifiera och hämta objekt` |
| Åtgärds-ID | `GetAsset` |

Beskrivning:

```text
Hämtar objektets namn, plats, kritikalitet, SLA, serviceform och kompetenskrav. Använd åtgärden för att verifiera ett objekt-ID mot objektregistret.
```

![GetAsset med sammanfattning, beskrivning och åtgärds-ID](../../assets/standard-advanced/chap06/10.png)

Under **Förfrågan** ser du att åtgärden använder `GET` och tar emot ett obligatoriskt `assetId` i sökvägen.

![Förfrågan för GetAsset med metoden GET och parametern assetId](../../assets/standard-advanced/chap06/11.png)

Under **Svar** finns `200` när objektet hittas och `404` när det saknas. Den gröna markeringen under **Validering** visar att definitionen är giltig.

![Svar och validering för GetAsset](../../assets/standard-advanced/chap06/12.png)

### CreateWorkOrder

Välj `CreateWorkOrder` under **Åtgärder**. Under **Allmänt** ska följande information visas:

| Fält | Värde |
|---|---|
| Sammanfattning | `Skapa arbetsorder` |
| Åtgärds-ID | `CreateWorkOrder` |

Beskrivning:

```text
Skapar en arbetsorder från ett verifierat och bekräftat underlag. Arbetsytan bestäms av testnyckeln och ska inte skickas i anropet.
```

![CreateWorkOrder med sammanfattning, beskrivning och åtgärds-ID](../../assets/standard-advanced/chap06/13.png)

Under **Förfrågan** ser du att åtgärden använder `POST` och skickar arbetsorderns uppgifter i anropets body.

![Förfrågan för CreateWorkOrder med metoden POST och body](../../assets/standard-advanced/chap06/14.png)

Under **Svar** finns statuskoderna `201`, `400`, `401` och `429`. Valideringen ska vara grön även här.

![Svar och validering för CreateWorkOrder](../../assets/standard-advanced/chap06/15.png)

Vi använder inte `CreateWorkOrder` i ämnet. Den skrivande åtgärden läggs senare i ett agentflöde med användarbekräftelse.

---

## Del 6: Skapa connectorn

Hoppa över fliken **Kod** och öppna **Testa**. Sidan visar att connectorn måste skapas innan den kan testas.

![Testfliken innan det anpassade anslutningsprogrammet har skapats](../../assets/standard-advanced/chap06/16.png)

Välj **Skapa anslutning** uppe till höger. När connectorn har skapats visas teståtgärderna, men ingen anslutning är vald ännu.

![Testfliken med GetAsset och valet Ny anslutning](../../assets/standard-advanced/chap06/17.png)

Innan du väljer **Ny anslutning** behöver du en testnyckel från T-Berg D&U.

---

## Del 7: Skapa en T-Berg-testnyckel

Öppna T-Berg D&U i en ny flik:

<p><a class="button button--primary" href="https://ca-tberg-du-web.orangesmoke-45b4d851.swedencentral.azurecontainerapps.io" target="_blank" rel="noopener">Öppna T-Berg D&amp;U</a></p>

På startsidan bekräftar du att du är en människa.

![Startsidan i T-Berg D&U med verifiering och knappen Skapa testnyckel](../../assets/standard-advanced/chap06/18.png)

När verifieringen visar **Klart!** väljer du **Skapa testnyckel**.

![Verifieringen är klar och testnyckeln kan skapas](../../assets/standard-advanced/chap06/19.png)

Kopiera testnyckeln direkt. Du använder samma nyckel till webbgränssnittet, REST-connectorn och MCP-servern.

![Den skapade testnyckeln med arbetsyta och giltighetstid](../../assets/standard-advanced/chap06/20.png)

!!! warning "Spara nyckeln medan den visas"
    Testnyckeln ger åtkomst till din privata arbetsyta. Klistra inte in den i kursmaterial, skärmbilder eller meddelanden. Om den försvinner kan du skapa en ny.

En testnyckel gäller i **24 timmar**. Den har en gräns på **500 API- och MCP-anrop** och **20 arbetsordrar**. Varje nyckel får en separat arbetsyta som rensas automatiskt.

Välj **Öppna min arbetsyta**. På översikten ser du bland annat nyckelns återstående giltighetstid och status för systemet.

![T-Berg D&U med driftöversikt för den privata arbetsytan](../../assets/standard-advanced/chap06/21.png)

### Se vad testmiljön innehåller

Under **Objektregister** finns produktionsobjekten som connectorn kan verifiera.

![Objektregistret i T-Berg D&U](../../assets/standard-advanced/chap06/22.png)

Under **Arbetsordrar** visas arbetsordrarna för din testyta. Nya arbetsordrar som agenten skapar senare hamnar här.

![Arbetsordrar i T-Berg D&U](../../assets/standard-advanced/chap06/23.png)

Under **Tekniker** finns teknikernas kompetenser, tillgänglighet och planerade arbete.

![Tekniker i T-Berg D&U](../../assets/standard-advanced/chap06/24.png)

Under **Felhistorik** finns tidigare fel och åtgärder för objekten.

![Felhistorik i T-Berg D&U](../../assets/standard-advanced/chap06/25.png)

De här delarna används mer i nästa kapitel. Nu går vi tillbaka till connectorn och ansluter testnyckeln.

---

## Del 8: Skapa anslutningen

Gå tillbaka till fliken **Testa** i Power Apps. Om ingen anslutning visas väljer du **Ny anslutning**.

![Testfliken utan vald anslutning](../../assets/standard-advanced/chap06/26.png)

Klistra in nyckeln i fältet **T-Berg-testnyckel** och välj **Skapa**.

![Dialogrutan för en ny T-Berg DU API-anslutning](../../assets/standard-advanced/chap06/27.png)

När anslutningen har skapats skickas du till sidan **Anslutningar**. `T-Berg DU API` ska ha statusen **Anslutet**.

![Sidan Anslutningar med T-Berg DU API anslutet](../../assets/standard-advanced/chap06/28.png)

Power Apps går inte automatiskt tillbaka till connectorns testflik. Vi öppnar connectorn igen.

Välj **Mer** i vänstermenyn.

![Menyn Mer i Power Apps](../../assets/standard-advanced/chap06/29.png)

Om **Anpassade anslutningsprogram** inte redan är fäst väljer du **Upptäck allt**. Under området **Data** väljer du **Anpassade anslutningsprogram**.

![Sidan Upptäck allt med Anpassade anslutningsprogram under Data](../../assets/standard-advanced/chap06/30.png)

Leta upp `T-Berg DU API` och välj pennan under **Åtgärder** för att redigera connectorn.

![Listan med anpassade anslutningsprogram och T-Berg DU API](../../assets/standard-advanced/chap06/31.png)

Connectorns inställningar öppnas igen.

![T-Berg DU API öppnat för redigering](../../assets/standard-advanced/chap06/32.png)

Öppna fliken **Testa**. Kontrollera att den skapade anslutningen är vald under **Markerad anslutning**.

![Testfliken med den skapade anslutningen vald](../../assets/standard-advanced/chap06/33.png)

---

## Del 9: Testa objektuppslaget

Välj åtgärden `GetAsset` och ange följande `assetId`:

```text
LO-PU-017
```

Välj **Teståtgärd**.

![GetAsset med objekt-ID LO-PU-017](../../assets/standard-advanced/chap06/34.png)

Ett lyckat anrop ger status `200`. I meddelandetexten ska du bland annat se objektets namn, plats, kritikalitet och kompetenskrav.

![Det lyckade GetAsset-svaret med status 200 och objektinformation](../../assets/standard-advanced/chap06/35.png)

!!! success "Connectorn kan läsa från T-Berg D&U"
    Testet visar att OpenAPI-definitionen, anslutningen och testnyckeln fungerar tillsammans. Vi kan nu använda samma åtgärd i ämnet.

---

## Del 10: Lägg till objektuppslaget i ämnet

Gå tillbaka till Copilot Studio och öppna ämnet `Rapportera utrustningsfel`.

Om panelen från början av kapitlet fortfarande är öppen stänger du den. Välj sedan plustecknet efter att påverkan-grenarna har gått ihop och gå till **Lägg till ett verktyg** > **Anslutningsprogram**.

Sök efter:

```text
T-Berg DU API
```

Välj åtgärden **Verifiera och hämta objekt**.

![Verktygssökningen med åtgärden Verifiera och hämta objekt](../../assets/standard-advanced/chap06/36.png)

Åtgärden läggs till som en ny nod. Öppna nodens meny med tre punkter och välj **Egenskaper**.

![Noden Verifiera och hämta objekt med menyn Egenskaper](../../assets/standard-advanced/chap06/37.png)

Under **Initiering** kan du kontrollera åtgärd och anslutning. Standardvärdena kan behållas.

![Initieringen för Verifiera och hämta objekt](../../assets/standard-advanced/chap06/38.png)

### Koppla objekt-ID som indata

Öppna fliken **Indata**. Vid `assetId` öppnar du variabelväljaren. Sök efter:

```text
AssetId
```

Välj ämnesvariabeln under **Anpassad**.

![Variabelväljaren med AssetId under Anpassad](../../assets/standard-advanced/chap06/39.png)

Indatan ska nu visa `AssetId` med typen **String**.

![Indatan assetId kopplad till AssetId](../../assets/standard-advanced/chap06/40.png)

### Döp om utdata

Öppna fliken **Utdata**. Välj recordvariabeln `GetAsset`.

![Utdata från GetAsset som ett record](../../assets/standard-advanced/chap06/41.png)

Byt namn på variabeln till:

```text
VerifiedAsset
```

Behåll användningen **Ämne (begränsad omfattning)**. Variabeln används bara i det här ämnet och ska inte vara global.

![Egenskaper för variabeln VerifiedAsset](../../assets/standard-advanced/chap06/42.png)

Stäng egenskaperna och välj **Spara**.

---

## Del 11: Beräkna prioritet

Lägg till **Variabelhantering** > **Ange ett variabelvärde** under connectornoden.

![Menyn Variabelhantering med Ange ett variabelvärde](../../assets/standard-advanced/chap06/43.png)

Byt namn på noden till:

```text
Beräkna prioritet
```

Öppna **Ange variabel** och välj **Skapa en ny variabel**.

![Noden Beräkna prioritet med valet Skapa en ny variabel](../../assets/standard-advanced/chap06/44.png)

Variabeln får först ett tillfälligt namn.

![Den nya variabeln med det tillfälliga namnet Var1](../../assets/standard-advanced/chap06/45.png)

Öppna variabelns egenskaper och byt namn till:

```text
Priority
```

![Variabeln har fått namnet Priority](../../assets/standard-advanced/chap06/46.png)

Under **Till värde** öppnar du fliken **Formel** och expanderar formelfönstret.

![Formelfliken för Priority](../../assets/standard-advanced/chap06/47.png)

Klistra in följande formel:

```powerfx
Switch(
    Topic.ImpactLevel,
    "Säkerhetsrisk",
    "P1",
    "Stoppad",
    If(
        Or(
            Topic.VerifiedAsset.criticality = "Hög",
            Topic.VerifiedAsset.criticality = "Kritisk"
        ),
        "P1",
        "P2"
    ),
    "Begränsad",
    If(
        Or(
            Topic.VerifiedAsset.criticality = "Hög",
            Topic.VerifiedAsset.criticality = "Kritisk"
        ),
        "P2",
        "P3"
    ),
    "Liten",
    If(
        Or(
            Topic.VerifiedAsset.criticality = "Hög",
            Topic.VerifiedAsset.criticality = "Kritisk"
        ),
        "P3",
        "P4"
    ),
    "P2"
)
```

Formelfönstret ska visa typen **String** och en grön bock vid **Utdata**. Välj **Infoga**.

![Prioritetsformeln med godkänd utdata](../../assets/standard-advanced/chap06/48.png)

Noden visar nu att `Priority` får sitt värde från `Switch`-formeln.

![Den färdiga noden Beräkna prioritet](../../assets/standard-advanced/chap06/49.png)

Regeln använder både användarens påverkan och objektets verifierade kritikalitet. Agenten ska därför inte räkna om eller gissa prioriteten senare.

Välj **Spara**.

!!! info "Varför använder vi Switch?"
    `Switch` lägger prioritetsregeln i ämnet. Samma påverkan och kritikalitet ger då alltid samma prioritet, oavsett hur agenten formulerar eller tolkar ärendet.

---

## Del 12: Skapa MaintenanceContext

Lägg till ännu en nod med **Variabelhantering** > **Ange ett variabelvärde**.

Byt namn på noden till:

```text
Skapa verifierat underlag
```

Öppna **Ange variabel** och sök efter:

```text
MaintenanceContext
```

Välj den befintliga utdatavariabeln.

![Noden Skapa verifierat underlag med MaintenanceContext valt](../../assets/standard-advanced/chap06/50.png)

Under **Till värde** öppnar du fliken **Formel** och expanderar formelfönstret.

![Formelfönstret för MaintenanceContext](../../assets/standard-advanced/chap06/51.png)

Klistra in följande formel:

```powerfx
JSON(
    {
        assetId: Topic.VerifiedAsset.assetId,
        assetName: Topic.VerifiedAsset.name,
        location: Topic.VerifiedAsset.location,
        criticality: Topic.VerifiedAsset.criticality,
        slaHours: Topic.VerifiedAsset.slaHours,
        requiredSkill: Topic.VerifiedAsset.requiredSkill,
        serviceType: Topic.VerifiedAsset.serviceType,
        faultSummary: Topic.FaultAnalysis.structuredOutput.faultSummary,
        errorCode: Coalesce(
            Topic.FaultAnalysis.structuredOutput.errorCode,
            ""
        ),
        impactLevel: Topic.ImpactLevel,
        priority: Topic.Priority
    },
    JSONFormat.Compact
)
```

Formeln samlar de värden som nästa verktyg behöver i en kompakt JSON-sträng. Välj **Infoga** när formelfönstret visar typen **String** och en grön bock.

![JSON-formeln för det verifierade underlaget](../../assets/standard-advanced/chap06/52.png)

Välj **Spara**.

!!! info "Varför samlar vi värdena som JSON?"
    `MaintenanceContext` ska lämna flera verifierade värden till agenten i en enda utdata. JSON ger varje värde ett fast fältnamn, så att agenten kan använda rätt uppgift i nästa verktygsanrop utan att tolka om underlaget.

---

## Del 13: Undersök MaintenanceContext

Innan ämnet lämnar underlaget till agenten ska vi kontrollera att `MaintenanceContext` innehåller rätt värden. Lägg därför till en tillfällig nod med **Skicka ett meddelande** direkt under `Skapa verifierat underlag`.

![Menyn med valet Skicka ett meddelande](../../assets/standard-advanced/chap06/53.png)

Byt namn på noden till:

```text
Undersök MaintenanceContext
```

Välj variabelknappen **{x}** i meddelandefältet. Sök efter:

```text
MaintenanceContext
```

Välj ämnesvariabeln `Topic.MaintenanceContext` under **Anpassad**.

![Variabelväljaren med MaintenanceContext](../../assets/standard-advanced/chap06/54.png)

Meddelandet ska nu bestå av variabeln `MaintenanceContext`. Välj **Spara**.

!!! info "Varför visar vi MaintenanceContext i chatten?"
    Kontrollmeddelandet visar exakt vad ämnet lämnar vidare. Då kan du upptäcka saknade eller felaktiga värden innan nästa verktyg använder underlaget. Noden är bara till för testet och tas bort när kontrollen är klar.

---

## Del 14: Lämna ärendet till agenten

Lägg till en nod under kontrollmeddelandet med **Variabelhantering** > **Ange ett variabelvärde**.

![Menyn för att lägga till den sista variabelnoden](../../assets/standard-advanced/chap06/55.png)

Byt namn på noden till:

```text
Lämna ärendet till agenten
```

Öppna **Ange variabel** och sök efter:

```text
answered
```

Välj ämnets befintliga utdatavariabel.

![Variabelväljaren med ämnets answered-utdata](../../assets/standard-advanced/chap06/56.png)

Under **Till värde** öppnar du fliken **Formel** och anger:

```powerfx
false
```

![Formeln false med typen Boolean och godkänd utdata](../../assets/standard-advanced/chap06/57.png)

Kontrollera att formelfönstret visar typen **Boolean** och en grön bock. Välj sedan **Infoga**.

Avslutningen ska nu innehålla det tillfälliga kontrollmeddelandet mellan `Skapa verifierat underlag` och `Lämna ärendet till agenten`.

![Ämnets avslutning med det tillfälliga kontrollmeddelandet](../../assets/standard-advanced/chap06/58.png)

`answered = false` betyder inte att ämnet misslyckades. Det betyder att ämnet har verifierat underlaget och att agenten ska fortsätta med nästa del av processen.

Välj **Spara**.

---

## Del 15: Uppdatera agentens instruktioner

Gå tillbaka till agentens **Översikt** och öppna instruktionerna. Lägg in följande block före avsnittet **Regler**:

```text
Felanmälan
Använd /Rapportera utrustningsfel när användaren rapporterar fel, skada, läckage, driftstopp, onormalt ljud eller en annan avvikelse på produktionsutrustning.

När ämnet har körts ska du läsa dess answered-utdata:

- Om värdet är true har ämnet redan hanterat begäran. Upprepa inte svaret.
- Om värdet är false ska du fortsätta med MaintenanceContext som verifierat underlag.

Ändra eller gissa inte värden som ämnet har verifierat eller räknat fram.
```

Skriv `/` efter ordet **Använd** och välj ämnet `Rapportera utrustningsfel` i listan.

![Instruktionsfältets meny med ämnet Rapportera utrustningsfel](../../assets/standard-advanced/chap06/59.png)

Ämnesnamnet visas som ett markerat objekt när referensen har infogats. Då pekar instruktionen på det riktiga ämnet i stället för att bara nämna namnet som vanlig text.

![Instruktionerna med en riktig referens till Rapportera utrustningsfel](../../assets/standard-advanced/chap06/60.png)

Välj **Spara**.

---

## Del 16: Testa och ta bort kontrollmeddelandet

Öppna testchatten och kör igenom en felanmälan med en felbild. Fortsätt tills ämnet har verifierat objektet och påverkan.

Kontrollmeddelandet ska först visa en kompakt JSON-sträng med `MaintenanceContext`. Därefter kan agenten sammanfatta samma underlag med läsbara namn och värden. Formuleringen kan variera, men kontrollera särskilt att objekt-ID, felbeskrivning, påverkan, prioritet, kompetenskrav och serviceform stämmer.

![Testchatten med MaintenanceContext och agentens sammanfattning](../../assets/standard-advanced/chap06/61.png)

När värdena stämmer går du tillbaka till ämnet. Öppna menyn på noden `Undersök MaintenanceContext` och välj **Ta bort**.

![Menyn för att ta bort kontrollmeddelandet](../../assets/standard-advanced/chap06/62.png)

Välj **Spara**. Den råa JSON-strängen ska inte visas för användaren i det färdiga flödet. Agenten får fortfarande samma värden genom ämnets utdata `MaintenanceContext`.

---

!!! success "Objektet verifieras nu mot T-Berg D&U"
    Ämnet kan verifiera objekt-ID, hämta objektdata, beräkna prioritet och lämna ett strukturerat `MaintenanceContext` till agenten. I nästa kapitel ansluter vi T-Berg DU MCP för att hämta felhistorik, tekniker och reservdelar.
