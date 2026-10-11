Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "          Starting MEDICO Healthcare AI" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path "node_modules")) {
    Write-Host "[1/2] Installing dependencies..." -ForegroundColor Yellow
    & npm.cmd install
}

Write-Host "[2/2] Launching MEDICO dev server..." -ForegroundColor Green
& npm.cmd run dev
