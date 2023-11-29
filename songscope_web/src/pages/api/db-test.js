// Test route for plumbing project, delete later

import db from "@/server/db_connect";
export default async (request, response) => {
    try {
        const result = await db.query("SELECT NOW();");
        response.statusCode = 200;
        response.send(
            `The database returned ${result.rowCount} rows, and the first row is ${result.rows[0].now}.`
        );
    } catch (error) {
        console.error(error);
        response.statusCode = 500;
        response.send("Internal Server Error");
    }
};
