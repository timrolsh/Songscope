import {EnrichedSongMetadata, SongReviewRow} from "./types";
import {db} from "./pages/api/auth/[...nextauth]";
import spotifyApi from "./pages/api/spotify/wrapper";

export let topSongs: EnrichedSongMetadata[] = [];
export let hotSongs: EnrichedSongMetadata[] = [];

export function setTopSongs(songs: EnrichedSongMetadata[]): void {
    topSongs = songs;
}

export function setHotSongs(songs: EnrichedSongMetadata[]): void {
    hotSongs = songs;
}

export async function loadTopAndHotSongs(): Promise<{
    topSongs: EnrichedSongMetadata[];
    hotSongs: EnrichedSongMetadata[];
}> {
    const limit = 5;
    // get a date for a week ago
    let date = new Date();
    date.setDate(date.getDate() - 7);
    // put date into mysql format
    const daysAgo = 7; // Number of days to consider a song as hot
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - daysAgo);

    const [rows] = await db.promise().query<SongReviewRow[]>(
        `
        SELECT c.spotify_work_id, COUNT(*) as num_reviews,
            CASE WHEN c.time >= ? THEN 1 ELSE 0 END as is_hot
        FROM comment c
        GROUP BY c.spotify_work_id
        ORDER BY num_reviews DESC, c.time DESC
        LIMIT ?;
        `,
        [recentDate, 10]
    );

    const enrichedData = await Promise.all(
        rows.map(async (row) => {
            const metadata = await spotifyApi.getSong(row.spotify_work_id);
            return {
                ...metadata,
                num_reviews: row.num_reviews,
                is_hot: row.is_hot
            };
        })
    );

    const topSongs = enrichedData.filter((song) => !song.is_hot).slice(0, limit);
    const hotSongs = enrichedData.filter((song) => song.is_hot).slice(0, limit);

    const combinedResults = {topSongs, hotSongs};
    return combinedResults;
}
