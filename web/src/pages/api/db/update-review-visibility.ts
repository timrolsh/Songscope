import {NextApiRequest, NextApiResponse} from "next";
import {authOptions, db} from "../auth/[...nextauth]";
import {getServerSession} from "next-auth/next";
import {Session, User} from "next-auth";

// TODO: Add authentication
export default async (request: NextApiRequest, response: NextApiResponse) => {
    // @ts-expect-error
    const session: Session = await getServerSession(request, response, authOptions);
    if (!session || !session.user) {
        response.status(401).send("Unauthorized");
        return;
    }

    if (request.method === "POST") {
        console.log("reqbody:", request.body);
        const {user_id} = request.body;
        const showReviews = request.body.value;
        if (user_id !== session.user.id && !session.user.isAdmin) {
            response.status(401).send("Unauthorized");
            return;
        }

        const success = await updateReviewVisibility(user_id, showReviews);
        if (success) {
            response.status(200).send("Updated review visibility");
        } else {
            response.status(500).send("Failed to update review visibility");
        }
        return;
    } else {
        response.status(400).send("Malformed Request Body");
        return;
    }
};

async function updateReviewVisibility(user_id: string, showReviews: boolean) {
    console.log(
        "SONGSCOPE: updating reviews visibility: user_id ",
        user_id,
        ", visible: ",
        showReviews
    );
    return new Promise<boolean>((resolve, reject) => {
        db.execute(
            `
            UPDATE users
            SET show_reviews = ?
            WHERE id = ?
        `,
            [showReviews, user_id],
            (error, results, fields) => {
                console.log("SONGSCOPE: Updated review visibility");
                if (error) {
                    console.error("SONGSCOPE: Unable to update review visibility", error);
                    resolve(false);
                } else {
                    resolve(true);
                }
            }
        );
    });
}
