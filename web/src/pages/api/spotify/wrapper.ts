import {db} from "../auth/[...nextauth]";
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
        return (await this.formatSongMetadata([result.body]))[0];
    }

    async getMultipleSongs(songIds: string[]): Promise<SongMetadata[]> {
        console.log("SONGSCOPE: Getting multiple songs", songIds);
        const spotifyResponse = await executeMethod(
            spotifyWebApi.getTracks.bind(spotifyWebApi),
            songIds
        );
        return Object.values(await this.formatSongMetadata(spotifyResponse.body.tracks));
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

    /*
    This method returns an object of SongMetadata objects indexed by spotify ID, object as opposed
    to simply an array for caching purposes on the user page. 
    */
    async getSongsFromPlaylist(playlistId: string): Promise<{[key: string]: SongMetadata}> {
        const spotifyResponse = await executeMethod(
            spotifyWebApi.getPlaylist.bind(spotifyWebApi),
            playlistId
        );
        return await this.formatSongMetadata(
            spotifyResponse.body.tracks.items.map((item: any) => item.track)
        );
    }

    async searchContent(searchString: string): Promise<SongMetadata[]> {
        const spotifyResponse = await executeMethod(
            spotifyWebApi.search.bind(spotifyWebApi, searchString, ["track"])
        );
        return Object.values(await this.formatSongMetadata(spotifyResponse.body.tracks.items));
    }

    /*
    Given an array of the Spotify Web API's standard output for multiple songs, an array of 
    objects, return a formatted array of SongMetadata objects formatted for use by components
    throughout the codebase. An optimized database request is made to enrich the data directly
    from Spotify with data from our database itself, such as the average rating a song has and the
    number of reviews it has received.
    */
    async formatSongMetadata(spotifyApiResponse: any[]): Promise<{[key: string]: SongMetadata}> {
        const spotifyIds: string[] = [];
        const songMetadataMap: {[key: string]: SongMetadata} = {};
        for (let song of spotifyApiResponse) {
            spotifyIds.push(song.id);
            songMetadataMap[song.id] = {
                id: song.id,
                name: song.name,
                artist: song.artists ? song.artists[0].name : null,
                artist_id: song.artists[0].id,
                album: song.album.name,
                album_id: song.album.id,
                explicit: song.explicit,
                releaseDate: song.album.release_date,
                albumArtUrl: song.album.images.length
                    ? song.album.images[0].url
                    : "/no-album-cover.jpg",
                popularity: song.popularity,
                previewUrl: song.preview_url,
                availableMarkets: song.available_markets,
                rating: null,
                num_reviews: null
            };
        }

        const [ratingReviewCounts] = await db.promise().query(
            `
        SELECT spotify_work_id AS song_id,
            COUNT(user_id)  AS review_count,
            AVG(rating)     AS average_rating
        FROM user_song
        WHERE spotify_work_id IN (?)
        GROUP BY spotify_work_id;
        `,
            [spotifyIds]
        );
        for (const ratingReviewCount of ratingReviewCounts as any[]) {
            const songId = ratingReviewCount.song_id;
            songMetadataMap[songId].rating = ratingReviewCount.average_rating;
            songMetadataMap[songId].num_reviews = ratingReviewCount.review_count;
        }
        return songMetadataMap;
    }
}

// Token refresh setup
setInterval(getAccessToken, 1000 * 60 * 60);
const spotifyApi = new SpotifyApi();

export default spotifyApi;
