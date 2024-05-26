import {NextApiRequest, NextApiResponse} from "next";
import {authOptions, db} from "../auth/[...nextauth]";
import {RowDataPacket} from "mysql2";
import {Review} from "@/types";
import {getServerSession} from "next-auth";

export default async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "GET") {
        const song_id = request.query.songid as string;
        // Authenticate user
        // @ts-expect-error
        const session = await getServerSession(request, response, authOptions);
        if (!session || !session.user) {
            response.status(401).send("Unauthorized");
            return;
        }
        const results = await fetchSongReviews(session.user.id, song_id);
        // TODO --> Swap from JSON stringify to just pure JSON

        response.status(200).send(JSON.stringify(results));
        return;
    } else {
        response.status(400).send("Malformed Request");
        return;
    }
};

async function fetchSongReviews(user_id: number, song_id: string) {
    // TODO --> Order these reviews by popularity/likes as well
    // TODO provide the user info and get all of the info whethee they liked or didn't like the song as well and update any necessary types fit here are any
    try {
        const [rows] = (await db.promise().query(
            `
        SELECT u.id                                                                                               AS user_id,
            u.name,
            c.id                                                                                               AS comment_id,
            c.comment_text,
            c.time,
            (SELECT CAST(COALESCE(SUM(liked), 0) AS UNSIGNED) FROM user_comment uc WHERE uc.comment_id = c.id) AS num_likes,
            CAST(COALESCE(SUM(uc.liked = 1 AND uc.user_id = ?), 0) AS UNSIGNED)                                AS user_liked
        FROM comment c
                JOIN
            users u ON c.user_id = u.id
                LEFT JOIN
            user_comment uc ON uc.comment_id = c.id
        WHERE c.spotify_work_id = ?
        GROUP BY c.id, u.id, u.name, c.comment_text, c.time
        ORDER BY c.time DESC;
            `,
            [user_id, song_id]
        )) as RowDataPacket[];

        return rows.length > 0 ? (rows as Review[]) : null;
    } catch (error) {
        console.error("SONGSCOPE: Unable to fetch reviews", error);
        throw error; // Rethrow the error to be caught by the caller
    }
}
