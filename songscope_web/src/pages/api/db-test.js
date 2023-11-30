// Test route for plumbing project, delete later

import db from "@/server/db_connect";
export default (request, response) => {
    db.query("SELECT NOW()", (error, result, fields) => {
        if (error) {
            console.log(error);
            response.statusCode = 500;
            response.send("Error with the database connection");
            return;
        }
        response.statusCode = 200;
        response.send(`The database returned 1 row, and the row is ${result[0]["NOW()"]}.`);
    });
};
