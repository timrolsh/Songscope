const mysql = require("mysql2");

// create the connection to database
const db = mysql.createPool({
    host: "sqlclassdb-instance-1.cqjxl5z5vyvr.us-east-2.rds.amazonaws.com",
    user: "songscope",
    database: "capstone_2324_songscope",
    password: "2G7tQBQYd25q",
    port: 3306
});
module.exports = db;
