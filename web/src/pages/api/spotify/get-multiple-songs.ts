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
    const song_ids: string[] = request.body.song_ids;
    if (song_ids === undefined) {
        response.status(400).send("No song_ids parameter found.");
        return;
    }

    try {
        const result = await spotifyApi.getMultipleSongs(song_ids);
        response.status(200).json(result);
    } catch (error) {
        console.error("SONGSCOPE: Error while searching content: ", error);
        response.status(500).send("An error occurred while processing your request.");
    }
};
