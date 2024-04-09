import {NextApiRequest, NextApiResponse} from "next";
import {authOptions, db} from "../auth/[...nextauth]";
import { getServerSession, Session } from "next-auth";

// TODO: Add authentication
export default async (request: NextApiRequest, response: NextApiResponse) => {
    // @ts-expect-error
    const session: Session = await getServerSession(request, response, authOptions);
    if (!session || !session.user) {
        response.status(401).send("Unauthorized");
        return;
    }
    
    if (request.method === "POST") {
        const user_id = request.body.user_id as string;
        const comment_id = request.body.comment_id as string;
        const like = request.body.like as boolean;
        
        // if (!user_id || !song_id || pin_state || !fav_state) {
        //     response.status(400).send("Malformed Request Body");
        //     return;
        // }

        if(user_id !== session.user.id) {
            response.status(401).send("Unauthorized");
            return;
        }
        
        try {
            const results = await likeComment(user_id, comment_id, like);
        } catch (e: any) {
            response.status(500).send("Unable to like comment: ".concat(e.message));
            return;
        }

        // TODO --> Swap from JSON stringify to just pure JSON
        response.status(200).send("Toggled Like on Comment");
        return;
    } else {
        response.status(400).send("Malformed Request");
        return;
    }
};

async function likeComment(user_id: string, comment_id: string, like: boolean) {
    try {
        // TODO --> Likely can be optimized. Big query.
        return db.execute(
            `
                INSERT INTO user_comment(user_id, comment_id, liked)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE liked=?;
                `,
            [user_id, comment_id, like, like],
            (error, results, fields) => {
                console.log(
                    "SONGSCOPE: Updated like state for user/comment: " + user_id + "/" + comment_id
                );
                if (error) {
                    console.error("SONGSCOPE: Unable to like comment", error);
                    return false;
                }
                return true;
            }
        );
    } catch (error) {
        console.error("SONGSCOPE: Unable to like comment (outer)", error);
        throw error; // Rethrow the error to be caught by the caller
    }
}
