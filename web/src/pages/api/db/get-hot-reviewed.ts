import {NextApiRequest, NextApiResponse} from "next";
import {db} from "../auth/[...nextauth]";
import spotifyApi from "../spotify/wrapper";

import { SongReviewRow, EnrichedSongMetadata } from "./get-top-reviewed";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method === "GET") {
        const limit = parseInt(request.query.limit as string, 5) || 5; // Default limit to 5 if not specified
        try {
            const results = await fetchHotSongs(limit);
            response.status(200).json(results);
        } catch (error) {
            console.error("Error fetching hot songs: ", error);
            response.status(500).json({error: "Internal Server Error"});
        }
    } else {
        response.status(400).json({error: "Malformed Request"});
    }
}

async function fetchHotSongs(limit: number): Promise<EnrichedSongMetadata[] | null> {
    const daysAgo = 7; // Number of days to consider a song as hot
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - daysAgo);

    try {
        const [rows] = await db.promise().query<SongReviewRow[]>(
            `SELECT c.spotify_work_id, COUNT(*) as num_reviews
       FROM comment c
       WHERE c.time >= ?
       GROUP BY c.spotify_work_id
       ORDER BY num_reviews DESC, c.time DESC
       LIMIT ?;`,
            [recentDate, limit]
        );

        const songsWithMetadata = await Promise.all(
            rows.map(async (row) => {
                const metadata = await spotifyApi.getSong(row.spotify_work_id);
                return {
                    ...metadata,
                    num_reviews: row.num_reviews
                };
            })
        );

        return songsWithMetadata.length > 0 ? songsWithMetadata : null;
    } catch (error) {
        console.error("Unable to fetch hot songs with metadata", error);
        throw error;
    }
}
