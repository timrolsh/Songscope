import db from "@/server/db_connect";
import {googleClient} from "@/server/google_auth_utils";

/*
After any user signing in with google finishes signing in, Google sends them to this page with their token. 
This page parses the token, verifies that it is valid, adds the user to the database if it is their first 
time signing in, and then redirects them to the user page. 
*/
export default async (request, response) => {
    if (!request.body.credential) {
        response.status(400).send("No credential provided.");
        return;
    }

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: request.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const userInfo = ticket.getPayload();
        /*
        Check if a user exists in the database by their google_id (seeing if it exists in the user table). 
        If the user does not exist, then sign them up by adding them to the database, pulling their data 
        from their google account. 
        */
        db.query(
            `INSERT INTO user (username, google_id, first_name, last_name, email) SELECT ?, ?, ?, ?, ? 
                FROM dual WHERE NOT EXISTS (SELECT 1 FROM user WHERE google_id = ?)`,
            [
                `${userInfo.given_name}_${userInfo.family_name}`,
                userInfo.sub,
                userInfo.given_name,
                userInfo.family_name,
                userInfo.email,
                userInfo.sub
            ],
            (error, results, fields) => {
                response.setHeader("Set-Cookie", `token=${request.body.credential}; path=/;`);
                response.redirect(307, "/user");
            }
        );
    } catch (error) {
        console.log(error);
        response.status(400).send("Invalid credential." + error);
    }
};
