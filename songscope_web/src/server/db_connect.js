const mysql = require("mysql2");

require("dotenv").config({path: `${__dirname}/../../../.env`});

// check to make sure all environment variables are set
if (
    !(
        process.env.DB_HOST &&
        process.env.DB_USER &&
        process.env.DB_SCHEMA &&
        process.env.DB_PASSWORD &&
        process.env.DB_PORT
    )
) {
    console.log("Error: Environment variables for the database are not set.");
    process.exit(1);
}

// create the connection to database
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_SCHEMA,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});
module.exports = db;
