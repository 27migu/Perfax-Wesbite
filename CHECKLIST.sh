#!/bin/bash
# PERFAX Setup Checklist - Schritt für Schritt

echo "🔴 PERFAX Key Generator - Setup Checklist 🔴"
echo "=============================================="
echo ""

# Checklist Items
checklist=(
    "✅ Node.js installiert (node -v prüfen)"
    "✅ Perfax-Website Verzeichnis vorhanden"
    "✅ index.html existiert"
    "✅ server.js existiert"
    "✅ package.json existiert"
    "✅ .env Datei vorhanden"
    "✅ Discord Credentials vorhanden (Discord Client ID & Secret)"
    "⚠️ PayPal Credentials eintragen (Optional)"
    "⚠️ Stripe Credentials eintragen (Optional)"
    "⚠️ Firebase URL in index.html korrekt"
    "📝 Alle Dependencies installiert (npm install)"
    "🚀 Server läuft auf http://127.0.0.1:5000"
    "🧪 Discord Login funktioniert"
    "🧪 Free Key wird generiert"
    "🧪 Payment Modal öffnet sich"
    "✨ Alles funktioniert!"
)

echo "Setup Checklist:"
echo "==============="
for item in "${checklist[@]}"
do
    echo "☐ $item"
done

echo ""
echo "📋 Detaillierte Anleitung:"
echo "========================="
echo "1. Öffne: SETUP.md"
echo "2. Folge den Installationsschritten"
echo "3. Öffne: PAYMENT_SETUP.md für PayPal/Stripe"
echo "4. Starte mit: npm start"
echo "5. Öffne Browser auf: http://127.0.0.1:5000"
echo ""

read -p "Drücke Enter zum Fortfahren..."
