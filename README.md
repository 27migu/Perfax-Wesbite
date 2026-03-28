# 📁 PERFAX Website - Dateienstruktur

```
Perfax-Website/
│
├── 📄 index.html                    ← Frontend (HTML/CSS/JavaScript)
├── 📄 server.js                     ← Backend (Node.js/Express)
├── 📄 package.json                  ← NPM Dependencies
├── 📄 .env                          ← Umgebungsvariablen (GEHEIM!)
├── 📄 START.ps1                     ← Quick Start Script (Windows)
│
├── 📋 SETUP.md                      ← Installation & Setup Guide
├── 📋 PAYMENT_SETUP.md              ← PayPal & Stripe Setup
└── 📋 README.md                     ← Diese Datei

```

---

## 📄 Datei-Beschreibungen

### **index.html** 
Frontend-Datei mit:
- 🎨 Neon Red Design
- 🔐 Discord Login Button
- 💳 Payment Modal (Stripe/PayPal)
- 🔑 Key Display & Copy Button
- 📱 Responsive für PC/Mobile

**Zu bearbeiten für:**
- Design-Änderungen
- Neue Features im Frontend
- Error Messages anpassen

---

### **server.js**
Backend-Server mit:
- 🔐 Discord OAuth Handler
- 💳 Stripe Payment Processing
- 🅿️ PayPal Order Creation
- 📊 Webhook Handlers
- 🔄 Callback Management

**Zu bearbeiten für:**
- API Integration
- Payment Logic
- Backend Features

---

### **package.json**
NPM Packages/Dependencies:
```json
{
  "express": "Web Framework",
  "stripe": "Stripe Integration",
  "axios": "HTTP Requests",
  "dotenv": "Environment Variables",
  "cors": "Cross-Origin Requests",
  "firebase-admin": "Firebase Backend"
}
```

**Bei neuen Packages:**
```bash
npm install PACKAGE_NAME
```

---

### **.env**
**⚠️ SICHERHEIT: Niemals öffentlich teilen!**

Enthält:
```env
DISCORD_CLIENT_ID=1484892924981415966
DISCORD_CLIENT_SECRET=gbV9J1EZrqJXuPCwPFF6Ktm2Gf6TPj-b
PAYPAL_CLIENT_ID=ALxxxx...
PAYPAL_CLIENT_SECRET=EUxxxx...
STRIPE_SECRET_KEY=sk_test_xxxx...
PORT=5000
```

**Gitignore Rule:**
```
.env      ← Nicht in Git commiten!
```

---

### **START.ps1**
PowerShell Script zum schnellen Starten:
```powershell
.\START.ps1
```

Was es macht:
1. Überprüft Node.js
2. Installiert Dependencies
3. Prüft .env Datei
4. Startet Server

---

## 🔄 Workflow

### Development Mode
```bash
# Terminal 1: Backend
npm start
# Server läuft auf http://127.0.0.1:5000

# Terminal 2: Frontend Änderungen
# Bearbeite index.html und browser auto-refreshed
```

### Production Mode
```bash
NODE_ENV=production npm start
```

---

## 📊 Dateigrößen

```
index.html      ~45 KB  (HTML/CSS/JavaScript)
server.js       ~15 KB  (Backend Code)
package.json    ~1 KB   (Dependencies)
.env            ~0.5 KB (Secrets)
```

---

## 🔐 Sicherheits-Checkliste

- [ ] `.env` ist in `.gitignore`
- [ ] Secrets werden NICHT in Git commitet
- [ ] Discord Secret nicht im Frontend
- [ ] PayPal Secret nicht im Frontend
- [ ] Stripe Secret nur im Backend
- [ ] HTTPS verwenden in Production
- [ ] Firebase Rules restriktiv setzen
- [ ] Rate Limiting implementieren

---

## 📝 Änderungen vornehmen

### Frontend-Änderungen (index.html)
1. Öffne `index.html`
2. Ändere HTML/CSS/JavaScript
3. Speichere Datei
4. Browser auto-refreshed
5. Teste neue Features

### Backend-Änderungen (server.js)
1. Öffne `server.js`
2. Ändere Code
3. Speichere Datei
4. Server startet automatisch neu (mit nodemon)
5. Teste mit Browser

### Config-Änderungen (.env)
1. Öffne `.env`
2. Ändere Werte
3. Speichere Datei
4. Starte Server neu: `npm start`

---

## 🚀 Deployment Vorbereitung

### Lokale Tests
- [ ] Free Key generation funktioniert
- [ ] PayPal Login funktioniert
- [ ] Stripe Payment funktioniert
- [ ] Keys landen in Firebase
- [ ] Error Handling funktioniert

### Deployment
```bash
# Auf Server pushen
git push heroku main

# Oder zu Vercel deployen
vercel --prod
```

### Post-Deployment
- [ ] Live-Mode in PayPal aktivieren
- [ ] Live-Keys in Stripe benutzen
- [ ] .env auf Server aktualisieren
- [ ] HTTPS erzwingen
- [ ] Firebase Rules anpassen

---

## 📞 Support

**Problem**: Files nicht gefunden
**Lösung**: Stelle sicher du bist im korrekten Verzeichnis:
```
cd C:\Users\schuv\Desktop\Perfax-Website
```

**Problem**: Server startet nicht
**Lösung**: Überprüfe Fehler mit:
```bash
npm start
# Lese Error Messages gründlich
```

**Problem**: Payment funktioniert nicht
**Lösung**: Siehe `PAYMENT_SETUP.md`

---

## ✅ Alles erledigt!

Du hast jetzt ein komplettes PERFAX Key Generator System mit:

✅ Frontend (Neon Red Design)
✅ Backend (Express Server)
✅ Discord OAuth
✅ PayPal Integration
✅ Stripe Integration
✅ Firebase Database
✅ Automatische Key-Generierung
✅ Fehlerbehandlung

**Viel Erfolg! 🔴🔥**
