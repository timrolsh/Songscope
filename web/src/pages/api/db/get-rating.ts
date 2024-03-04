import {NextApiRequest, NextApiResponse} from "next";
import {db} from "../auth/[...nextauth]";
import {RowDataPacket} from "mysql2";

// TODO: Add authentication
export default async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "POST") {
        const song_id = request.body.songid as string;
        const user_id = request.body.userid as string;
        const results = await fetchRating(song_id, user_id);
        // TODO --> Swap from JSON stringify to just pure JSON
        response.status(200).send(JSON.stringify(results));
        return;
    } else {
        response.status(400).send("Malformed Request");
        return;
    }
};

async function fetchRating(songid: string, user_id: string) {
    try {
        const [rows] = (await db.promise().query(
            `select rating
            from user_song
            where spotify_work_id = ?
            and user_id = ?;`,
            [songid, user_id]
        )) as RowDataPacket[];
        return rows[0] ? rows[0].rating : null;
    }
    catch (error) {
        console.error("SONGSCOPE: Unable to fetch rating data", error);
        throw error; // Rethrow the error to be caught by the caller
    }
}
