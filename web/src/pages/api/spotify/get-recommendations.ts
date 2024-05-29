import {NextApiRequest, NextApiResponse} from "next";
import spotifyApi from "./wrapper";

/*
body: {
    user_id: userId
}
*/
export default async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method !== "POST") {
        response.status(400).send("Invalid request method.");
        return;
    }
    const userId: string = request.body.user_id;
    if (userId === undefined) {
        response.status(400).send("No userId provided.");
        return;
    }

    try {
        const result = await spotifyApi.getMoreRecommendations(userId);
        response.status(200).json(result);
    } catch (error) {
        console.error("SONGSCOPE: Error while searching content: ", error);
        response.status(500).send("An error occurred while processing your request.");
    }
};
