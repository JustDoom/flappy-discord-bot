module.exports = {
    name: 'addservertodatabase',
    execute(message, args, Discord, db, client, con) {
        console.log('1');
        client.guilds.cache.forEach(server => {
            console.log('2');
            con.query(`SELECT * FROM data WHERE guildID = ${server.id}`, function (err, result, rows) {
                console.log(server.id)
                if (err) {
                    return err;
                } else if (!result.length) {
                    console.log('3');
                    con.query(`INSERT INTO data (guildID, prefix, commands, messages) VALUES (${server.id}, "?", 0, 0)`), (err2, result) => {
                        if (err2) throw err2;
                        console.log('4');
                        message.channel.send(`${server.name} has been added`);
                    };
                }
            })
        });
    }
}