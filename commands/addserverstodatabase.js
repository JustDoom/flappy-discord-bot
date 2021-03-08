module.exports = {
    name: 'addservertodatabase',
    execute(message, args, Discord, db, client, con) {
        client.guilds.cache.forEach(server => {
            con.query(`SELECT * FROM data WHERE guildID=${server.id}`, function (err, result, rows) {
                if (err) {
                    return err;
                } else if (!result) {
                    con.query(`INSERT INTO data (guildID, prefix, commands, messages) VALUES ('${message.guild.id}', '?', 0, 0)`), (err2, result) => {
                        if (err2) throw err2;
                        message.channel.send(`${server.name} has been added`);
                    };
                }
            })
        });
    }
}