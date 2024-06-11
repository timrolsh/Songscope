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
        const {user_id} = request.body;

        if (user_id !== session.user.id && !session.user.is_admin) {
            response.status(401).send("Unauthorized");
            return;
        }

        const success = await db.query(
            `
            DELETE FROM users
            WHERE id = $1
        `,
            [user_id]
        );
        if (success) {
            response.status(200).send("Deleted user");
        } else {
            response.status(500).send("Failed to delete user");
        }
        return;
    } else {
        response.status(400).send("Malformed Request Body");
        return;
    }
};
