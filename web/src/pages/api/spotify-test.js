import spotifyApi from "@/server/spotify_api";

export default async (request, response) => {
    try {
        let albumId = "2QRedhP5RmKJiJ1i8VgDGR";
        let result = await spotifyApi.getAlbum(albumId);
        let albumArtUrl = result.albumArtUrl;
        response.statusCode = 200;
        response.send(albumArtUrl);
    } catch (error) {
        console.error(error);
        response.statusCode = 500;
        response.send(`Internal Server Error: {error}`);
    }
};
