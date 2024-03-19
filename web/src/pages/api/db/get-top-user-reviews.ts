import {db} from "../auth/[...nextauth]";
import {NextApiRequest, NextApiResponse} from "next";
import {enrichSongData} from "./get-top-reviewed";
import {RowDataPacket} from "mysql2";

interface UserTopReviews extends RowDataPacket {
    user_id: string;
    comment_id: string;
    spotify_work_id: string;
    comment_text: string;
    time: string;
    num_likes: number;
}

export interface ProfileTopReviews {
    spotify_work_id: string;
    title: string;
    artist: string;
    album: string;
    image: string;

    user_id: string;
    comment_id: string;
    comment_text: string;
    time: string;
    num_likes: number;
}

// TODO --> Migrate this to a GET
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method === "POST") {
        const userid = parseInt(request.body.user_id as string, 10) || 5; // Default limit to 5 if not specified
        try {
            const results = await fetchTopUserReviews(userid);
            console.log("Results: ", results);
            response.status(200).json(results);
        } catch (error) {
            console.error("Error fetching top songs: ", error);
            response.status(500).json({error: "Internal Server Error"});
        }
    } else {
        response.status(400).json({error: "Malformed Request"});
    }
}

async function fetchTopUserReviews(userid: number): Promise<ProfileTopReviews[] | null> {
    try {
        const [rows] = await db.promise().query<UserTopReviews[]>(
            `select u.id user_id, c.id comment_id, c.spotify_work_id, c.comment_text, c.time,
                (SELECT CAST(coalesce(sum(liked), 0) as unsigned) from user_comment uc where uc.comment_id = c.id) as num_likes
            from comment c, users u
            where c.user_id = u.id
            and u.id=?
            order by num_likes desc, c.time desc
            LIMIT 3;`,
            [userid]
        );

        const withSongMetadata: ProfileTopReviews[] = await Promise.all(
            rows.map(async (row) => {
                const metadata = await enrichSongData(row.spotify_work_id);
                return {
                    spotify_work_id: metadata.id,
                    title: metadata.name,
                    artist: metadata.artist,
                    album: metadata.album,
                    image: metadata.albumArtUrl,

                    user_id: row.user_id,
                    comment_id: row.comment_id,
                    comment_text: row.comment_text,
                    time: row.time,
                    num_likes: row.num_likes
                };
            })
        );

        return withSongMetadata.length > 0 ? withSongMetadata : null;
    } catch (error) {
        console.error("Unable to fetch top reviewed songs with metadata", error);
        throw error;
    }
}
