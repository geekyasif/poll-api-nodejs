const mysql = require("mysql2");

const conn = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "poll",
});

module.exports = conn;
