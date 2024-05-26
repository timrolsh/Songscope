import SideBar from "../components/SideBar";
import {useEffect, useState} from "react";
import SongTile from "../components/SongTile";
import Fuse from "fuse.js";
import {getServerSession} from "next-auth/next";
import {authOptions, db} from "./api/auth/[...nextauth]";
import {GetServerSideProps} from "next";
import Spinner from "@/components/Spinner";
import {SongMetadata, User, SongReviewRow} from "@/types";
import Head from "next/head";
import spotifyApi from "./api/spotify/wrapper";

export default ({
    user,
    hotSongs,
    topSongs,
    initialSongs
}: {
    user: User;
    hotSongs: SongMetadata[];
    topSongs: SongMetadata[];
    initialSongs: SongMetadata[];
}): JSX.Element => {
    const [searchedSongs, setSearchedSongs] = useState<SongMetadata[]>(initialSongs);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [songs, setSongs] = useState<SongMetadata[]>(initialSongs);

    const fetchMoreSongs = async () => {
        if (loading || !searchQuery) return; // Do not search if already searching or query is empty

        setLoading(true);
        try {
            const response = await fetch("/api/spotify/search", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({search_string: searchQuery})
            });

            if (response.ok) {
                const newSongs = await response.json();
                const filteredSongs = newSongs
                    .filter(
                        (song: SongMetadata) =>
                            !songs.some((existingSong) => existingSong.id === song.id)
                    )
                    .filter((song: SongMetadata) => user.show_explicit || !song.explicit);
                setSongs((currentSongs) => [...currentSongs, ...filteredSongs]);
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
        if (searchQuery) {
            const results = fuse.search(searchQuery).map((result) => result.item);
            setSearchedSongs(results);
        } else {
            setSearchedSongs(songs);
        }
    }, [songs, searchQuery]);

    // TODO --> Center this properly so it doesn't look bad
    return (
        <>
            <Head>
                <title>Songscope - User</title>
            </Head>
            <div className="flex flex-row h-full">
                <SideBar variant="" user={user} hotSongs={hotSongs} topSongs={topSongs} />
                <div className="w-4/5 sm:w-5/6 h-screen overflow-auto">
                    <div className="flex flex-col h-24">
                        <h1 className="text-4xl font-bold px-12 pt-4">Welcome, {user.name}!</h1>
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
                                className="ml-4 bg-secondary/80 hover:bg-secondary text-text/80 hover:text-text py-2 px-4 rounded-md transition"
                                onClick={fetchMoreSongs}
                                disabled={loading}
                            >
                                Search Spotify
                            </button>
                        </div>
                    </div>
                    {loading ? (
                        <Spinner />
                    ) : searchedSongs.length ? (
                        <div className="flex flex-row flex-wrap gap-10 p-12 overflow-auto">
                            {searchedSongs.map((song) => (
                                <SongTile
                                    key={song.id}
                                    songMetadata={song}
                                    user={user}
                                />
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
        </>
    );
};

// it is this method here that is causing the thing to fail
async function loadTopAndHotSongs(user: User) {
    const limit = 5;
    // get a date for a week ago
    let date = new Date();
    date.setDate(date.getDate() - 7);
    // put date into mysql format
    const daysAgo = 7; // Number of days to consider a song as hot
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - daysAgo);

    const [rows] = await db.promise().query<SongReviewRow[]>(
        `
        SELECT c.spotify_work_id, COUNT(*) as num_reviews,
            CASE WHEN c.time >= ? THEN 1 ELSE 0 END as is_hot
        FROM comment c
        GROUP BY c.spotify_work_id
        ORDER BY num_reviews DESC, c.time DESC
        LIMIT ?;
        `,
        [recentDate, 10]
    );

    // Extract all Spotify IDs to fetch in bulk and fetch song metadata in bulk
    const songsMetadata = Object.values(
        await spotifyApi.getMultipleSongs(
            rows.map((row) => row.spotify_work_id),
            user
        )
    );

    // Enrich the metadata with review counts and hotness
    const enrichedData = songsMetadata.map((songMetadata) => {
        const songExtra = rows.find((row) => row.spotify_work_id === songMetadata.id);
        return {
            ...songMetadata,
            num_reviews: songExtra ? songExtra.num_reviews : null,
            is_hot: songExtra ? songExtra.is_hot : null
        };
    });

    // Separate into top and hot songs based on flags and limiting the results
    return {
        topSongs: enrichedData.filter((song) => !song.is_hot).slice(0, limit),
        hotSongs: enrichedData.filter((song) => song.is_hot).slice(0, limit)
    };
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    // @ts-expect-error
    const session = await getServerSession(ctx.req, ctx.res, authOptions);

    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        };
    }

    // Ensure join_date is null if it's undefined
    if (session.user && session.user.join_date === undefined) {
        session.user.join_date = null; // Or apply any other default value/formatting
    }
    let {hotSongs, topSongs} = await loadTopAndHotSongs(session.user);
    return {
        props: {
            user: session.user,
            hotSongs,
            topSongs,
            initialSongs: Object.values(
                await spotifyApi.getSongsFromPlaylist("37i9dQZEVXbLp5XoPON0wI", session.user)
            )
        }
    };
};
