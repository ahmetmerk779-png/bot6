const express = require('express');
const mineflayer = require('mineflayer');
const { pvp } = require('mineflayer-pvp');
const app = express();
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let botInstance = null; // Çalışan botu burada tutuyoruz

// Basit bir HTML formu döndürür
app.get('/', (req, res) => {
    res.send(`
        <h1>Minecraft Bot Kontrol Paneli</h1>
        <form action="/baslat" method="POST">
            <input type="text" name="host" placeholder="Sunucu IP" required><br>
            <input type="text" name="username" placeholder="Kullanıcı Adı" required><br>
            <input type="text" name="groq_key" placeholder="Groq API Key" required><br>
            <button type="submit">Botu Başlat</button>
        </form>
    `);
});

// Botu başlatma rotası
app.post('/baslat', (req, res) => {
    const { host, username, groq_key } = req.body;

    // Önceki botu durdur
    if (botInstance) {
        botInstance.quit();
    }

    // Yeni botu başlat
    botInstance = mineflayer.createBot({
        host: host,
        username: username,
        version: '1.21.11'
    });

    botInstance.loadPlugin(pvp);
    
    botInstance.on('spawn', () => {
        console.log(`${username} sunucuya giriş yaptı!`);
    });

    res.send(`Bot başlatıldı! IP: ${host}. <a href="/">Geri dön</a>`);
});

app.listen(3000, () => console.log('Panel http://localhost:3000 adresinde çalışıyor.'));
