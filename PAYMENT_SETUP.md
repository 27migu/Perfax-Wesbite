# 💳 PayPal & Stripe Integration - Detaillierte Setup-Anleitung

## 🅿️ PayPal Integration

### Schritt 1: PayPal Business Account mit deiner E-Mail

Du hast bereits: `schuvikowski.san@gmail.com`

**Option A: Bestehenden Account nutzen**
1. Gehe zu: https://www.paypal.com/de/signin
2. Melde dich mit `schuvikowski.san@gmail.com` an
3. Falls noch kein Business Account → Upgrade durchführen

**Option B: Neuen Account erstellen**
1. Gehe zu: https://www.paypal.com/de/signup
2. Wähle **Business Account**
3. Gib deine E-Mail ein: `schuvikowski.san@gmail.com`

---

### Schritt 2: Developer Sandbox Setup

1. Gehe zu: https://developer.paypal.com/dashboard/
2. **Melde dich an** mit deinem PayPal Account
3. Navigiere zu: **Apps & Credentials**
4. Stelle sicher **"Sandbox"** ist ausgewählt (nicht "Live")

---

### Schritt 3: Credentials auslesen

Auf der **Apps & Credentials** Seite siehst du:

**Sandbox-Bereich:**
```
REST API Signature
├── Client ID:     Alxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
└── Secret:        EUxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Kopiere diese Werte!**

---

### Schritt 4: In .env eintragen

Öffne `.env` Datei und ersetze:

```env
PAYPAL_CLIENT_ID=ALxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYPAL_CLIENT_SECRET=EUxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYPAL_MODE=sandbox
```

---

### Schritt 5: Test-Konten erstellen

Im **PayPal Developer Dashboard** → **Sandbox Accounts**

1. **Seller/Business Account** (für Zahlungsempfang)
   ```
   E-Mail: PAYPAL_SELLER@business.example.com
   Passwort: Test1234!
   ```

2. **Buyer/Personal Account** (für Test-Zahlungen)
   ```
   E-Mail: PAYPAL_BUYER@personal.example.com
   Passwort: Test1234!
   ```

---

### Schritt 6: Test-Zahlung durchführen

1. Starte deinen Server: `npm start`
2. Öffne: `http://127.0.0.1:5000`
3. Melde dich an
4. Akzeptiere AGB
5. Wähle **Premium** (9,99€)
6. Klicke **"PayPal"**
7. **Login mit Buyer Account:**
   ```
   E-Mail: PAYPAL_BUYER@personal.example.com
   Passwort: Test1234!
   ```
8. Klicke **"Bezahlen"**
9. ✅ Key sollte generiert werden!

---

## 🔐 Stripe Integration

### Schritt 1: Stripe Account erstellen

1. Gehe zu: https://stripe.com/
2. Klicke **"Jetzt starten"**
3. Melde dich mit einer E-Mail an
4. Verifiziere deine E-Mail

---

### Schritt 2: API Keys auslesen

Im **Stripe Dashboard:**
1. Navigiere zu: **Developers** → **API Keys**
2. Stelle sicher du bist im **"Test Mode"** (nicht Live)

Du siehst zwei Keys:

```
Test Mode:
├── Publishable Key: pk_test_XXXXXXXXXXXXXXXXXXXXX
└── Secret Key:      sk_test_XXXXXXXXXXXXXXXXXXXXX
```

**Kopiere diese Werte!**

---

### Schritt 3: In .env eintragen

Öffne `.env` und ersetze:

```env
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_test_XXXXXXXXXXXXXXXXXXXXX
```

---

### Schritt 4: Webhook konfigurieren

1. Im Stripe Dashboard → **Developers** → **Webhooks**
2. Klicke **"Endpoint hinzufügen"**
3. Endpoint-URL:
   ```
   http://127.0.0.1:5000/stripe-webhook
   ```
4. **Events auswählen:**
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Klicke **"Endpoint hinzufügen"**
6. Kopiere **Webhook Secret** und setze es in `.env`

---

### Schritt 5: Test-Kartennummern

Stripe stellt Test-Kartennummern bereit:

| Kartennummer | CVV | Ablauf | Beschreibung |
|---|---|---|---|
| 4242 4242 4242 4242 | Beliebig | Zukunft | Erfolgreiche Zahlung |
| 4000 0000 0000 0002 | Beliebig | Zukunft | Zahlung wird abgelehnt |
| 5555 5555 5555 4444 | Beliebig | Zukunft | Mastercard Test |
| 3782 822463 10005 | Beliebig | Zukunft | American Express |

---

### Schritt 6: Test-Zahlung durchführen

1. Starte Server: `npm start`
2. Öffne: `http://127.0.0.1:5000`
3. Melde dich an
4. Akzeptiere AGB
5. Wähle **Enterprise** (29,99€)
6. Klicke **"Stripe"**
7. Gib Test-Karte ein:
   ```
   Kartennummer: 4242 4242 4242 4242
   Ablauf: 12/25
   CVC: 123
   Name: Test User
   ```
