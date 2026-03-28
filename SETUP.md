# 🔴 PERFAX Key Generator - Setup Guide

## 📋 Voraussetzungen

- **Node.js** (v16+) - [Download](https://nodejs.org/)
- **Discord Developer Account** ✅ (Credentials bereits vorhanden)
- **PayPal Developer Account** - [Developer Sandbox](https://developer.paypal.com/)
- **Stripe Account** - [Stripe Dashboard](https://stripe.com/)
- **Firebase Account** ✅ (Bereits konfiguriert)

---

## 🚀 Installation & Setup

### 1. Dependencies installieren

```bash
cd C:\Users\schuv\Desktop\Perfax-Website
npm install
```

### 2. Umgebungsvariablen konfigurieren

Bearbeite `.env` Datei mit deinen Credentials:

```env
# Discord (✅ Bereits vorhanden)
DISCORD_CLIENT_ID=1484892924981415966
DISCORD_CLIENT_SECRET=gbV9J1EZrqJXuPCwPFF6Ktm2Gf6TPj-b

# PayPal (Benötigt Setup)
PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET=YOUR_PAYPAL_CLIENT_SECRET

# Stripe (Benötigt Setup)
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_test_YOUR_WEBHOOK_SECRET
```

### 3. Server starten

```bash
npm start
```

Server läuft dann auf: `http://127.0.0.1:5000`

---

## 🎮 Discord OAuth Setup

✅ **Schon konfiguriert!**

Deine Discord App:
- **Client ID**: `1484892924981415966`
- **Client Secret**: `gbV9J1EZrqJXuPCwPFF6Ktm2Gf6TPj-b`
- **Redirect URI**: `http://127.0.0.1:5000/callback/`

Der Login-Flow:
1. User klickt "Discord Login"
2. Wird zu Discord-Login weitergeleitet
3. Nach Autorisierung kommt er zur Callback-URL
4. User-Daten (ID, Username, Email) werden abgerufen

---

## 💳 PayPal Setup

### Schritt 1: PayPal Developer Konto erstellen
1. Gehe zu: https://developer.paypal.com/dashboard/
2. Melde dich mit deinem Account an (`schuvikowski.san@gmail.com`)
3. Navigiere zu "Apps & Credentials"
4. Wähle **Sandbox** aus

### Schritt 2: Credentials kopieren
```
Apps & Credentials → Sandbox → Business Account
```

- **Client ID** → Kopiere und setze in `.env`
- **Client Secret** → Kopiere und setze in `.env`

### Schritt 3: In .env eintragen
```env
PAYPAL_CLIENT_ID=HIER_EINTRAGEN
PAYPAL_CLIENT_SECRET=HIER_EINTRAGEN
PAYPAL_MODE=sandbox  # Ändere zu "live" für Production
```

### Zahlungsflow:
1. User wählt Plan (Premium/Enterprise)
2. Klickt "PayPal" im Modal
3. Wird zu PayPal weitergeleitet
4. Nach erfolgreicher Zahlung: **Key wird generiert und in Firebase gespeichert**
5. Bei Abbruch: **Error-Nachricht**

---

## 🔐 Stripe Setup

### Schritt 1: Stripe Account erstellen
1. Gehe zu: https://stripe.com/
2. Klicke "Start now"
3. Melde dich an

### Schritt 2: API Keys finden
```
Dashboard → Developers → API Keys
```

- **Publishable Key** (pk_test_...) → Wird im Frontend genutzt
- **Secret Key** (sk_test_...) → In `.env` eintragen

### Schritt 3: In .env eintragen
```env
STRIPE_SECRET_KEY=sk_test_HIER_EINTRAGEN
```

### Zahlungsflow:
1. User wählt Plan
2. Klickt "Stripe"
3. Zahlung wird verarbeitet
4. **Nach erfolgreicher Zahlung: Key generieren**
5. Bei Fehler: **Error anzeigen**

---

## 📊 Firebase Integration

✅ **Bereits konfiguriert!**

```
Database URL: https://prefax-2026-default-rtdb.europe-west1.firebasedatabase.app/
```

Die Struktur in Firebase:
```
keys/
  ├── FREE-ABC123-XYZ1
  │   ├── tier: "Free"
  │   ├── discordId: "123456789"
  │   ├── username: "TestUser_1234"
  │   ├── email: "test@example.com"
  │   ├── createdAt: "2024-01-01T10:00:00Z"
  │   ├── expiresAt: "2024-01-31T10:00:00Z"
  │   ├── paid: false
  │   └── status: "valid"
  │
  └── PREM-XYZ789-ABC2
      ├── tier: "Premium"
      ├── discordId: "987654321"
      ├── username: "User_5678"
      ├── email: "user@example.com"
      ├── createdAt: "2024-01-02T15:30:00Z"
      ├── expiresAt: "2025-01-02T15:30:00Z"
      ├── paid: true
      └── status: "valid"
```

---

## 🔄 Kompletter Ablauf

```
1. User kommt auf Website
   ↓
2. Klickt "Discord Login"
   ↓
3. Discord Authentifizierung
   ↓
4. User sieht sein Profil + Plans
   ↓
5. Hakt "AGB akzeptieren" an
   ↓
6. Wählt einen Plan:
   ├─ FREE → Direkt Key generieren
   ├─ PREMIUM → PayPal/Stripe Modal öffnet
   │   ├─ Zahlung erfolgreich → Key generieren ✓
   │   └─ Zahlungsabbruch → Error anzeigen ✗
   │
   └─ ENTERPRISE → PayPal/Stripe Modal öffnet
       ├─ Zahlung erfolgreich → Key generieren ✓
       └─ Zahlungsabbruch → Error anzeigen ✗
```

---

## 🧪 Testen im Sandbox Mode

### PayPal Test Accounts
```
Business Account: sb-XXXXX@business.example.com
Buyer Account: sb-YYYYY@personal.example.com
```

### Stripe Test Cards
```
Visa:           4242 4242 4242 4242
Visa (Declined):4000 0000 0000 0002
Mastercard:     5555 5555 5555 4444
```

---

## 📱 Deployment zu Production

### 1. Umgebung ändern
```env
NODE_ENV=production
PAYPAL_MODE=live          # Statt sandbox
STRIPE_LIVE_MODE=true     # Live Keys verwenden
```

### 2. Live Credentials einsetzen
- PayPal Live Client ID/Secret
- Stripe Live Secret Key
- Discord OAuth Redirect URI auf Production URL ändern

### 3. Zu einem Server deployen
- Heroku
- AWS
- DigitalOcean
- Vercel (für Frontend)

---

## 🐛 Fehlerbehandlung

### Discord Login funktioniert nicht?
- ✓ Client ID korrekt?
- ✓ Client Secret vorhanden?
- ✓ Redirect URI stimmt überein?

### PayPal Fehler?
- Prüfe ob PAYPAL_MODE=sandbox ist
- Teste mit Business Account
- Webhook richtig konfiguriert?

### Stripe Fehler?
- Secret Key ist sk_test_... oder sk_live_...?
- Publishable Key im Frontend gesetzt?
- Webhook Secret korrekt?

### Firebase Fehler?
- Database URL korrekt?
- Firestore Rules erlauben Schreiben?
- Authentifizierung aktiviert?

---

## 📞 Support & Troubleshooting

**Problem**: "Invalid Client ID"
**Lösung**: Überprüfe Discord Credentials in `.env`

**Problem**: "PayPal Order Creation Failed"
**Lösung**: Stelle sicher PayPal API Keys sind korrekt

**Problem**: "Firebase Permission Denied"
**Lösung**: Passe Firebase Security Rules an

---

## ✅ Checkliste für Produktivstart

- [ ] Node.js installiert
- [ ] Dependencies mit `npm install` installiert
- [ ] Discord Credentials in `.env` eingetragen ✅
- [ ] PayPal Credentials eingetragen
- [ ] Stripe Credentials eingetragen
- [ ] Firebase konfiguriert ✅
- [ ] Server mit `npm start` gestartet
- [ ] Login auf `http://127.0.0.1:5000` getestet
- [ ] Free Key-Generierung getestet
- [ ] Zahlungsmodal öffnet sich
- [ ] Fehlerbehandlung funktioniert

---

## 🎉 Fertig!

Jetzt hast du ein **vollständig funktionierendes Key Generator System** mit:
- ✅ Discord OAuth Login
- ✅ PayPal & Stripe Zahlungen
- ✅ Firebase Datenbank
- ✅ Neon Red Design
- ✅ Automatische Key-Generierung
- ✅ Fehlerbehandlung

**Los geht's! 🔴🔥**
