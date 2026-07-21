[CmdletBinding()]
param(
    [string]$Target = ".",
    [switch]$Force
)

$ErrorActionPreference = "Stop"
Write-Warning "graphify-semantic.ps1 is deprecated for RedRise. Semantic Graphify is ignored; running AST-only canonical rebuild instead."
& (Join-Path $PSScriptRoot "graphify-ast.ps1") -Target $Target -Force:$Force
exit $LASTEXITCODE
