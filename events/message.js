const config = require('../config.json');
module.exports = async (client, message) => {
    if (message.author.bot) return false;
    if (!message.content.startsWith("?")) return;
}
