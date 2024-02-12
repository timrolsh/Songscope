import {NextApiRequest, NextApiResponse} from "next";
import {db} from "../auth/[...nextauth]";
import {RowDataPacket} from "mysql2";
import {ProfileStatistics, User} from "@/types";

// TODO: Add authentication
export default async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "POST") {
        const user_id = request.body.user_id as string;
        const results = await getProfileStatistics(user_id);
        // TODO --> Swap from JSON stringify to just pure JSON
        response.status(200).send(JSON.stringify(results));
        return;
    } else {
        response.status(400).send("Malformed Request");
        return;
    }
};

// Returns everything needed for the user profile
async function getProfileStatistics(user_id: string): Promise<ProfileStatistics> {
    try {
        const [statistics] = (
            await db.promise().query(
                `
            SELECT 
                (SELECT COUNT(*) FROM comment WHERE user_id = ?) AS total_comments,
                (SELECT COUNT(favorite) FROM user_song WHERE favorite = 1 AND user_id = ?) AS total_favorites,
                (SELECT AVG(rating) FROM user_song WHERE user_id = ?) AS avg_rating`,
                [user_id, user_id, user_id]
            )
        )[0] as RowDataPacket[];

        let stats: ProfileStatistics = {
            total_comments: Number(statistics.total_comments),
            total_favorites: Number(statistics.total_favorites),
            avg_rating: statistics.avg_rating ? Number(statistics.avg_rating) : undefined
        };

        return stats;
    } catch (error) {
        console.error("SONGSCOPE: Unable to fetch reviews", error);
        throw error; // Rethrow the error to be caught by the caller
    }
}
