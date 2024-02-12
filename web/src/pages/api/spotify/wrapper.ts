import SpotifyWebApi from "spotify-web-api-node";
import {SongMetadata} from "@/types";

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

async function executeMethod(method: any, ...args: any) {
    const boundMethod = method.bind(spotifyWebApi);
    try {
        return await boundMethod(...args);
    } catch (err: any) {
        if (err.statusCode === 401) {
            await getAccessToken();
            return boundMethod(...args);
        }
        throw err;
    }
}

class SpotifyApi {
    async getAlbum(albumId: string) {
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

    // TODO, add in market
    async getSong(songId: string): Promise<SongMetadata> {
        const result = await executeMethod(spotifyWebApi.getTrack.bind(spotifyWebApi), songId);
        return {
            id: result.body.id,
            name: result.body.name,
            artist: result.body.artists[0].name,
            artist_id: result.body.artists[0].id,
            album: result.body.album.name,
            album_id: result.body.album.id,
            albumArtUrl: result.body.album.images[0].url,
            releaseDate: result.body.album.release_date,
            popularity: result.body.popularity,
            previewUrl: result.body.preview_url,
            availableMarkets: result.body.available_markets
        };
    }

    async getMultipleSongs(songIds: string[]): Promise<SongMetadata[]> {
        console.log("SONGSCOPE: Getting multiple songs", songIds);
        const result = await executeMethod(spotifyWebApi.getTracks.bind(spotifyWebApi), songIds);
        return result.body.tracks.map((song: any) => {
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

    async getSongsFromAlbum(albumId: string): Promise<SongMetadata[]> {
        const result = await executeMethod(
            spotifyWebApi.getAlbumTracks.bind(spotifyWebApi),
            albumId
        );
        return result.body.items.map((song: any) => ({
            id: song.id,
            name: song.name,
            artist: song.artists[0].name,
            artist_id: song.artists[0].id,
            album: song.album.name,
            album_id: song.album.id,
            albumArtUrl: song.album.images[0].url
        }));
    }

    async getSongsFromPlaylist(playlistId: string): Promise<SongMetadata[]> {
        const result = await executeMethod(
            spotifyWebApi.getPlaylist.bind(spotifyWebApi),
            playlistId
        );
        return result.body.tracks.items.map((item: any) => {
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

    async searchContent(searchString: string): Promise<SongMetadata[]> {
        const result = await executeMethod(
            spotifyWebApi.search.bind(spotifyWebApi, searchString, ["track"])
        );
        let songs: SongMetadata[] = [];
        result.body.tracks.items.forEach((song: any) => {
            let albumArtUrl = song.album.images.length
                ? song.album.images[0].url
                : "/no-album-cover.jpg";
            songs.push({
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
            });
        });
        return await Promise.resolve(songs);
    }
}

// Token refresh setup
setInterval(getAccessToken, 1000 * 60 * 60);
const spotifyApi = new SpotifyApi();

export default spotifyApi;
