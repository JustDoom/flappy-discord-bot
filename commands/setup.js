module.exports = {
    name: 'setup',
    execute(message, args, Discord, db, client) {
        db.add('bot.commandsRun', 1);

        var server = message.guild;
        var name = message.author.username;

        server.channel.create("setup", {
            type: 'text',
        })
        .then((channel) => {
            console.log(channel)
        })

        const newEmbed = new Discord.MessageEmbed()
            .setColor('#2c5999')
            .setTitle('Statistics')
            .setAuthor(`${message.author.username}`, `${message.author.avatarURL()}`)
            .addFields(
                { name: `Commands Run`, value: `${db.get('bot.commandsRun')}` },
                { name: `Servers`, value: `${client.guilds.cache.size}` }
            ).setFooter('Help keep the bot running by donating! PayPal.Me/justdoom')

        message.channel.send(newEmbed);
    }
}