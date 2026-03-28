/**
 * PERFAX Key Generator - Backend Server
 * Handles Discord OAuth, Stripe & PayPal Payments
 */

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// ============= CONFIGURATION =============
const DISCORD_CLIENT_ID = "1484892924981415966";
const DISCORD_CLIENT_SECRET = "gbV9J1EZrqJXuPCwPFF6Ktm2Gf6TPj-b";
const DISCORD_REDIRECT_URI = "http://127.0.0.1:5000/callback/";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_YOUR_STRIPE_SECRET_KEY";
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "YOUR_PAYPAL_CLIENT_ID";
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || "YOUR_PAYPAL_CLIENT_SECRET";
const PAYPAL_MODE = "sandbox"; // Ändere zu "live" für Production

const stripe = require('stripe')(STRIPE_SECRET_KEY);

// ============= DISCORD OAUTH =============
/**
 * Exchange Discord authorization code for access token
 */
app.post('/discord-callback', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.json({ error: "No authorization code provided" });
    }

    try {
        // Exchange code for access token
        const tokenResponse = await axios.post(
            'https://discord.com/api/oauth2/token',
            new URLSearchParams({
                client_id: DISCORD_CLIENT_ID,
                client_secret: DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: DISCORD_REDIRECT_URI,
                scope: 'identify email'
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const accessToken = tokenResponse.data.access_token;

        // Get user info
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const userData = userResponse.data;

        res.json({
            success: true,
            user: {
                id: userData.id,
                username: userData.username,
                email: userData.email,
                avatar: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
            }
        });

    } catch (error) {
        console.error('Discord OAuth Error:', error.response?.data || error.message);
        res.json({
            error: "Discord authentication failed",
            details: error.message
        });
    }
});

// ============= STRIPE PAYMENT =============
/**
 * Create Stripe Payment Intent
 */
app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency, plan, discordId, username, email } = req.body;

    if (!amount || !plan) {
        return res.json({ error: "Missing required fields" });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency || 'eur',
            description: `PERFAX ${plan} Plan`,
            metadata: {
                plan: plan,
                discordId: discordId,
                username: username,
                email: email
            }
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });

    } catch (error) {
        console.error('Stripe Error:', error.message);
        res.json({
            error: "Payment processing failed",
            details: error.message
        });
    }
});

/**
 * Webhook für Stripe Payment Success
 */
app.post('/stripe-webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET || "whsec_test_secret"
        );

        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            console.log('✓ Payment successful:', paymentIntent.id);
            // Hier könnte man die Zahlung in Firebase speichern
        }

        res.json({ received: true });

    } catch (error) {
        console.error('Webhook Error:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// ============= PAYPAL PAYMENT =============
/**
 * Get PayPal Access Token
 */
async function getPayPalAccessToken() {
    try {
        const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
        const response = await axios.post(
            `https://api.${PAYPAL_MODE}.paypal.com/v1/oauth2/token`,
            'grant_type=client_credentials',
            {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        return response.data.access_token;

    } catch (error) {
        console.error('PayPal OAuth Error:', error.message);
        throw error;
    }
}

/**
 * Create PayPal Order
 */
app.post('/create-paypal-order', async (req, res) => {
    const { amount, currency, plan, discordId, username, email } = req.body;

    if (!amount || !plan) {
        return res.json({ error: "Missing required fields" });
    }

    try {
        const accessToken = await getPayPalAccessToken();

        const orderData = {
            intent: "CAPTURE",
            payer_preferred_locale: "de-DE",
            purchase_units: [{
                amount: {
                    currency_code: currency || "EUR",
                    value: amount.toFixed(2)
                },
                description: `PERFAX ${plan} Plan`,
                custom_id: JSON.stringify({
                    plan: plan,
                    discordId: discordId,
                    username: username,
                    email: email
                })
            }],
            application_context: {
                brand_name: "PERFAX",
                locale: "de-DE",
                landing_page: "BILLING",
                return_url: `http://127.0.0.1:5000/paypal-success`,
                cancel_url: `http://127.0.0.1:5000/paypal-cancel`
            }
        };

        const response = await axios.post(
            `https://api.${PAYPAL_MODE}.paypal.com/v2/checkout/orders`,
            orderData,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const approvalUrl = response.data.links.find(link => link.rel === 'approve')?.href;

        res.json({
            orderId: response.data.id,
            approvalUrl: approvalUrl
        });

    } catch (error) {
        console.error('PayPal Order Creation Error:', error.response?.data || error.message);
        res.json({
            error: "PayPal order creation failed",
            details: error.message
        });
    }
});

/**
 * PayPal Payment Success Redirect
 */
app.get('/paypal-success', async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.redirect('/?error=missing_token');
    }

    try {
        const accessToken = await getPayPalAccessToken();

        const response = await axios.post(
            `https://api.${PAYPAL_MODE}.paypal.com/v2/checkout/orders/${token}/capture`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.status === 'COMPLETED') {
            const customData = JSON.parse(response.data.purchase_units[0].custom_id);
            
            // Hier solltest du die Zahlung in Firebase speichern
            console.log('✓ PayPal Payment Success:', {
                orderId: token,
                plan: customData.plan,
                discordId: customData.discordId
            });

            res.redirect(`/?payment=success&plan=${customData.plan}`);
        } else {
            res.redirect('/?error=payment_not_completed');
        }

    } catch (error) {
        console.error('PayPal Capture Error:', error.response?.data || error.message);
        res.redirect('/?error=payment_capture_failed');
    }
});

/**
 * PayPal Payment Cancel
 */
app.get('/paypal-cancel', (req, res) => {
    console.log('PayPal Payment Cancelled');
    res.redirect('/?error=payment_cancelled');
});

// ============= ROUTES =============
app.get('/', (req, res) => {
    res.sendFile('./index.html');
});

app.get('/callback/', (req, res) => {
    // Discord callback redirect
    const code = req.query.code;
    res.send(`
        <script>
            window.location.href = '/?discord_code=${code}';
        </script>
    `);
});

// ============= SERVER START =============
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║   🔴 PERFAX Key Generator Server 🔴   ║
    ║   Server running on port ${PORT}        ║
    ║   Discord Client ID: ${DISCORD_CLIENT_ID}    ║
    ║   PayPal Mode: ${PAYPAL_MODE.toUpperCase()}                  ║
    ╚════════════════════════════════════════╝
    `);
});

module.exports = app;
