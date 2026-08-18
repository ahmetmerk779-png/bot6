require('dotenv').config();
const mineflayer = require('mineflayer');
const { pvp } = require('mineflayer-pvp');
const { pathfinder } = require('mineflayer-pathfinder');
const Groq = require('groq-sdk');
const yetenekler = require('./dinamik_yetenekler');

const bot = mineflayer.createBot({
    host: process.env.MC_HOST,
    username: process.env.MC_USER,
    version: '1.21.11'
});

bot.loadPlugin(pvp);
bot.loadPlugin(pathfinder);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

bot.on('chat', async (username, message) => {
    if (username === bot.username) return;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: `Komut: ${message}. JSON formatında cevap ver: {"action": "...", "hedef": "..."}` }],
            model: "llama3-70b-8192",
            response_format: { type: "json_object" }
        });

        const komut = JSON.parse(chatCompletion.choices[0].message.content);
        
        if (komut.action === "pusula") await yetenekler.pusula_ve_sec(bot, komut.hedef);
        else if (komut.action === "uret") await yetenekler.esya_uret(bot, komut.hedef);
        else if (komut.action === "savas") await yetenekler.savas(bot, komut.hedef);

    } catch (err) {
        bot.chat('Hata oluştu, kod düzeltiliyor...');
        console.error(err);
    }
});
