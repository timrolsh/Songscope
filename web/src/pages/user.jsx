import spotifyApi from "@/server/spotify_api";
import SideBar from "@/components/SideBar";
import {useEffect, useState} from "react";
import SongTile from "@/components/SongTile";
import Fuse from "fuse.js";

import { getServerSession } from "next-auth/next"

let songsCache = [];

export const SongMetadata = {
    id: undefined,
    name: undefined,
    artist: undefined,
    artist_id: undefined,
    album: undefined,
    album_id: undefined,
    albumArtUrl: undefined
};

export default function Home({songsProp, sess}) {
    const [searchedSongs, setSearchedSongs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [songs, setSongs] = useState(songsProp);

    const fetchMoreSongs = async () => {
        if (loading) return; // Do not search if already searching
        if (!searchQuery) return; // Do not search if query is empty

        setLoading(true);
        try {
            const response = await fetch("/api/spotify/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({search_string: searchQuery})
            });

            if (response.ok) {
                const data = await response.json();
                // Filter out songs that are already in the list
                // Return the most popular/newest released song since that will likely be most accurate (in terms of popularity, views, etc))
                const newSongs = data.filter(
                    (song) => !songs.some((existingSong) => existingSong.id === song.id) && !songs.some((existingSong) => (existingSong.name === song.name && existingSong.artist === song.artist))
                );
                setSongs((currentSongs) => [...currentSongs, ...newSongs]);
            } else {
                console.error("Error fetching more songs from Spotify");
            }
        } catch (error) {
            console.error("Error fetching more songs:", error);
        } finally {
            setLoading(false);
        }
    };

    const fuse = new Fuse(songs, {
        keys: ["name", "artist", "album"],
        threshold: 0.4,
        findAllMatches: true,
        isCaseSensitive: false
    });

    useEffect(() => {
        if (!songs) setSearchedSongs(undefined);
        if (searchQuery === "") {
            setSearchedSongs(songs);
        } else {
            setSearchedSongs(fuse.search(searchQuery).map((result) => result.item));
        }
    }, [songs, searchQuery]);

    // TODO --> Center this properly so it doesn't look bad
    return (
        <div className="flex flex-row h-full">
            <SideBar />
            <div className="w-4/5 sm:w-5/6 h-screen overflow-auto">
                <h1 className="text-4xl font-bold px-12 pt-4">Welcome, {sess.user.name}!</h1>
                <div className="flex flex-row place-content-between px-12 mr-2">
                    <h2 className="text-xl italic text-accent-neutral/50">
                        Browse Songs, Albums, and Artists
                    </h2>
                    <input
                        className="ml-auto w-64 bg-background border-b-2 border-b-secondary/50 focus:outline-none hover:border-b-secondary/80 focus:border-b-secondary transition-all placeholder:italic placeholder:text-accent-neutral/40 text-text/90"
                        type="text"
                        placeholder="Search songs, albums, artists..."
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                    />
                    <button
                        className="ml-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
                        onClick={fetchMoreSongs}
                        disabled={loading}
                    >
                        Search Spotify
                    </button>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="border-t-4 border-b-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
                    </div>
                ) : searchedSongs.length ? (
                    <div className="grid grid-cols-4 gap-10 p-12 overflow-auto">
                        {searchedSongs.map((song) => (
                            <SongTile key={song.id} rating={true} metadata={song} />
                        ))}
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col m-auto place-content-center">
                        <div>
                            <h3 className="text-red-500 text-2xl font-bold text-center my-auto">
                                No results found.
                            </h3>
                            <h5 className="text-accent-neutral text-lg mx-auto text-center">
                                Try refining your search or search Spotify.
                            </h5>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export async function getServerSideProps(ctx) {
    // could optionally pass in AuthOptions... not too sure what it does?
    const sess = await getServerSession(ctx.req, ctx.res)

    if (!sess) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    try {
        if (songsCache.length === 0) {
            // Spotify's official Today's Top Hits playlist
            songsCache = await spotifyApi.getSongsFromPlaylist("37i9dQZF1DXcBWIGoYBM5M");
        }
        return {props: {songsProp: songsCache, sess}};
    } catch (error) {
        console.error("Error fetching songs:", error);
        return {props: {songsProp: [], sess}};
    }
}
