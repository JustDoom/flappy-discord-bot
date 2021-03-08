module.exports = {
    name: 'createtable',
    execute(message, args, Discord, db, client, con) {
        var sql = `CREATE TABLE data (guildID int, prefix VARCHAR(25), commands int, messages int)`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Table created");
        });
    }
}