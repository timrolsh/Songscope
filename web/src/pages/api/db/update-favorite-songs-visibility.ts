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
        const showFavoriteSongs = request.body.value;
        if (user_id !== session.user.id && !session.user.isAdmin) {
            response.status(401).send("Unauthorized");
            return;
        }

        const success = await updateFavoriteSongsVisibility(user_id, showFavoriteSongs);
        if (success) {
            response.status(200).send("Updated favorite songs visibility");
        } else {
            response.status(500).send("Failed to update favorite songs visibility");
        }
        return;
    } else {
        response.status(400).send("Malformed Request Body");
        return;
    }
};

async function updateFavoriteSongsVisibility(user_id: string, showFavoriteSongs: boolean) {
    console.log("SONGSCOPE: updating favorite songs visibility: user_id ", user_id, ", visible: ", showFavoriteSongs);
    return new Promise<boolean>((resolve, reject) => {
        db.execute(
            `
            UPDATE users
            SET show_favorite_songs = ?
            WHERE id = ?
        `,
            [showFavoriteSongs, user_id],
            (error, results, fields) => {
                console.log("SONGSCOPE: Updated favorite songs visibility");
                if (error) {
                    console.error("SONGSCOPE: Unable to update favorite songs visibility", error);
                    resolve(false);
                } else {
                    resolve(true);
                }
            }
        );
    });
}
