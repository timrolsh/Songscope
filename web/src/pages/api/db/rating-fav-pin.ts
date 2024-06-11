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


    await db.query(
        `    
    INSERT INTO user_song (user_id, spotify_work_id, rating, pinned, favorite)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (user_id, spotify_work_id)
            DO UPDATE SET rating   = EXCLUDED.rating,
                        pinned   = EXCLUDED.pinned,
                        favorite = EXCLUDED.favorite;
    `,
        [
            session.user.id,
            request.body.song_id,
            request.body.rating,
            request.body.pinned,
            request.body.favorited
        ]
    );
    const dbResponse = await db.query(
        `
    SELECT us.spotify_work_id,
            AVG(us.rating)   AS avg_rating,
            (MAX(CASE WHEN us.pinned THEN 1 ELSE 0 END) = 1) AS pinned,
            (MAX(CASE WHEN us.favorite THEN 1 ELSE 0 END) = 1) AS favorited,
            us.rating        AS user_rating
    FROM user_song us
    WHERE us.user_id = $1
        AND us.spotify_work_id = $2
    GROUP BY us.spotify_work_id, us.rating;
        `,
        [session.user.id, request.body.song_id]
    );
    response.send(dbResponse.rows[0]);
};
