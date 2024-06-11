import SideBar from "../components/SideBar";
import {useEffect, useRef, useState} from "react";
import SongTile from "../components/SongTile";
import Fuse from "fuse.js";
import {getServerSession} from "next-auth/next";
import {authOptions, db} from "./api/auth/[...nextauth]";
import {GetServerSideProps} from "next";
import Spinner from "@/components/Spinner";
import {SongMetadata, User} from "@/types";
import Head from "next/head";
import spotifyApi from "./api/spotify/wrapper";

export default ({
    user,
    hotSongs,
    topSongs
}: {
    user: User;
    hotSongs: SongMetadata[];
    topSongs: SongMetadata[];
}): JSX.Element => {
    const [searchedSongs, setSearchedSongs] = useState<SongMetadata[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [moreLoading, setMoreLoading] = useState(false);
    const [songs, setSongs] = useState<SongMetadata[]>([]);
    const [firstHydration, setFirstHydration] = useState(true);
    const [importedNewSongs, setImportedNewSongs] = useState(false);

    const imported = () => {
        setImportedNewSongs(!importedNewSongs);
    };

    const bottomElementRef = useRef(null);

    // This is infinite scroll recommendation fetching
    const getAdditionalRecommendations = async () => {
        if (moreLoading) return;
        setMoreLoading(true);

        try {
            const res = await fetch("/api/spotify/get-recommendations");

            if (res.ok) {
                const data = await res.json();

                let newSongs = data.filter(
                    (song: SongMetadata) =>
                        !songs.some((existingSong) => existingSong.id === song.id) ||
                        !songs.some(
                            (existingSong) =>
                                existingSong.name === song.name &&
                                existingSong.artist === song.artist
                        ) ||
                        !searchedSongs.some((existingSong) => existingSong.id === song.id)
                );
                if (!user.show_explicit) {
                    newSongs = newSongs.filter((song: SongMetadata) => !song.explicit);
                }

                const newSetSongs = songs.concat(newSongs);
                const m = new Map();
                setSongs(newSetSongs.filter((song) => !m.has(song.id) && m.set(song.id, 1)));
                imported();
                // setSongs((currentSongs) => [...currentSongs, ...newSongs]);
            } else {
                console.error("Error fetching more recommendations");
                console.error(res.status, res.statusText);
            }
        } catch (error) {
            console.error("Error fetching more recommendations:", error);
        } finally {
            setMoreLoading(false);
        }
    };

    // This function is meant for a search-based fetch
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
                imported();
            } else {
                console.error("Error fetching more songs from Spotify");
            }
        } catch (error) {
            console.error("Error fetching more songs:", error);
        } finally {
            setLoading(false);
        }
    };

    let fuse = new Fuse(songs, {
        keys: ["name", "artist", "album"],
        threshold: 0.4,
        findAllMatches: true,
        isCaseSensitive: false
    });

    useEffect(() => {
        fuse = new Fuse(songs, {
            keys: ["name", "artist", "album"],
            threshold: 0.4,
            findAllMatches: true,
            isCaseSensitive: false
        });
    }, [importedNewSongs]);

    useEffect(() => {
        const initSongs = async () => {
            setLoading(true);
            await getAdditionalRecommendations();
            setFirstHydration(false);
            setLoading(false);
        };
        initSongs().catch((error) => {
            console.error("Error fetching songs:", error);
        });
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const results = fuse.search(searchQuery).map((result) => result.item);
            setSearchedSongs(results);
        } else {
            setSearchedSongs(songs);
        }
    }, [songs, searchQuery]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && !firstHydration) {
                    getAdditionalRecommendations();
                }
            },
            {
                root: null,
                rootMargin: "20px",
                threshold: 1.0
            }
        );

        if (bottomElementRef.current) {
            observer.observe(bottomElementRef.current);
        }

        return () => {
            if (bottomElementRef.current) {
                observer.unobserve(bottomElementRef.current);
            }
        };
    }, [loading]);

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
                        <div className="h-full w-full flex place-content-center">
                            <Spinner />
                        </div>
                    ) : searchedSongs.length ? (
                        <div className="flex flex-row flex-wrap gap-10 p-12 overflow-auto">
                            {searchedSongs.map((song) => (
                                <SongTile key={song.id} songMetadata={song} user={user} />
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
                    {moreLoading && !loading && !searchQuery && (
                        <div className="flex h-24 justify-center items-center m-auto">
                            <Spinner />
                        </div>
                    )}
                    <div ref={bottomElementRef}></div> {/* This is the bottom element */}
                </div>
            </div>
        </>
    );
};

/*
Cache the top and hot songs
*/
let topSongs: SongMetadata[] = [];
let hotSongs: SongMetadata[] = [];
let lastRequestTime = 0;
async function loadTopAndHotSongs(user: User) {
    const {rows} = await db.query(
        `
    (SELECT spotify_work_id,
            COUNT(*)  AS num_reviews,
            MAX(time) AS latest_review_time,
            TRUE      AS is_hot,
            FALSE     AS is_top
    FROM comments
    WHERE time >= NOW() - INTERVAL '7 days'
    GROUP BY spotify_work_id
    ORDER BY num_reviews DESC, latest_review_time DESC
    LIMIT 5)
    UNION ALL
    (SELECT spotify_work_id,
            COUNT(*)  AS num_reviews,
            MAX(time) AS latest_review_time,
            FALSE     AS is_hot,
            TRUE      AS is_top
    FROM comments
    GROUP BY spotify_work_id
    ORDER BY num_reviews DESC, latest_review_time DESC
    LIMIT 5)
    ORDER BY is_hot DESC, num_reviews DESC, latest_review_time DESC;
        `
    );
    const songIds: Set<string> = new Set();
    for (const row of rows) {
        songIds.add(row.spotify_work_id);
    }
    let songs: {[key: string]: SongMetadata} = {}
    if (songIds.size > 0) {
        songs = await spotifyApi.getMultipleSongs(Array.from(songIds), user);
    }
    for (const row of rows) {
        if (row.is_hot) {
            hotSongs.push(songs[row.spotify_work_id]);
        }
        if (row.is_top) {
            topSongs.push(songs[row.spotify_work_id]);
        }
    }
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
    if (Date.now() / 1000 - lastRequestTime > 120) {
        hotSongs = [];
        topSongs = [];
        await loadTopAndHotSongs(session.user);
        lastRequestTime = Date.now() / 1000;
    }
    return {
        props: {
            user: session.user,
            hotSongs,
            topSongs
        }
    };
};
