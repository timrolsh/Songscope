import {NextApiRequest, NextApiResponse} from "next";
import {db} from "../auth/[...nextauth]";
import {RowDataPacket} from "mysql2";

// TODO: Add authentication
export default async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "GET") {
        const song_id = request.query.songid as string;
        const results = await fetchSongReviews(song_id);
        // TODO --> Swap from JSON stringify to just pure JSON
        response.status(200).send(JSON.stringify(results));
        return;
    } else {
        response.status(400).send("Malformed Request");
        return;
    }
};

async function fetchSongReviews(songid: string) {
    // TODO --> Order these reviews by popularity/likes as well
    try {
        const [rows] = (await db.promise().query(
            `select u.id, u.name, c.comment_text, c.time from comment c, users u
            where c.user_id = u.id
            and c.spotify_work_id = ?
            order by c.time desc;`,
            [songid]
        )) as RowDataPacket[];
        return rows.length > 0 ? rows : null;
    } catch (error) {
        console.error("SONGSCOPE: Unable to fetch reviews", error);
        throw error; // Rethrow the error to be caught by the caller
    }
}
