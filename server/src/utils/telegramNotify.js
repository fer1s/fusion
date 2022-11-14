const TelegramBot = require('node-telegram-bot-api')

const token = process.env.TELEGRAM_TOKEN
const chatID = process.env.TELEGRAM_CHAT_ID
const bot = new TelegramBot(token)

const notify = (title, description, without_notification ) => {
   if (!token || !chatID) return
   bot.sendMessage(chatID, `*${title}*\n${description}`, { parse_mode: 'Markdown', disable_notification: without_notification ? true : false })
}

module.exports = {
   notify,
}
