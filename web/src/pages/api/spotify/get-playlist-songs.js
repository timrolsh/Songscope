import spotifyApi from "@/server/spotify_api";

export default async (req, res) => {
    try {
        let result = await spotifyApi.getSongsFromPlaylist(req.body.id);
        res.statusCode = 200;
        res.send(result);
    } catch (error) {
        console.error(error);
        res.statusCode = 500;
        res.send(`Internal Server Error: {error}`);
    }
};
