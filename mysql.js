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

module.exports = {
    connection: con
};