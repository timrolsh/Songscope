import {db} from "../auth/[...nextauth]";
import SpotifyWebApi from "spotify-web-api-node";
import {SongMetadata, User} from "@/types";

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
    async getMultipleSongs(songIds: string[], user: User): Promise<{[key: string]: SongMetadata}> {
        const spotifyResponse = await executeMethod(
            spotifyWebApi.getTracks.bind(spotifyWebApi),
            songIds
        );
        return await this.formatSongMetadata(spotifyResponse.body.tracks, user);
    }

    /*
    This method returns an object of SongMetadata objects indexed by spotify ID, object as opposed
    to simply an array for caching purposes on the user page. 
    */
    async getSongsFromPlaylist(
        playlistId: string,
        user: User
    ): Promise<{[key: string]: SongMetadata}> {
        const spotifyResponse = await executeMethod(
            spotifyWebApi.getPlaylist.bind(spotifyWebApi),
            playlistId
        );
        return await this.formatSongMetadata(
            spotifyResponse.body.tracks.items.map((item: any) => item.track),
            user
        );
    }

    async searchContent(searchString: string, user: User): Promise<SongMetadata[]> {
        const spotifyResponse = await executeMethod(
            spotifyWebApi.search.bind(spotifyWebApi, searchString, ["track"])
        );
        return Object.values(
            await this.formatSongMetadata(spotifyResponse.body.tracks.items, user)
        );
    }

    /*
    Given an array of the Spotify Web API's standard output for multiple songs, an array of 
    objects, return a formatted array of SongMetadata objects formatted for use by components
    throughout the codebase. An optimized database request is made to enrich the data directly
    from Spotify with data from our database itself, such as the average rating a song has and the
    number of reviews it has received.
    */
    async formatSongMetadata(
        spotifyApiResponse: any[],
        user: User
    ): Promise<{[key: string]: SongMetadata}> {
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
                avg_rating: null,
                num_reviews: null,
                user_rating: null,
                pinned: false,
                favorited: false
            };
        }

        const [ratingReviewCounts] = await db.promise().query(
            `
        SELECT a.spotify_work_id AS song_id,
            COUNT(b.user_id)  AS num_reviews,
            AVG(b.rating)     AS avg_rating,
            a.rating          AS user_rating,
            a.pinned          AS pinned,
            a.favorite        AS favorited
        FROM user_song AS a
                LEFT JOIN
            user_song AS b
            ON
                a.spotify_work_id = b.spotify_work_id
        WHERE a.spotify_work_id IN (?)
            AND a.user_id = ?
        GROUP BY a.spotify_work_id, a.user_id, a.rating, a.pinned, a.favorite;
        `,
            [spotifyIds, user.id]
        );
        for (const ratingReviewCount of ratingReviewCounts as any[]) {
            const songId = ratingReviewCount.song_id;
            songMetadataMap[songId].avg_rating = ratingReviewCount.avg_rating;
            songMetadataMap[songId].num_reviews = ratingReviewCount.num_reviews;
            songMetadataMap[songId].user_rating = ratingReviewCount.user_rating;
            songMetadataMap[songId].pinned = ratingReviewCount.pinned;
            songMetadataMap[songId].favorited = ratingReviewCount.favorited;
        }
        return songMetadataMap;
    }
}

// Token refresh setup
setInterval(getAccessToken, 1000 * 60 * 60);
const spotifyApi = new SpotifyApi();

export default spotifyApi;
