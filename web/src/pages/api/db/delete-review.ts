import {NextApiRequest, NextApiResponse} from "next";
import {authOptions, db} from "../auth/[...nextauth]";
import {getServerSession} from "next-auth/next";
import {Session} from "next-auth";

export default async (request: NextApiRequest, response: NextApiResponse) => {
    // @ts-expect-error
    const session: Session = await getServerSession(request, response, authOptions);
    if (!session || !session.user) {
        response.status(401).send("Unauthorized");
        return;
    }

    if (request.method === "DELETE") {
        const {comment_id, comment_user_id} = request.body;

        if (comment_user_id !== session.user.id && !session.user.is_admin) {
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
    await db.query(
        `
    DELETE FROM comments
    WHERE id = $1 AND user_id = $2
`,
        [comment_id, comment_user_id]
    );
}
