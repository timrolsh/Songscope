const pg = require('pg');
// hardcoded for now, visit this page for how to use environment varibales as well
// https://node-postgres.com/apis/client
const db = new pg.Client({
    user: "root",
    password: "root",
    database: "postgres",
    host: "localhost",
    port: 5432
});
module.exports = db;
