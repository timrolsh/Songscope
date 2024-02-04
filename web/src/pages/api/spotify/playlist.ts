import {NextApiRequest, NextApiResponse} from "next";
import spotifyApi from "./wrapper";

/*
body: {
    playlist_id: "search string"
}
*/
export default async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method !== "POST") {
        response.status(400).send("Invalid request method.");
        return;
    }
    const playlist_id = request.body.playlist_id;
    if (playlist_id === undefined) {
        response.status(400).send("No playlist ID provided.");
        return;
    }

    try {
        const result = await spotifyApi.getSongsFromPlaylist(playlist_id);
        response.status(200).json(result);
    } catch (error) {
        console.error("SONGSCOPE: Error while searching content: ", error);
        response.status(500).send("An error occurred while processing your request.");
    }
};
