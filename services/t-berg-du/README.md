# T-Berg D&U

Lokalt demosystem för en intern drift- och underhållsagent i Microsoft Copilot Studio.

Systemet innehåller:

- ett objektregister som används av en custom connector;
- felhistorik, tidigare arbetsordrar, teknikertillgänglighet och reservdelar som MCP-verktyg;
- skapande av arbetsorder efter godkännande;
- tidsbegränsade testnycklar och separata arbetsytor för kursdeltagare;
- Turnstile-verifiering och begränsningar mot automatiserat missbruk.

## Lokal körning

Projektet kräver Node.js 22.13 eller senare.

```powershell
npm install
npm run dev:all
```

Webbgränssnitt: `http://localhost:3000`

API och MCP: `http://localhost:8787`

I lokal utveckling visas ett tydligt testläge. Välj **Skapa testnyckel** i webbgränssnittet. Nyckeln gäller som standard i 24 timmar och används i både REST-connectorn och MCP-anslutningen.

## Nyckelflödet

1. Besökaren verifieras med Cloudflare Turnstile.
2. `POST /access/sessions` skapar en slumpmässig nyckel och en privat arbetsyta.
3. Endast en SHA-256-hash av nyckeln lagras på servern.
4. Nyckeln skickas i headern `x-workshop-key` för REST och MCP.
5. Arbetsytan härleds från nyckeln och kan inte väljas av klienten eller agenten.
6. Nyckel och arbetsyta rensas automatiskt när giltighetstiden har gått ut.

Lokalt används en särskild utvecklingstoken när Turnstile-variablerna saknas. För en publicerad miljö ska `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` och `TURNSTILE_ALLOWED_HOSTNAME` anges. Turnstile-hemligheten får aldrig läggas i frontend eller kursmaterial.

## Viktiga endpoints

- `GET /health`
- `POST /access/sessions`
- `GET /access/session`
- `GET /api/assets/{assetId}`
- `GET /api/work-orders`
- `POST /api/work-orders`
- `POST /api/reset`
- `POST /mcp`

## MCP-verktyg

- `get_fault_history`
- `find_available_technicians`
- `find_spare_parts`
- `create_work_order`

`get_fault_history` returnerar all underhållshistorik för objektet och tidigare arbetsordrar i deltagarens arbetsyta. En angiven felkod används för att räkna träffar, inte för att filtrera bort annan historik.

Tekniker som har en arbetsorder med status `Pågår` räknas som upptagna. Planerade order blockerar inte teknikern, men tekniker med färre planerade order visas först. En tilldelad P1-order får status `Pågår`; övriga tilldelade order får status `Planerad`.

`find_spare_parts` kontrollerar reservdelar för interna objekt när driften är stoppad eller samma felkod har förekommit tidigare. Svaret innehåller artikelnummer, lagersaldo och ledtid. Verktyget reserverar eller beställer inget.

## Test

Starta API-servern och kör sedan:

```powershell
npm run test:local
```

För att se hela flödet direkt i terminalen:

```powershell
npm run demo:all
```

Kommandot skapar en lokal testnyckel, anropar connectorns objektuppslag, listar och kör MCP-verktygen, skapar en arbetsorder och skriver ut arbetsytans resultat. Delarna kan även köras separat:

```powershell
npm run demo:connector
npm run demo:mcp
```

Återanvänd en nyckel från webbgränssnittet med exempelvis:

```powershell
npm run demo:connector -- --key tberg_DIN_NYCKEL --asset LO-VA-012
npm run demo:mcp -- --key tberg_DIN_NYCKEL
```

Objekt-ID följer formatet `LO-TT-NNN`: `LO` markerar ett Lyserno-objekt, `TT` är en tvåställig typkod och `NNN` är ett tresiffrigt löpnummer. Exempel: `LO-PU-017` och `LO-VA-012`.

OpenAPI 2.0-reserven för custom connector finns i `openapi/tberg-du-connector.swagger.json`.

Testsviten skapar två separata testnycklar och verifierar att REST- och MCP-skrivningar aldrig läcker mellan deras arbetsytor.

## Lagringslägen

Standardläget använder `.data/runtime.json` och är avsett för lokal utveckling. Azure-läget aktiveras med:

```text
STORAGE_BACKEND=azure
AZURE_STORAGE_ACCOUNT=sttbergdudemo8053
```

Azure-läget använder `DefaultAzureCredential`. I Container Apps innebär det API-appens Managed Identity. Följande tabeller skapas automatiskt:

- `TbergAccessSessions`
- `TbergWorkspaces`
- `TbergWorkOrders`

## Containerbilder

Projektet har separata containerbilder för webb och API:

```powershell
docker build -f Dockerfile.api -t tberg-du-api:local .
docker build -f Dockerfile.web -t tberg-du-web:local .
```

Starta de färdiga bilderna lokalt med:

```powershell
docker run -d --rm --name tberg-du-api -p 8790:8787 -e NODE_ENV=development tberg-du-api:local
docker run -d --rm --name tberg-du-web -p 3010:3000 -e API_BASE_URL=http://localhost:8790 tberg-du-web:local
```

Öppna sedan `http://localhost:3010`. `NODE_ENV=development` aktiverar endast den lokala Turnstile-testtokenen. En container som körs i produktionsläge vägrar skapa testnycklar tills en riktig `TURNSTILE_SECRET_KEY` har konfigurerats.

`infra/publish-images.ps1` bygger och publicerar båda bilderna till ett valfritt register. Ett publikt GitHub Container Registry-paket kan användas utan ett avgiftsbelagt Azure Container Registry.

## Azure-distribution

`infra/deploy-azure.ps1` skapar eller uppdaterar:

- Container Apps-miljön `cae-tberg-du-demo-swc` utan beständig logglagring;
- API/MCP-appen `ca-tberg-du-api` på port 8787;
- webbappen `ca-tberg-du-web` på port 3000;
- skalning mellan 0 och 1 replika;
- API-appens systemtilldelade Managed Identity;
- rollen Storage Table Data Contributor på lagringskontot;
- runtime-adresser och CORS mellan apparna.

Exempel:

```powershell
.\infra\deploy-azure.ps1 `
  -ApiImage ghcr.io/ANVANDARE/tberg-du-api:latest `
  -WebImage ghcr.io/ANVANDARE/tberg-du-web:latest
```

När webbappens Azure-adress är känd skapas en Cloudflare Turnstile-widget. Därefter kopplas nycklarna utan ombyggnad:

```powershell
.\infra\configure-turnstile.ps1 -SiteKey DIN_SITEKEY
```

Skriptet frågar därefter efter Turnstile Secret Key med maskerad inmatning. Lägg inte hemligheten i kommandoraden, repot eller kursmaterialet.

## Inför publicering

Uppdatera host och HTTPS-schema i OpenAPI-filen till den publicerade API-adressen innan connectorlabben distribueras. Kör alltid ett fleranvändartest efter publicering och kontrollera att API-appens Managed Identity kan skapa och läsa tabeller.
