const TelegramBot = require('node-telegram-bot-api');
const db = require("../db");

const token = '6908630055:AAGt3tN8_WV-Pz1S6AoxN6gE_CaehRg_Lxg';
const bot = new TelegramBot(token, { polling: false });

const BotTele = (pesan) => {

    let chatIdBot

    const query = `SELECT chatId FROM admin`
    db.query(query,(err,result) => {
        if (err) {
            throw err;
          } else {
            
            chatIdBot = result.map(item => item.chatId);

            Promise.all(chatIdBot.map(chatId => bot.sendMessage(chatId, pesan, { parse_mode: "Markdown" })))
                .then(() => {
                    console.log('Semua pesan terkirim');
                })
                .catch((error) => {
                    console.error('Gagal mengirim pesan:', error);
                });
          }
    })

};

module.exports = {BotTele}