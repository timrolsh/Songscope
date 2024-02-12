import {NextApiRequest, NextApiResponse} from "next";
import {db} from "../auth/[...nextauth]";
import {RowDataPacket} from "mysql2";

// TODO: Add authentication
export default async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "POST") {
        const user_id = request.body.user_id as string;
        const song_id = request.body.song_id as string;

        if (!user_id || !song_id) {
            response.status(400).send("Malformed Request Body");
            return;
        }

        const results = await fetchSongState(user_id, song_id);

        if (!results) {
            response.status(500).send("Unable to pin/favorite song");
            return;
        }

        // TODO --> Swap from JSON stringify to just pure JSON
        response.status(200).send(JSON.stringify(results));
        return;
    } else {
        response.status(400).send("Malformed Request");
        return;
    }
};

async function fetchSongState(user_id: string, song_id: string) {
    try {
        const [songState] = (await db.promise().query(
            `
            select favorite, pinned
                from user_song
                where user_id=?
                and spotify_work_id=?;`,
            [user_id, song_id]
        )) as RowDataPacket[];

        if (!songState[0]) {
            return {favorite: false, pinned: false};
        }

        let retState = {
            favorite: songState[0].favorite as boolean,
            pinned: songState[0].pinned as boolean
        };
        return retState;
    } catch (error) {
        console.error("SONGSCOPE: Unable to fetch pin/review data", error);
        throw error; // Rethrow the error to be caught by the caller
    }
}
