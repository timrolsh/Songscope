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

    if (request.method === "DELETE") {
        console.log("reqbody:", request.body);
        const {user_id} = request.body;

        if (user_id !== session.user.id && !session.user.isAdmin) {
            response.status(401).send("Unauthorized");
            return;
        }

        const success = await deleteUser(user_id);
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

async function deleteUser(user_id: string) {
    console.log("SONGSCOPE: Deleting user, user_id:", user_id);
    return new Promise<boolean>((resolve, reject) => {
        db.execute(
            `
            DELETE FROM users
            WHERE id = ?
        `,
            [user_id],
            (error, results, fields) => {
                console.log("SONGSCOPE: Deleted user");
                if (error) {
                    console.error("SONGSCOPE: Unable to delete user", error);
                    resolve(false);
                } else {
                    resolve(true);
                }
            }
        );
    });
}
