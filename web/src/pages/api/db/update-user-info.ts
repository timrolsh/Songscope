import {NextApiRequest, NextApiResponse} from "next";
import {authOptions, db} from "../auth/[...nextauth]";
import {getServerSession} from "next-auth/next";
import {User} from "@/types";
import {RowDataPacket} from "mysql2";

// TODO: Add authentication
export default async (request: NextApiRequest, response: NextApiResponse) => {
    // @ts-expect-error
    const session = await getServerSession(request, response, authOptions);
    if (!session) {
        response.status(401).send("Unauthorized");
        return;
    }

    const user: User = session.user;
    if (request.method === "POST") {
        console.log("reqbody:", request.body);
        const name = request.body.displayName;
        const bio = request.body.bio;
        if (user.id !== request.body.user_id) {
            response.status(401).send("Unauthorized");
            return;
        }
        // make sure new name is not already taken
        const nameTaken: boolean = await checkName(name);
        if (nameTaken) {
            response.status(409).send("Name already taken");
            return;
        }
        await updateUserInfo(user.id, name, bio);
        response.status(200).send("Updated user info");
        return;
    } else {
        response.status(400).send("Malformed Request Body");
        return;
    }
};

async function checkName(name: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        db.execute(
            `
            SELECT id
            FROM users
            WHERE name = ?
        `,
            [name],
            (error, results, fields) => {
                if (error) {
                    console.error("SONGSCOPE: Unable to check name", error);
                    resolve(true);
                } else {
                    resolve((results as RowDataPacket[]).length > 0);
                }
            }
        );
    });
}

async function updateUserInfo(userid: string, name: string, bio: string) {
    console.log("SONGSCOPE: changing user info, userid:", userid, "name:", name, "bio:", bio);
    db.execute(
        `
        UPDATE users
        SET name = ?, bio = ?
        WHERE id = ?
    `,
        [name, bio, userid],
        (error, results, fields) => {
            if (error) {
                console.error("SONGSCOPE: Unable to update user info", error);
            }
        }
    );
}
