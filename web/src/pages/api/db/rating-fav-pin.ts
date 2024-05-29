import {NextApiRequest, NextApiResponse} from "next";
import {authOptions, db} from "../auth/[...nextauth]";
import {getServerSession} from "next-auth/next";

/*
For updating the user's rating, whether the user has this song
pinned, and whether the user has the song favorited.
*/
export default async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method !== "POST") {
        response.status(405).send("Method not allowed");
        return;
    }
    const requestBodyKeys = Object.keys(request.body);
    if (
        !(
            requestBodyKeys.includes("song_id") &&
            requestBodyKeys.includes("rating") &&
            requestBodyKeys.includes("pinned") &&
            requestBodyKeys.includes("favorited")
        )
    ) {
        response.status(400).send("Malformed Request Body");
        return;
    }
    // Authenticate user
    // @ts-expect-error
    const session = await getServerSession(request, response, authOptions);
    if (!session || !session.user) {
        response.status(401).send("Unauthorized");
        return;
    }

    // Mysql2 does not allow you to do start transaction and commit, done as 2 separate queries
    await db.promise().query(
        `    
    INSERT INTO user_song (user_id, spotify_work_id, rating, pinned, favorite)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE rating   = VALUES(rating),
                            pinned   = VALUES(pinned),
                            favorite = VALUES(favorite);
    `,
        [
            session.user.id,
            request.body.song_id,
            request.body.rating,
            request.body.pinned,
            request.body.favorited
        ]
    );
    const dbResponse = await db.promise().query(
        `
    SELECT us.spotify_work_id,
        AVG(us.rating)   AS avg_rating,
        MAX(us.pinned)   AS pinned,
        MAX(us.favorite) AS favorited,
        us.rating        AS user_rating
    FROM user_song us
            JOIN
        users u ON us.user_id = u.id
    WHERE us.user_id = ?
        AND us.spotify_work_id = ?
    GROUP BY us.spotify_work_id;
        `,
        [session.user.id, request.body.song_id]
    );
    response.send((dbResponse as any)[0][0]);
};
