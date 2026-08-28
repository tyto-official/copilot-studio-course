[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$SiteKey,

  [Parameter(Mandatory = $true)]
  [string]$SecretKey,

  [string]$ResourceGroup = "rg-tberg-du-demo-neu",
  [string]$ApiAppName = "ca-tberg-du-api",
  [string]$WebAppName = "ca-tberg-du-web"
)

$ErrorActionPreference = "Stop"
$webFqdn = (& az containerapp show --resource-group $ResourceGroup --name $WebAppName --query properties.configuration.ingress.fqdn --output tsv)
if ($LASTEXITCODE -ne 0 -or -not $webFqdn) { throw "Webbappens adress kunde inte läsas." }

az containerapp secret set `
  --resource-group $ResourceGroup `
  --name $ApiAppName `
  --secrets "turnstile-secret=$SecretKey" `
  --output none
if ($LASTEXITCODE -ne 0) { throw "Turnstile-hemligheten kunde inte sparas." }

az containerapp update `
  --resource-group $ResourceGroup `
  --name $ApiAppName `
  --set-env-vars "TURNSTILE_SECRET_KEY=secretref:turnstile-secret" "TURNSTILE_ALLOWED_HOSTNAME=$webFqdn" `
  --output none
if ($LASTEXITCODE -ne 0) { throw "API-appens Turnstile-konfiguration kunde inte uppdateras." }

az containerapp update `
  --resource-group $ResourceGroup `
  --name $WebAppName `
  --set-env-vars "TURNSTILE_SITE_KEY=$SiteKey" `
  --output none
if ($LASTEXITCODE -ne 0) { throw "Webbappens Turnstile-konfiguration kunde inte uppdateras." }

Write-Host "Turnstile är konfigurerat för https://$webFqdn"
