import {NextApiRequest, NextApiResponse} from "next";
import {authOptions, db} from "../auth/[...nextauth]";
import {getServerSession} from "next-auth/next";
import {User} from "@/types";

// Maybe look into just inserting with the current server session userid?
export default async (request: NextApiRequest, response: NextApiResponse) => {
    // @ts-expect-error
    const session = await getServerSession(request, response, authOptions);
    if (!session || !session.user) {
        response.status(401).send("Unauthorized");
        return;
    }

    const user: User = session.user;

    if (request.method === "POST") {
        const {songid, reviewbody} = request.body;

        if (!songid || !reviewbody) {
            response.status(400).send("Malformed Request Body");
            return;
            // TODO --> improve the comparison check here
        } else if (String(user.id) !== request.body.userid) {
            response.status(401).send("Unauthorized");
            return;
        }

        await db.query(
            `
        INSERT INTO comment(user_id, spotify_work_id, comment_text)
        VALUES(?, ?, ?)`,
            [user.id, songid, reviewbody]
        );
        response.status(200).send("Inserted review");
        return;
    } else {
        response.status(400).send("Malformed Request Body");
        return;
    }
};
