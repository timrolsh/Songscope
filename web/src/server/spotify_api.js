const SpotifyWebApi = require("spotify-web-api-node");
require("dotenv").config({path: `${__dirname}/../../../.env`});

var spotifyWebApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

function getAccessToken() {
    return spotifyWebApi.clientCredentialsGrant().then(
        function (data) {
            spotifyWebApi.setAccessToken(data.body["access_token"]);
            return Promise.resolve(data.body["access_token"]);
        },
        function (err) {
            console.error("Something went wrong when retrieving an access token", err);
            return Promise.reject(err);
        }
    );
}

function executeMethod(method, ...args) {
    const boundMethod = method.bind(spotifyWebApi);
    return boundMethod(...args).catch((err) => {
        // Token expired or not set
        if (err.statusCode === 401) {
            return getAccessToken().then(() => boundMethod(...args));
        }
        throw err;
    });
}

class SpotifyApi {
    getAlbum(albumId) {
        return executeMethod(spotifyWebApi.getAlbum.bind(spotifyWebApi), albumId).then((result) => {
            let album = {
                id: result.body.id,
                name: result.body.name,
                artist: result.body.artists[0].name,
                artist_id: result.body.artists[0].id,
                releaseDate: result.body.release_date,
                albumArtUrl: result.body.images[0].url
            };
            return Promise.resolve(album);
        });
    }
}

setInterval(getAccessToken, 1000 * 60 * 60);
const spotifyApi = new SpotifyApi();

module.exports = spotifyApi;
