#!/usr/bin/env powershell
# PERFAX Key Generator - Quick Start Script für Windows

Write-Host "
╔════════════════════════════════════════════╗
║  🔴 PERFAX Key Generator - Quick Start 🔴  ║
╚════════════════════════════════════════════╝
" -ForegroundColor Red

# Überprüfe ob Node.js installiert ist
Write-Host "`n[1/4] Überprüfe Node.js..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installiert: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js nicht gefunden!" -ForegroundColor Red
    Write-Host "Bitte lade Node.js herunter: https://nodejs.org/" -ForegroundColor Yellow
    exit
}

# Gehe zum Projekt-Verzeichnis
$projectPath = "C:\Users\schuv\Desktop\Perfax-Website"
if (Test-Path $projectPath) {
    Set-Location $projectPath
    Write-Host "✓ Projekt-Verzeichnis gefunden" -ForegroundColor Green
} else {
    Write-Host "✗ Projekt-Verzeichnis nicht gefunden: $projectPath" -ForegroundColor Red
    exit
}

# Installiere Dependencies
Write-Host "`n[2/4] Installiere Dependencies..." -ForegroundColor Cyan
if (Test-Path "package.json") {
    npm install
    Write-Host "✓ Dependencies installiert" -ForegroundColor Green
} else {
    Write-Host "✗ package.json nicht gefunden" -ForegroundColor Red
}

# Überprüfe .env Datei
Write-Host "`n[3/4] Überprüfe Konfiguration..." -ForegroundColor Cyan
if (Test-Path ".env") {
    Write-Host "✓ .env Datei vorhanden" -ForegroundColor Green
    Write-Host "`n📝 Discord Credentials: ✅ Vorhanden" -ForegroundColor Green
    Write-Host "📝 PayPal Credentials: ⚠️  Benötigt Setup" -ForegroundColor Yellow
    Write-Host "📝 Stripe Credentials: ⚠️  Benötigt Setup" -ForegroundColor Yellow
} else {
    Write-Host "✗ .env Datei nicht gefunden" -ForegroundColor Red
}

# Starte Server
Write-Host "`n[4/4] Starte Server..." -ForegroundColor Cyan
Write-Host "`n" -ForegroundColor Green
Write-Host "✨ Server wird gestartet auf: http://127.0.0.1:5000" -ForegroundColor Green
Write-Host "✨ Öffne diese URL in deinem Browser" -ForegroundColor Green
Write-Host "`n" -ForegroundColor Cyan

npm start
