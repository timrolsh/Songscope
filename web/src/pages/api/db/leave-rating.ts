// Next.js API route: /api/db/leave-rating.js

import {NextApiRequest, NextApiResponse} from "next";
import {authOptions, db} from "../auth/[...nextauth]";
import {getServerSession} from "next-auth/next";
import {RowDataPacket} from "mysql2";

export default async (request: NextApiRequest, response: NextApiResponse) => {
    // Authenticate user
    // @ts-expect-error
    const session: Session = await getServerSession(request, response, authOptions);
    if (!session || !session.user) {
        response.status(401).send("Unauthorized");
        return;
    }

    if (request.method === "POST") {
        const {songId, userId, rating} = request.body;

        // Ensure the authenticated user is the one making the request or is an admin
        if (userId !== session.user.id && !session.user.isAdmin) {
            response.status(403).send("Forbidden");
            return;
        }

        try {
            await leaveRating(songId, userId, rating);
            response.status(200).json({message: "Rating updated successfully"});
        } catch (error) {
            console.error("Failed to leave rating", error);
            response.status(500).send("Failed to leave rating");
        }
    } else {
        response.status(400).send("Invalid request method");
    }
};

async function leaveRating(songId: string, userId: number, rating: number) {
    console.log(
        "SONGSCOPE: Updating rating, songId:",
        songId,
        "userId:",
        userId,
        "rating:",
        rating
    );
    return new Promise<void>((resolve, reject) => {
        // Check if a rating by the user for the song already exists
        db.query(
            `SELECT * FROM rating WHERE spotify_work_id = ? AND user_id = ?`,
            [songId, userId],
            (error, results) => {
                if (error) {
                    reject(error);
                } else if ((results as RowDataPacket).length > 0) {
                    // Update existing rating
                    db.query(
                        `UPDATE rating SET rating = ? WHERE spotify_work_id = ? AND user_id = ?`,
                        [rating, songId, userId],
                        (updateError) => {
                            if (updateError) {
                                reject(updateError);
                            } else {
                                resolve();
                            }
                        }
                    );
                } else {
                    // Insert new rating
                    db.query(
                        `INSERT INTO rating (spotify_work_id, rating, user_id) VALUES (?, ?, ?)`,
                        [songId, rating, userId],
                        (insertError) => {
                            if (insertError) {
                                reject(insertError);
                            } else {
                                resolve();
                            }
                        }
                    );
                }
            }
        );
    });
}
