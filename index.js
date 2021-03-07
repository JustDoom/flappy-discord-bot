const Discord = require('discord.js');
const mysql = require('mysql');
const db = require('quick.db');
const fs = require('fs');
const config = require('./config.json');

const client = new Discord.Client();

client.commands = new Discord.Collection();

const prefix = '?';

//mysql
/**var con = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    port: config.port,
    database: config.database
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});**/

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log('Bot On');
    client.user.setActivity(`Moderating ${client.guilds.cache.size} servers`);
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.substring(prefix.length).split(" ");
    const command = args.shift().toLowerCase();

    if (command === 'stats') {
        client.commands.get('stats').execute(message, args, Discord, db, client);
    }

    if (message.author.id === '474482013886480385' || message.author.id === '371331470230290435') {
        
    }
});

client.login(config.token);