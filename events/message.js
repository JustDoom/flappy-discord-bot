const config = require('../config.json');
const TikTokScraper = require('tiktok-scraper');
const fetch = require('node-fetch');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const errors = require('../Extras/errors.json');
const FixNumber = n => {
	if (n < 1e3) return n;
	if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
	if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
	if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
	if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
};
function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}
const cooldowns = new Discord.Collection();
const errormsg = errors[Math.round(Math.random() * (errors.length - 1))];

const con = require("../Extras/database.js")
module.exports = async (client, message) => {
    if (message.author.bot) return false;

    if (message.content.includes("@here") || message.content.includes("@everyone")) return false;

	if (message.content.includes('https://vm.tiktok.com')) {
		const link = message.content;
		const videoMeta = await TikTokScraper.getVideoMeta(link);
		const video = videoMeta.collector[0];
		const views = FixNumber(video.playCount)
		const Shares = FixNumber(video.shareCount)
		const Comments = FixNumber(video.commentCount)
		const Likes = FixNumber(video.diggCount)
		const videoURL = video.videoUrl;
		const headers = videoMeta.headers;
		const response = await fetch(videoURL, {
			method: 'GET',
			headers
		});
        const buffer = await response.buffer();
        const videomp4 = new MessageAttachment(buffer, 'video.mp4')
        try{
        message.channel.send(videomp4)
        } catch (e) {
            message.channel.send("The video might be a bit too big for me to send")
        }
		const infoembed = new MessageEmbed()
			.setColor("RANDOM")
			.setTitle("Tiktok Video")
			.setURL(link)
			.addFields(
				{ name: 'Username', value: `${video.authorMeta.name}` },
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Caption', value: `**${video.text}**`, inline: true },
			)
			.addField('**Stats**', `Views:**${views}**\n
			Shares:**${Shares}**\n
			Comments:**${Comments}**\n
			Likes:**${Likes}**`, true)
		message.channel.send(infoembed)
	}

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
    if (message.content === 'not funny') {
        const laugh = new MessageEmbed().setImage('https://cdn.discordapp.com/attachments/674290848980008980/732748324045848576/tenor.gif')
        message.channel.send(laugh)
    }
    else if (message.content.toLowerCase().includes('simp')) {
        try {
        if(message.guild.id != '674290848548257803'){
        message.react('794128271788081173');
      }
    }catch{
        console.log("There was an error calling someone a simp")
    }
    }

	if (!message.content.startsWith('?')) return;
	const supportGuild = message.client.guilds.cache.get('740705740221841450')
	const member = supportGuild.members.cache.get(message.author.id)
	const isDonator = member ? member.roles.cache.some(role => role.id === '773021050438287390') : false
	const args = message.content.slice('?'.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
    }
    
    if(command.Donor && !isDonator){
        return message.reply('You must donate do use that command')
    }

	if (command.nsfw == true && !message.channel.nsfw){
		message.react('💢');
		return message.channel.send(errormsg);
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`?${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const guilds = {}
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(client, message, args, con, Discord, errormsg, sleep, isDonator, config, FixNumber, command);
	} catch (error) {
		console.error(error);
		message.reply(`There was an error executing that command\nError:${error}`);
	}

}