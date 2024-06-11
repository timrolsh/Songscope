import {NextApiRequest, NextApiResponse} from "next";
import {authOptions, db} from "../auth/[...nextauth]";
import {getServerSession, Session} from "next-auth";

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

        if (user_id !== session.user.id) {
            response.status(401).send("Unauthorized");
            return;
        }

        try {
            await db.query(
                `
            INSERT INTO user_comment (user_id, comment_id, liked)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, comment_id)
                DO UPDATE SET liked = EXCLUDED.liked;  
            `,
                [user_id, comment_id, like]
            );
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
