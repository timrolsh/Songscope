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

    if (request.method === "POST") {
        const {user_id} = request.body;
        const explicitSongVisibility = request.body.value;
        if (user_id !== session.user.id && !session.user.isAdmin) {
            response.status(401).send("Unauthorized");
            return;
        }

        const success = await updateExplicitSongVisibility(user_id, explicitSongVisibility);
        if (success) {
            response.status(200).send("Updated explicit song visibility");
        } else {
            response.status(500).send("Failed to update explicit song visibility");
        }
        return;
    } else {
        response.status(400).send("Malformed Request Body");
        return;
    }
};

async function updateExplicitSongVisibility(user_id: string, showExplicitSongs: boolean) {
    return new Promise<boolean>((resolve, reject) => {
        db.execute(
            `
            UPDATE users
            SET show_explicit = ?
            WHERE id = ?
        `,
            [showExplicitSongs, user_id],
            (error, results, fields) => {
                if (error) {
                    console.error("SONGSCOPE: Unable to update explicit song visibility", error);
                    resolve(false);
                } else {
                    resolve(true);
                }
            }
        );
    });
}