8. Klicke **"Bezahlen"**
9. ✅ Key sollte generiert werden!

---

## 🔄 Zahlungsfluss in Aktion

### FREE Plan (Kein Payment nötig)
```
User klickt FREE
     ↓
Validierung (AGB gecheckt?)
     ↓
Key generiert direkt
     ↓
Firebase speichert Key mit paid=false
```

### PREMIUM/ENTERPRISE Plan (Payment erforderlich)
```
User klickt Plan
     ↓
AGB-Validierung
     ↓
Modal öffnet: Zahlungsart wählen
     ↓
├─ PayPal ausgewählt
│  ├─ Order wird erstellt
│  ├─ User zur PayPal weitergeleitet
│  ├─ PayPal-Zahlung durchgeführt
│  ├─ Callback zur App
│  └─ Key generiert + Firebase speichern
│
└─ Stripe ausgewählt
   ├─ Payment Intent wird erstellt
   ├─ Stripe Zahlungsformular
   ├─ Zahlung verarbeitet
   └─ Key generiert + Firebase speichern

Fehlerfall:
    User bricht ab
         ↓
    Error-Nachricht anzeigen
         ↓
    Zurück zu Plan-Auswahl
```

---

## 📊 Firebase Struktur für Zahlungen

```json
{
  "keys": {
    "PREM-ABC123-XYZ1": {
      "tier": "Premium",
      "discordId": "123456789",
      "username": "TestUser_1234",
      "email": "test@example.com",
      "createdAt": "2024-01-01T10:00:00Z",
      "expiresAt": "2025-01-01T10:00:00Z",
      "active": true,
      "status": "valid",
      "paid": true,
      "paymentInfo": {
        "provider": "stripe",
        "amount": 9.99,
        "currency": "EUR",
        "transactionId": "pi_1234567890"
      }
    },
    "FREE-XYZ789-ABC2": {
      "tier": "Free",
      "discordId": "987654321",
      "username": "User_5678",
      "email": "user@example.com",
      "createdAt": "2024-01-02T15:30:00Z",
      "expiresAt": "2024-02-01T15:30:00Z",
      "active": true,
      "status": "valid",
      "paid": false
    }
  }
}
```

---

## 🧪 Debugging & Fehlerbehandlung

### PayPal Error: "Invalid credentials"
```
✓ Client ID korrekt?
✓ Client Secret korrekt?
✓ Sandbox vs Live Mode stimmt überein?
✓ Credentials frisch aus Developer Dashboard?
```

### PayPal Error: "Order Creation Failed"
```
✓ Amount format: 9.99 (nicht 999)
✓ Currency: EUR (nicht €)
✓ Alle erforderlichen Felder vorhanden?
```

### Stripe Error: "Invalid API Key"
```
✓ Secret Key (sk_test_...) benutzt?
✓ Publishable Key (pk_test_...) im Frontend?
✓ Kein Live Mode mit Test Keys gemischt?
```

### Webhook funktioniert nicht?
```
✓ Webhook URL erreichbar?
✓ Webhook Secret in .env korrekt?
✓ Firewall blockiert nicht?
✓ Request Signaturen validiert?
```

---

## 🚀 Production Setup

Wenn du live gehen möchtest:

### PayPal
```env
PAYPAL_MODE=live
# Nutze LIVE Client ID und Secret von PayPal
```

### Stripe
```env
# Wechsle zu Live Secret Key
STRIPE_SECRET_KEY=sk_live_XXXXXXXXXXXXX
```

### Discord
```env
# Ändere Redirect URI zu deiner Production Domain
DISCORD_REDIRECT_URI=https://yourdomain.com/callback/
```

---

## 💾 Zusammenfassung der erforderlichen Keys

```
┌─────────────────────────────────────────┐
│ Discord (✅ Vorhanden)                   │
├─────────────────────────────────────────┤
│ Client ID:     1484892924981415966     │
│ Client Secret: gbV9J1EZrqJXuPCwPF...   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ PayPal (⚠️ Benötigt Setup)               │
├─────────────────────────────────────────┤
│ Client ID:     [Von PayPal Dashboard]   │
│ Client Secret: [Von PayPal Dashboard]   │
│ Account:       schuvikowski.san@...     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Stripe (⚠️ Benötigt Setup)               │
├─────────────────────────────────────────┤
│ Secret Key:    [Von Stripe Dashboard]   │
│ Webhook Secret: [Neu generiert]         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Firebase (✅ Vorhanden)                  │
├─────────────────────────────────────────┤
│ URL: prefax-2026-default-rtdb...        │
└─────────────────────────────────────────┘
```

---

## ✅ Fertig!

Du hast jetzt:
- ✅ Discord OAuth integriert
- ✅ PayPal Setup gelernt
- ✅ Stripe Setup gelernt
- ✅ Test-Zahlungen implementiert
- ✅ Fehlerbehandlung aktiviert
- ✅ Firebase Integration aktiv

**Viel Erfolg beim Testen! 🚀**
