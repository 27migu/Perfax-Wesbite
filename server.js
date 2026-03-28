const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors({
    origin: ['http://localhost:8000', 'http://127.0.0.1:8000', 'https://27migu.github.io'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(express.static('.'));

const DISCORD_CLIENT_ID = "1484892924981415966";
const DISCORD_CLIENT_SECRET = "gbV9J1EZrqJXuPCwPFF6Ktm2Gf6TPj-b";
const DISCORD_REDIRECT_URI_LOCAL = "http://localhost:8000/callback/";
const DISCORD_REDIRECT_URI_PROD = "https://27migu.github.io/Perfax-Website/callback/";

app.post('/discord-callback', async (req, res) => {
    const { code } = req.body;
    const redirectUri = req.headers.origin?.includes('localhost') ? DISCORD_REDIRECT_URI_LOCAL : DISCORD_REDIRECT_URI_PROD;

    if (!code) {
        return res.status(400).json({ success: false, error: "No authorization code provided" });
    }

    try {
        const tokenResponse = await axios.post(
            'https://discord.com/api/oauth2/token',
            new URLSearchParams({
                client_id: DISCORD_CLIENT_ID,
                client_secret: DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
                scope: 'identify email openid'
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const accessToken = tokenResponse.data.access_token;

        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: \Bearer \\
            }
        });

        const userData = userResponse.data;

        res.json({
            success: true,
            user: {
                id: userData.id,
                username: userData.username,
                email: userData.email,
                avatar: \https://cdn.discordapp.com/avatars/\/\.png\
            }
        });
        
        console.log(\✓ Discord Auth Success: \ (\)\);

    } catch (error) {
        console.error('Discord OAuth Error:', error.response?.data || error.message);
        res.status(400).json({
            success: false,
            error: "Discord authentication failed",
            details: error.response?.data?.error_description || error.message
        });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', server: 'PERFAX Backend' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(\
    ╔════════════════════════════════════════╗
    ║   🔴 PERFAX Key Generator Server 🔴   ║
    ║   Server running on http://localhost:\        ║
    ║   Discord Client ID: \    ║
    ╚════════════════════════════════════════╝
    \);
});

module.exports = app;
