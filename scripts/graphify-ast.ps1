[CmdletBinding()]
param(
    [string]$Target = ".",
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$root = (Resolve-Path -LiteralPath $Target).Path
$canonical = Join-Path $root "docs\graphify-out"
$generated = Join-Path $root "graphify-out"

if (-not $Force -and (Test-Path -LiteralPath (Join-Path $canonical "graph.json"))) {
    throw "Graphify output already exists. Use -Force to rebuild it."
}

if (Test-Path -LiteralPath $generated) {
    Remove-Item -LiteralPath $generated -Recurse -Force
}

graphify update $root --force
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

if (-not (Test-Path -LiteralPath (Join-Path $generated "graph.json"))) {
    throw "Graphify did not create $generated\graph.json"
}

if (Test-Path -LiteralPath $canonical) {
    Remove-Item -LiteralPath $canonical -Recurse -Force
}
Move-Item -LiteralPath $generated -Destination $canonical

Write-Host "Done. AST-only canonical output: $canonical"
