import {db} from "../auth/[...nextauth]";
import {RowDataPacket} from "mysql2";
import SpotifyWebApi from "spotify-web-api-node";
import {SongMetadata} from "@/types";
import { fetchProfile } from "../db/fetch-profile-songs";

var spotifyWebApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
}

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
        const rating = await this.fetchSongRating(songId);
        return {
            id: result.body.id,
            name: result.body.name,
            artist: result.body.artists[0].name,
            artist_id: result.body.artists[0].id,
            album: result.body.album.name,
            album_id: result.body.album.id,
            explicit: result.body.explicit,
            albumArtUrl: result.body.album.images[0].url,
            releaseDate: result.body.album.release_date,
            popularity: result.body.popularity,
            previewUrl: result.body.preview_url,
            availableMarkets: result.body.available_markets,
            rating: rating
        };
    }

    async getMultipleSongs(songIds: string[]): Promise<SongMetadata[]> {
        console.log("SONGSCOPE: Getting multiple songs", songIds);
        const result = await executeMethod(spotifyWebApi.getTracks.bind(spotifyWebApi), songIds);
        const songs: SongMetadata[] = [];
        for (const song of result.body.tracks) {
            const rating = await this.fetchSongRating(song.id);
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
                explicit: song.explicit,
                releaseDate: song.album.release_date,
                albumArtUrl: albumArtUrl,
                popularity: song.popularity,
                previewUrl: song.preview_url,
                availableMarkets: song.available_markets,
                rating: rating
            });
        }
        return songs;
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
        const songs: SongMetadata[] = [];
        for (const item of result.body.tracks.items) {
            const song = item.track;
            const rating = await this.fetchSongRating(song.id);
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
                explicit: song.explicit,
                releaseDate: song.album.release_date,
                albumArtUrl: albumArtUrl,
                popularity: song.popularity,
                previewUrl: song.preview_url,
                availableMarkets: song.available_markets,
                rating: rating
            });
        }
        return songs;
    }

    async searchContent(searchString: string): Promise<SongMetadata[]> {
        const result = await executeMethod(
            spotifyWebApi.search.bind(spotifyWebApi, searchString, ["track"])
        );
        let songs: SongMetadata[] = [];
        for (const song of result.body.tracks.items) {
            const rating = await this.fetchSongRating(song.id);
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
                explicit: song.explicit,
                releaseDate: song.album.release_date,
                albumArtUrl: albumArtUrl,
                popularity: song.popularity,
                previewUrl: song.preview_url,
                availableMarkets: song.available_markets,
                rating: rating
            });
        }
        return songs;
    }

    // seeded tracks are based on user's liked songs on songscope
    async getMoreRecommendations(userId: string | undefined): Promise<SongMetadata[]> {
        let seedTracks: string[] = [];

        if(userId) {
            const likedSongs = (await fetchProfile(userId)).favoritedSongs;
            
            if(likedSongs.length) {
                shuffleArray(likedSongs);
                seedTracks = likedSongs.map((song: SongMetadata) => song.id).slice(0, 5);
            }
        }

        let result;
        if(seedTracks.length === 0) {
            result = await executeMethod(
                spotifyWebApi.getRecommendations.bind(spotifyWebApi, {
                    limit: 30,
                    seed_genres: ["pop", "hip-hop", "rap", "indie", "edm"]
                })    
            );
        } else {
            result = await executeMethod(
                spotifyWebApi.getRecommendations.bind(spotifyWebApi, {
                    limit: 30,
                    seed_tracks: seedTracks
                })
            );
        }

        let songs: SongMetadata[] = [];
        for (const song of result.body.tracks) {
            const rating = await this.fetchSongRating(song.id);
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
                explicit: song.explicit,
                releaseDate: song.album.release_date,
                albumArtUrl: albumArtUrl,
                popularity: song.popularity,
                previewUrl: song.preview_url,
                availableMarkets: song.available_markets,
                rating: rating
            });
        }
        return songs;
    }

    async fetchSongRating(songid: string): Promise<number | null> {
        try {
            const [rows] = (await db.promise().query(
                `select avg(rating) as avg_rating
                from user_song
                where spotify_work_id = ?;`,
                [songid]
            )) as RowDataPacket[];
            return rows.length > 0 ? rows[0].avg_rating : null;
        } catch (error) {
            console.error("SONGSCOPE: Unable to fetch song rating", error);
            throw error; // Rethrow the error to be caught by the caller
        }
    }
}

// Token refresh setup
setInterval(getAccessToken, 1000 * 60 * 60);
const spotifyApi = new SpotifyApi();

export default spotifyApi;
