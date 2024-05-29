import {NextApiRequest, NextApiResponse} from "next";
import spotifyApi from "./wrapper";
import {getServerSession} from "next-auth";
import {authOptions} from "../auth/[...nextauth]";

/*
body: {
    user_id: userId
}
*/
export default async (request: NextApiRequest, response: NextApiResponse) => {
    // @ts-expect-error
    const session: Session = await getServerSession(request, response, authOptions);
    if (!session || !session.user) {
        response.status(401).send("Unauthorized");
        return;
    }

    try {
        const result = await spotifyApi.getMoreRecommendations(session.user);
        response.status(200).json(result);
    } catch (error) {
        console.error("SONGSCOPE: Error while searching content: ", error);
        response.status(500).send("An error occurred while processing your request.");
    }
};
