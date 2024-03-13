import {NextApiRequest, NextApiResponse} from "next";
import {db} from "../auth/[...nextauth]";
import {RowDataPacket} from "mysql2";

// TODO: Add authentication
export default async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "POST") {
        const user_id = request.body.user_id as string;
        const comment_id = request.body.comment_id as string;

        if (!user_id || !comment_id) {
            response.status(400).send("Malformed Request Body");
            return;
        }

        const results = await fetchCommentLikeState(user_id, comment_id);

        if (!results) {
            response.status(500).send("Unable to fetch like state for comment");
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

async function fetchCommentLikeState(user_id: string, comment_id: string) {
    try {
        const [likeState] = (await db.promise().query(
            `
            select liked from user_comment 
                where user_id=?
                and comment_id=?;`,
            [user_id, comment_id]
        )) as RowDataPacket[];

        if (!likeState[0]) {
            return {like: false};
        }

        return {like: likeState[0].liked as boolean};
    } catch (error) {
        console.error("SONGSCOPE: Unable to fetch pin/review data", error);
        throw error; // Rethrow the error to be caught by the caller
    }
}
