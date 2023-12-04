// Test route for plumbing project, delete later

import db from "@/server/db_connect";
export default (request, response) => {
    db.query("INSERT INTO rating (spotify_work_id, rating, user_id) VALUES (?, ?, ?)", [request.body.spotify_work_id, request.body.rating, request.body.user_id], (error, result, fields) => {
        if (error) {
            console.log(error);
            response.statusCode = 500;
            response.send("Error writing to the database");
            return;
        }
        response.statusCode = 200;
        db.query("SELECT * FROM rating WHERE spotify_work_id = ? AND user_id = ?", [request.body.spotify_work_id, request.body.user_id], (error, result, fields) => {
            if (error) {
                console.log(error);
                response.statusCode = 500;
                response.send("Error reading from the database");
                return;
            }
            response.send(`Successfully wrote, result of selecting all ratings of this user ID and Spotify work ID: ${JSON.stringify(result)}`);
        });
    });
};
