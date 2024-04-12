import {NextApiRequest, NextApiResponse} from "next";
import {authOptions, db} from "../auth/[...nextauth]";
import {getServerSession, Session} from "next-auth";

export default async (request: NextApiRequest, response: NextApiResponse) => {
    // @ts-expect-error
    const session: Session = await getServerSession(request, response, authOptions);
    if (!session || !session.user) {
        response.status(401).send("Unauthorized");
        return;
    }

    if (request.method === "POST") {
        const user_id = request.body.user_id as string;
        const song_id = request.body.song_id as string;
        const pin_state = request.body.pin_state as boolean;
        const fav_state = request.body.fav_state as boolean;
        // if (!user_id || !song_id || pin_state || !fav_state) {
        //     response.status(400).send("Malformed Request Body");
        //     return;
        // }

        if (user_id !== session.user.id) {
            response.status(401).send("Unauthorized");
            return;
        }

        try {
            const results = await pinOrFavorite(user_id, song_id, pin_state, fav_state);
        } catch (e: any) {
            response.status(500).send("Unable to pin/favorite song: ".concat(e.message));
            return;
        }

        // TODO --> Swap from JSON stringify to just pure JSON
        response.status(200).send("Toggled Pinned/Favorited Song");
        return;
    } else {
        response.status(400).send("Malformed Request");
        return;
    }
};

async function pinOrFavorite(
    user_id: string,
    song_id: string,
    pin_state: boolean,
    fav_state: boolean
) {
    try {
        // TODO --> Again, likely can be optimized. Big query.
        // Fix bug with rating... if you give a song a rating then pin/like it, rating will be set to null
        return db.execute(
            `
                INSERT INTO user_song (user_id, spotify_work_id, favorite, pinned, rating)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE favorite=?, pinned=?, rating=?;
                `,
            [user_id, song_id, fav_state, pin_state, null, fav_state, pin_state, null],
            (error, results, fields) => {
                console.log(
                    "SONGSCOPE: Updated pin/favorite state for user/song: " +
                        user_id +
                        "/" +
                        song_id
                );
                if (error) {
                    console.error("SONGSCOPE: Unable to pin/favorite song", error);
                    return false;
                }
                return true;
            }
        );
    } catch (error) {
        console.error("SONGSCOPE: Unable to fetch reviews", error);
        throw error; // Rethrow the error to be caught by the caller
    }
}
