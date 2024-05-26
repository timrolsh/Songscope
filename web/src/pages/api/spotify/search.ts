import {NextApiRequest, NextApiResponse} from "next";
import spotifyApi from "./wrapper";

/*
Given a string that the user will pass in by a post request where the body looks like this:
body: {
    search_string: "search string"
}

Use the Spotify API to search for a song and return its results
*/
export default async (request: NextApiRequest, response: NextApiResponse) => {
    // @ts-expect-error
    const session: Session = await getServerSession(request, response, authOptions);
    if (!session || !session.user) {
        response.status(401).send("Unauthorized");
        return;
    }
    if (request.method !== "POST") {
        response.status(400).send("Invalid request method.");
        return;
    }
    const search_string = request.body.search_string;
    if (search_string === undefined) {
        response.status(400).send("No search string provided.");
        return;
    }

    try {
        const result = await spotifyApi.searchContent(search_string, session.user);
        response.status(200).json(result);
    } catch (error) {
        console.error("SONGSCOPE: Error while searching content: ", error);
        response.status(500).send("An error occurred while processing your request.");
    }
};
