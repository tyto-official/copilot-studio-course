[CmdletBinding()]
param(
  [string]$ResourceGroup = "rg-tberg-du-demo-neu",
  [string]$Location = "swedencentral",
  [string]$StorageAccount = "sttbergdudemo8053",
  [string]$EnvironmentName = "cae-tberg-du-demo-swc",
  [string]$ApiAppName = "ca-tberg-du-api",
  [string]$WebAppName = "ca-tberg-du-web",

  [Parameter(Mandatory = $true)]
  [string]$ApiImage,

  [Parameter(Mandatory = $true)]
  [string]$WebImage
)

$ErrorActionPreference = "Stop"
$tableContributorRole = "0a9a7e1f-b9d0-4cc4-a60d-0319b160aaa3"

function Invoke-AzCli {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Arguments)
  & az @Arguments
  if ($LASTEXITCODE -ne 0) { throw "Azure CLI-kommandot misslyckades: az $($Arguments -join ' ')" }
}

Invoke-AzCli account show --output none
Invoke-AzCli provider register --namespace Microsoft.App --wait

$storageId = (& az storage account show --resource-group $ResourceGroup --name $StorageAccount --query id --output tsv)
if ($LASTEXITCODE -ne 0 -or -not $storageId) { throw "Lagringskontot $StorageAccount kunde inte hittas i $ResourceGroup." }

$environmentExists = (& az containerapp env show --resource-group $ResourceGroup --name $EnvironmentName --query name --output tsv 2>$null)
if (-not $environmentExists) {
  Invoke-AzCli containerapp env create `
    --resource-group $ResourceGroup `
    --name $EnvironmentName `
    --location $Location `
    --enable-workload-profiles `
    --logs-destination none `
    --output none
}

$apiExists = (& az containerapp show --resource-group $ResourceGroup --name $ApiAppName --query name --output tsv 2>$null)
if ($apiExists) {
  Invoke-AzCli containerapp update `
    --resource-group $ResourceGroup `
    --name $ApiAppName `
    --image $ApiImage `
    --min-replicas 0 `
    --max-replicas 1 `
    --cpu 0.25 `
    --memory 0.5Gi `
    --set-env-vars `
      STORAGE_BACKEND=azure `
      AZURE_STORAGE_ACCOUNT=$StorageAccount `
      ACCESS_SESSION_HOURS=24 `
      ACCESS_REQUEST_LIMIT=500 `
      ACCESS_WORK_ORDER_LIMIT=20 `
    --output none
  Invoke-AzCli containerapp identity assign --resource-group $ResourceGroup --name $ApiAppName --system-assigned --output none
} else {
  Invoke-AzCli containerapp create `
    --resource-group $ResourceGroup `
    --name $ApiAppName `
    --environment $EnvironmentName `
    --image $ApiImage `
    --ingress external `
    --target-port 8787 `
    --transport auto `
    --min-replicas 0 `
    --max-replicas 1 `
    --cpu 0.25 `
    --memory 0.5Gi `
    --system-assigned `
    --env-vars `
      STORAGE_BACKEND=azure `
      AZURE_STORAGE_ACCOUNT=$StorageAccount `
      ACCESS_SESSION_HOURS=24 `
      ACCESS_REQUEST_LIMIT=500 `
      ACCESS_WORK_ORDER_LIMIT=20 `
    --output none
}

$principalId = (& az containerapp identity show --resource-group $ResourceGroup --name $ApiAppName --query principalId --output tsv)
if ($LASTEXITCODE -ne 0 -or -not $principalId) { throw "API-appens Managed Identity kunde inte läsas." }

& az role assignment create `
  --assignee-object-id $principalId `
  --assignee-principal-type ServicePrincipal `
  --role $tableContributorRole `
  --scope $storageId `
  --output none 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Warning "Rolltilldelningen kan redan finnas. Verifierar den befintliga tilldelningen."
  $roleExists = (& az role assignment list --assignee-object-id $principalId --scope $storageId --query "[?ends_with(roleDefinitionId, '$tableContributorRole')] | length(@)" -o tsv)
  if ($roleExists -eq "0") { throw "Storage Table Data Contributor kunde inte tilldelas API-appen." }
}

$webExists = (& az containerapp show --resource-group $ResourceGroup --name $WebAppName --query name --output tsv 2>$null)
if ($webExists) {
  Invoke-AzCli containerapp update `
    --resource-group $ResourceGroup `
    --name $WebAppName `
    --image $WebImage `
    --min-replicas 0 `
    --max-replicas 1 `
    --cpu 0.25 `
    --memory 0.5Gi `
    --output none
} else {
  Invoke-AzCli containerapp create `
    --resource-group $ResourceGroup `
    --name $WebAppName `
    --environment $EnvironmentName `
    --image $WebImage `
    --ingress external `
    --target-port 3000 `
    --transport auto `
    --min-replicas 0 `
    --max-replicas 1 `
    --cpu 0.25 `
    --memory 0.5Gi `
    --output none
}

$apiFqdn = (& az containerapp show --resource-group $ResourceGroup --name $ApiAppName --query properties.configuration.ingress.fqdn --output tsv)
$webFqdn = (& az containerapp show --resource-group $ResourceGroup --name $WebAppName --query properties.configuration.ingress.fqdn --output tsv)
if (-not $apiFqdn -or -not $webFqdn) { throw "Apparnas publika adresser kunde inte läsas." }

Invoke-AzCli containerapp update `
  --resource-group $ResourceGroup `
  --name $ApiAppName `
  --set-env-vars "CORS_ORIGINS=https://$webFqdn" "TURNSTILE_ALLOWED_HOSTNAME=$webFqdn" `
  --output none

Invoke-AzCli containerapp update `
  --resource-group $ResourceGroup `
  --name $WebAppName `
  --set-env-vars "API_BASE_URL=https://$apiFqdn" `
  --output none

Write-Host "Azure-distributionen är klar."
Write-Host "Webb: https://$webFqdn"
Write-Host "API/MCP: https://$apiFqdn"
Write-Host "Turnstile återstår innan nya testnycklar kan skapas i produktion."
