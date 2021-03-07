const config = require('../config.json');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Discord = require('discord.js');

module.exports = async (client, message) => {
    if (message.author.bot) return false;

    if (message.content.includes("@here") || message.content.includes("@everyone")) return false;

    if (message.mentions.has(client.user)) {
        message.reply('My prefix is ^')
    }
    if (message.channel.type === 'dm') {
        if (message.attachments.size == 1) {
            var picture = message.attachments.first()
            console.log(picture)
            var attachmenturl = picture.attachment
            const response = await fetch(attachmenturl, {
                method: 'GET'
            });
            var buffer = await response.buffer();
            client.channels.cache.get(config.dmattachmentID).send(new MessageAttachment(buffer, `image.png`))
        }
        client.channels.cache.get(config.dmchannelID).send(`${message.author.id}, ${message.author.username}: ${message.content}`);
    }

	if (!message.content.startsWith('?')) return;
	const args = message.content.slice('?'.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
    }

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`?${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	try {
		command.execute(client, message, args, con, Discord, errormsg, sleep, isDonator, config, FixNumber, command);
	} catch (error) {
		console.error(error);
		message.reply(`There was an error executing that command\nError:${error}`);
	}

}