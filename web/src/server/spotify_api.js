import SpotifyWebApi from "spotify-web-api-node";
import dotenv from "dotenv";
dotenv.config({path: `${__dirname}/../../../.env`});

var spotifyWebApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

async function getAccessToken() {
    try {
        const data = await spotifyWebApi.clientCredentialsGrant();
        spotifyWebApi.setAccessToken(data.body["access_token"]);
        return data.body["access_token"];
    } catch (err) {
        console.error("Something went wrong when retrieving an access token", err);
        throw err;
    }
}

async function executeMethod(method, ...args) {
    const boundMethod = method.bind(spotifyWebApi);
    try {
        return await boundMethod(...args);
    } catch (err) {
        if (err.statusCode === 401) {
            await getAccessToken();
            return boundMethod(...args);
        }
        throw err;
    }
}

class SpotifyApi {
    async getAlbum(albumId) {
        const result = await executeMethod(spotifyWebApi.getAlbum.bind(spotifyWebApi), albumId);
        return {
            id: result.body.id,
            name: result.body.name,
            artist: result.body.artists[0].name,
            artist_id: result.body.artists[0].id,
            releaseDate: result.body.release_date,
            albumArtUrl: result.body.images[0].url
        };
    }

    async getSong(songId) {
        const result = await executeMethod(spotifyWebApi.getTrack.bind(spotifyWebApi), songId);
        return {
            id: result.body.id,
            name: result.body.name,
            artist: result.body.artists[0].name,
            artist_id: result.body.artists[0].id,
            album: result.body.album.name,
            album_id: result.body.album.id,
            albumArtUrl: result.body.album.images[0].url
        };
    }

    async getSongsFromAlbum(albumId) {
        const result = await executeMethod(
            spotifyWebApi.getAlbumTracks.bind(spotifyWebApi),
            albumId
        );
        return result.body.items.map((song) => ({
            id: song.id,
            name: song.name,
            artist: song.artists[0].name,
            artist_id: song.artists[0].id,
            album: song.album.name,
            album_id: song.album.id,
            albumArtUrl: song.album.images[0].url
        }));
    }

    async getSongsFromPlaylist(playlistId) {
        const result = await executeMethod(
            spotifyWebApi.getPlaylist.bind(spotifyWebApi),
            playlistId
        );
        return result.body.tracks.items.map((item) => {
            const song = item.track;
            let albumArtUrl = song.album.images.length
                ? song.album.images[0].url
                : "/no-album-cover.jpg";
            return {
                id: song.id,
                name: song.name,
                artist: song.artists[0].name,
                artist_id: song.artists[0].id,
                album: song.album.name,
                album_id: song.album.id,
                releaseDate: song.album.release_date,
                albumArtUrl: albumArtUrl,
                popularity: song.popularity,
                previewUrl: song.preview_url,
                availableMarkets: song.available_markets
            };
        });
    }
}

// Token refresh setup
setInterval(getAccessToken, 1000 * 60 * 60);
const spotifyApi = new SpotifyApi();

export default spotifyApi;
