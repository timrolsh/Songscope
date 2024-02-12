import {NextApiRequest, NextApiResponse} from "next";
import {authOptions, db} from "../auth/[...nextauth]";
import {getServerSession} from "next-auth/next";
import {User} from "@/types";

// TODO: Add authentication
export default async (request: NextApiRequest, response: NextApiResponse) => {
    // @ts-expect-error
    const session = await getServerSession(request, response, authOptions);
    if (!session) {
        response.status(401).send("Unauthorized");
        return;
    }

    // @ts-expect-error
    const user: User = session.user;

    if (request.method === "POST") {
        console.log("reqbody:", request.body);
        const {songid, reviewbody} = request.body;

        await insertReview(songid, user.id, reviewbody);
        response.status(200).send("Inserted review");
        return;
    } else {
        response.status(400).send("Malformed Request Body");
        return;
    }
};

async function insertReview(songid: string, userid: string, reviewtext: string) {
    console.log(
        "SONGSCOPE: Inserting review, songid:",
        songid,
        "userid:",
        userid,
        "reviewtext:",
        reviewtext
    );
    db.execute(
        `
        INSERT INTO comment(user_id, spotify_work_id, comment_text)
        VALUES(?, ?, ?)    
    `,
        [userid, songid, reviewtext],
        (error, results, fields) => {
            console.log("SONGSCOPE: Inserted review");
            if (error) {
                console.error("SONGSCOPE: Unable to insert review", error);
                return false;
            }
            return true;
        }
    );
}
