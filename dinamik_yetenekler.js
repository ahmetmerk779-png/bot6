const mcData = require('minecraft-data');

exports.pusula_ve_sec = async function(bot, hedefOyun) {
    const pusula = bot.inventory.items().find(item => item.name.includes('compass'));
    if (!pusula) return bot.chat('Pusula yok!');
    await bot.equip(pusula, 'hand');
    bot.activateItem();

    bot.once('windowOpen', async (window) => {
        const aranan = hedefOyun.toLowerCase();
        let esya = window.items().find(i => i && (i.customName?.toLowerCase().includes(aranan) || i.name.includes(aranan)));
        if (esya) {
            await bot.clickWindow(esya.slot, 0, 0);
            bot.once('windowOpen', (altMenu) => {
                let altEsya = altMenu.items().find(i => i && !i.name.includes('glass_pane'));
                if (altEsya) bot.clickWindow(altEsya.slot, 0, 0);
            });
        }
    });
};

exports.esya_uret = async function(bot, uretilecek, miktar = 1) {
    const data = require('minecraft-data')(bot.version);
    const item = data.itemsByName[uretilecek];
    if (!item) return bot.chat('Eşya bulunamadı.');
    const tarif = bot.recipesFor(item.id, null, 1, null)[0];
    if (!tarif) return bot.chat('Tarif bulunamadı.');
    
    let masa = tarif.requiresTable ? bot.findBlock({ matching: data.blocksByName.crafting_table.id, maxDistance: 32 }) : null;
    await bot.craft(tarif, miktar, masa);
};

exports.savas = async function(bot, hedefIsmi) {
    const hedef = bot.nearestEntity(e => e.username === hedefIsmi || e.name === hedefIsmi);
    if (!hedef) return bot.chat('Hedef yok.');
    bot.pvp.attack(hedef);
};
