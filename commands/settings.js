module.exports = {
    name: 'settings',
    execute(message, args, Discord, db, client) {
        db.add('bot.commandsRun', 1);

        let prefix;

        con.query(`SELECT prefix FROM data WHERE guildID=${message.guild.id}`, function (err, result, rows) {
            if (err) {
                return err;
            } else if (!result) {
                return console.log('Error getting prefix');
            }

            prefix = result[0];
        })

        const newEmbed = new Discord.MessageEmbed()
            .setColor('#2c5999')
            .setTitle('Settings')
            .setDescription(`Settings for Flappy bot in this discord server.`)
            .addFields(
                { name: `Commands Run`, value: `${db.get('bot.commandsRun')}` },
                { name: `Servers`, value: `${client.guilds.cache.size}` }
            ).setFooter('Help keep the bot running by donating! PayPal.Me/justdoom')

        message.channel.send(newEmbed);
    }
}