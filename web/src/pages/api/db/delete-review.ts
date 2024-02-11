import {NextApiRequest, NextApiResponse} from "next";
import {authOptions, db} from "../auth/[...nextauth]";
import {getServerSession} from "next-auth/next";
import { Session, User } from "next-auth";

// TODO: Add authentication
export default async (request: NextApiRequest, response: NextApiResponse) => {
    // @ts-expect-error
    const session: Session = await getServerSession(request, response, authOptions);
    if (!session || !session.user) {
        response.status(401).send("Unauthorized");
        return;
    }

    if (request.method === "DELETE") {
        console.log("reqbody:", request.body);
        const {comment_id, comment_user_id} = request.body;

        if(comment_user_id !== session.user.id && !session.user.isAdmin) {
            response.status(401).send("Unauthorized");
            return;
        }

        await deleteReview(comment_id, comment_user_id);
        response.status(200).send("Inserted review");
        return;
    } else {
        response.status(400).send("Malformed Request Body");
        return;
    }
};

async function deleteReview(comment_id: string, comment_user_id: string) {
    console.log(
        "SONGSCOPE: Deleting review, comment_id:",
        comment_id,
        "user_id:",
        comment_user_id,
    );
    db.execute(
        `
        DELETE FROM comment
        WHERE id = ? AND user_id = ?
    `,
        [comment_id, comment_user_id],
        (error, results, fields) => {
            console.log("SONGSCOPE: Deleted review");
            if (error) {
                console.error("SONGSCOPE: Unable to delete review", error);
                return false;
            }
            return true;
        }
    );
}
