import {db} from "../auth/[...nextauth]";
import {RowDataPacket} from "mysql2";
import spotifyApi from "../spotify/wrapper";
import {NextApiRequest, NextApiResponse} from "next";
import {SongMetadata} from "@/types";

export interface SongReviewRow extends RowDataPacket {
    id: string;
    num_reviews: number;
    title: string;
    artist: string;
}

export interface EnrichedSongMetadata extends SongMetadata {
    num_reviews: number;
}

async function enrichSongData(spotify_work_id: string): Promise<EnrichedSongMetadata> {
    const metadata = await spotifyApi.getSong(spotify_work_id);
    return {
        ...metadata,
        num_reviews: 0
    };
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method === "GET") {
        const limit = parseInt(request.query.limit as string, 5) || 5; // Default limit to 5 if not specified
        try {
            const results = await fetchTopSongs(limit);
            response.status(200).json(results);
        } catch (error) {
            console.error("Error fetching top songs: ", error);
            response.status(500).json({error: "Internal Server Error"});
        }
    } else {
        response.status(400).json({error: "Malformed Request"});
    }
}

async function fetchTopSongs(limit: number): Promise<SongMetadata[] | null> {
    try {
        const [rows] = await db.promise().query<SongReviewRow[]>(
            `SELECT c.spotify_work_id, COUNT(*) AS num_reviews
         FROM comment c
         GROUP BY c.spotify_work_id
         ORDER BY num_reviews DESC
         LIMIT ?;`,
            [limit]
        );

        const songsWithMetadata = await Promise.all(
            rows.map(async (row) => {
                const metadata = await enrichSongData(row.spotify_work_id);
                return {
                    ...metadata,
                    num_reviews: row.num_reviews
                };
            })
        );

        return songsWithMetadata.length > 0 ? songsWithMetadata : null;
    } catch (error) {
        console.error("Unable to fetch top reviewed songs with metadata", error);
        throw error;
    }
}
