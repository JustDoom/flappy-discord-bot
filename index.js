const Discord = require('discord.js');
const mysql = require('mysql');
const db = require('quick.db');
const fs = require('fs');
const config = require('./config.json');

const client = new Discord.Client();

client.commands = new Discord.Collection();

//const prefix = '?';

//mysql
var con = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    port: config.port,
    database: config.database
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
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
})

client.on("guildDelete", guild => {
    console.log("Left a guild: " + guild.name);
    client.user.setActivity(`Moderating ${client.guilds.cache.size} servers`);
})

client.login(config.token);