[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$Registry,

  [Parameter(Mandatory = $true)]
  [string]$Namespace,

  [string]$Tag = "latest"
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$apiImage = "$Registry/$Namespace/tberg-du-api:$Tag"
$webImage = "$Registry/$Namespace/tberg-du-web:$Tag"

docker build --file (Join-Path $projectRoot "Dockerfile.api") --tag $apiImage $projectRoot
if ($LASTEXITCODE -ne 0) { throw "API-avbildningen kunde inte byggas." }

docker build --file (Join-Path $projectRoot "Dockerfile.web") --tag $webImage $projectRoot
if ($LASTEXITCODE -ne 0) { throw "Webbavbildningen kunde inte byggas." }

docker push $apiImage
if ($LASTEXITCODE -ne 0) { throw "API-avbildningen kunde inte publiceras." }

docker push $webImage
if ($LASTEXITCODE -ne 0) { throw "Webbavbildningen kunde inte publiceras." }

Write-Host "Publicerade avbildningar:"
Write-Host "  $apiImage"
Write-Host "  $webImage"
