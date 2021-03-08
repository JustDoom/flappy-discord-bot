const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');

const client = new Discord.Client();

client.commands = new Discord.Collection();

//const prefix = '?';

fs.readdir("./events/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		if (!file.endsWith(".js")) return;
		const event = require(`./events/${file}`);
		let eventName = file.split(".")[0];
		client.on(eventName, event.bind(null, client));
		delete require.cache[require.resolve(`./events/${file}`)];
	});
});

client.commands = new Discord.Collection();
function getDirectories() {
	return fs.readdirSync('./commands').filter(function subFolder(file) {
		return fs.statSync('./commands/' + file).isDirectory();
	});
};
let commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const folder of getDirectories()) {
	const folderFiles = fs.readdirSync('./commands/' + folder).filter(file => file.endsWith('.js'));
	for (const file of folderFiles) {
		commandFiles.push([folder, file]);
	};
};
for (const file of commandFiles) {
	let command;
	if (Array.isArray(file)) {
		command = require(`./commands/${file[0]}/${file[1]}`);
	} else {
		command = require(`./commands/${file}`);
	};
	client.commands.set(command.name, command);
};

client.on('ready', () => {
    console.log('Bot On');
    client.user.setActivity(`Moderating ${client.guilds.cache.size} servers`);
});

client.on("guildCreate", guild => {
    console.log("Joined a new guild: " + guild.name);
    client.user.setActivity(`Moderating ${client.guilds.cache.size} servers`);

	con.query(`SELECT * FROM data WHERE guildID=${message.guild.id}`, function (err, result, rows) {
		if (err) {
			return err;
		} else if (!result) {
			con.query(`INSERT INTO data (guildID, prefix, commands, messages) VALUES ('${message.guild.id}', '?', 0, 0)`), (err2, result) => {
				if (err2) throw err2;
			};
		}
	})
})

client.on("guildDelete", guild => {
    console.log("Left a guild: " + guild.name);
    client.user.setActivity(`Moderating ${client.guilds.cache.size} servers`);
})

client.login(config.token);