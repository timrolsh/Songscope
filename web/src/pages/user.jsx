import spotifyApi from "@/server/spotify_api";

import SideBar from "@/components/SideBar";
import {useEffect, useState} from "react";

import SongTile from "@/components/SongTile";
import Fuse from "fuse.js";

import { getServerSession } from "next-auth/next"


let songs = [];

export const SongMetadata = {
    id: undefined,
    name: undefined,
    artist: undefined,
    artist_id: undefined,
    album: undefined,
    album_id: undefined,
    albumArtUrl: undefined
};

export default ({songs, sess}) => {
    const [searchedSongs, setSearchedSongs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const fuse = new Fuse(songs, {
        keys: ["name", "artist", "album"],
        threshold: 0.4,
        findAllMatches: true,
        isCaseSensitive: false
    });

    useEffect(() => {
        console.log("searched: ", searchedSongs);
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
                        onChange={(event) => {
                            setSearchQuery(event.target.value);
                        }}
                    />
                </div>
                {searchedSongs.length ? (
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
                                Try refining your search.
                            </h5>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export async function getServerSideProps(ctx) {
    // could optionally pass in AuthOptions... not too sure what it does?
    const sess = await getServerSession(ctx.req, ctx.res)

    console.log("received session:", sess)

    if (!sess) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    try {
        if (songs.length === 0) {
            // Spotify's official Today's Top Hits playlist
            songs = await spotifyApi.getSongsFromPlaylist("37i9dQZF1DXcBWIGoYBM5M");
        }
        return {props: {songs: songs, sess}};
    } catch (error) {
        console.error("Error fetching songs:", error);
        return {props: {songs: [], sess}};
    }
}
