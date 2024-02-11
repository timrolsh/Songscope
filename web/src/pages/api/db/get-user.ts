import {NextApiRequest, NextApiResponse} from "next";
import {db} from "../auth/[...nextauth]";
import {RowDataPacket} from "mysql2";
import {User} from "@/types";

// TODO: Add authentication
export default async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "POST") {
        const user_id = request.body.user_id as string;
        const results = await getUsers(user_id);
        // TODO --> Swap from JSON stringify to just pure JSON
        response.status(200).send(JSON.stringify(results));
        return;
    } else {
        response.status(400).send("Malformed Request");
        return;
    }
};

// Returns everything needed for the user profile
async function getUsers(user_id: string): Promise<User> {
    try {
        const [userData] = (
            await db.promise().query(
                `
            select u.id, u.name, u.email, u.image, u.bio, u.join_date, u.isAdmin
                from users u
                where id=?;`,
                [user_id]
            )
        )[0] as RowDataPacket[];

        let user: User = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            image: userData.image,
            bio: userData.bio,
            join_date: userData.join_date,
            role: "", // TODO --> update this when admin accounts exist
            isAdmin: Boolean(userData.isAdmin),
        };
        return user;
    } catch (error) {
        console.error("SONGSCOPE: Unable to fetch reviews", error);
        throw error; // Rethrow the error to be caught by the caller
    }
}
