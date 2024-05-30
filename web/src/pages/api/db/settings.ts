import {NextApiRequest, NextApiResponse} from "next";
import {authOptions, db} from "../auth/[...nextauth]";
import {getServerSession} from "next-auth/next";
import {Session} from "next-auth";

export default async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method !== "POST") {
        response.status(400).send("Malformed Request Body");
        return;
    }

    const {name, bio, show_favorite_songs, show_reviews, show_explicit} = request.body;
    if (
        !name ||
        !bio ||
        show_favorite_songs === undefined ||
        show_reviews === undefined ||
        show_explicit === undefined
    ) {
        response.status(400).send("Malformed Request Body");
        return;
    }

    // @ts-expect-error
    const session: Session = await getServerSession(request, response, authOptions);
    if (!session || !session.user) {
        response.status(401).send("Unauthorized");
        return;
    }

    await db.promise().query(
        `
    UPDATE users
    SET name                = ?,
        bio                 = ?,
        show_favorite_songs = ?,
        show_reviews        = ?,
        show_explicit       = ?
    WHERE id = ?;                   
`,
        [name, bio, show_favorite_songs, show_reviews, show_explicit, session.user.id]
    );
    response.status(200).send("Updated user");
};
