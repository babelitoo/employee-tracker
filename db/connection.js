const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    // username
    user: "root",
    // password
    password: "Barcelona41014#",
    database: "employees",
});

connection.connect(function (err) {
    if (err) throw err;
});

module.exports = connection;