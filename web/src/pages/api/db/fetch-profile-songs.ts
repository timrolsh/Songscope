import {NextApiRequest, NextApiResponse} from "next";
import {db} from "../auth/[...nextauth]";
import {RowDataPacket} from "mysql2";
import spotifyApi from "../spotify/wrapper";
import {UserProfileSongs} from "@/types";
import {SongMetadata} from "@/types";

// TODO: Add authentication
export default async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "POST") {
        const profile_id = request.body.profile_id as string;
        if (!profile_id) {
            response.status(400).send("Malformed Request Body");
            return;
        }

        const results = await fetchProfile(profile_id);
        // TODO --> Swap from JSON stringify to just pure JSON
        response.status(200).send(JSON.stringify(results));
        return;
    } else {
        response.status(400).send("Malformed Request");
        return;
    }
};

// Returns everything needed for the user profile
async function fetchProfile(profile_id: string) {
    try {
        // TODO --> Again, likely can be optimized. Big query.
        const [favoriteData, pinData] = (await Promise.all([
            db.promise().query(
                `
                select spotify_work_id, rating
                    from user_song
                    where user_id=?
                    and favorite=1;
                `,
                [profile_id]
            ),
            db.promise().query(
                `
                select spotify_work_id, rating
                    from user_song
                    where user_id=?
                    and pinned=1;
                `,
                [profile_id]
            )
        ])) as RowDataPacket[];

        // TODO --> Likely can be optimized
        const arrayedFavorites = favoriteData[0].map((s: RowDataPacket) => s.spotify_work_id);
        const arrayedPins = pinData[0].map((s: RowDataPacket) => s.spotify_work_id);
        let favoriteSongs: SongMetadata[] = [];
        let pins: SongMetadata[] = [];

        if (arrayedFavorites.length > 0) {
            favoriteSongs = await spotifyApi.getMultipleSongs(arrayedFavorites);
        }
        if (arrayedPins.length > 0) {
            pins = await spotifyApi.getMultipleSongs(arrayedPins);
        }

        let profile: UserProfileSongs = {
            favoritedSongs: favoriteSongs,
            pinnedSongs: pins
        };

        return profile;
    } catch (error) {
        console.error("SONGSCOPE: Unable to fetch reviews", error);
        throw error; // Rethrow the error to be caught by the caller
    }
}
