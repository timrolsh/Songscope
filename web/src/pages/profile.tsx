import Image from "next/image";
import SongTile from "../components/SongTile";
import SideBar from "../components/SideBar";

import {getServerSession} from "next-auth/next";
import {authOptions} from "./api/auth/[...nextauth]";
import {GetServerSideProps} from "next";
import {SongMetadata, UserProps} from "./user";
import {useEffect, useState} from "react";
import Spinner from "@/components/Spinner";

function ReviewTile() {
    return (
        <div className="rounded-xl h-32 w-64 px-4 py-2 border border-secondary/20 bg-secondary/5 flex flex-col">
            <h3 className="font-bold italic text-text/90">Pain 1993 - Drake</h3>
            <p className="font-normal text-secondary/90 text-sm">Why lorem text placeholder...</p>
            <div className="mt-auto flex flex-row place-content-between">
                <p className="font-semibold text-text/80 text-md italic">24 Stars</p>
                <p className="font-bold text-text/80 text-md italic ml-auto">125 Views</p>
            </div>
        </div>
    );
}

export default ({curSession: session}: UserProps): JSX.Element => {
    const [songs, setSongs] = useState<SongMetadata[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const initSongs = async () => {
            setLoading(true);

            const res = await fetch("/api/spotify/playlist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({playlist_id: "0OwFb8rH79YQ76ln376pyn"})
            });

            if (res.ok) {
                const data = await res.json();
                setSongs(songs.concat(data));
            } else {
                throw new Error(
                    "Error fetching songs from Spotify: " + res.status + " " + res.statusText
                );
            }

            setLoading(false);
        };

        initSongs().catch((error) => {
            console.error("Error fetching songs:", error);
        });
    }, []);

    return (
        <div className="flex flex-row h-full">
            <SideBar variant={"profile"} />
            <div className="w-4/5 sm:w-5/6 h-screen overflow-auto">
                <div className="pt-8 px-8">
                    <div className="flex flex-row space-x-4">
                        <div className="flex flex-col space-y-2 w-1/6">
                            <Image
                                src={session.user?.image || "/default-profile.jpg"}
                                width={225}
                                height={225}
                                className="border border-accent-neutral/30 rounded-xl"
                                alt="Profile Picture"
                            ></Image>
                            <div className="flex flex-row space-x-2">
                                {/* <div className="w-5 h-5 rounded-2xl bg-lime-400 mb-auto"></div> */}
                            </div>
                        </div>
                        <div className="w-1/2 sm:w-4/6 text-lg flex flex-col place-content-between">
                            <div>
                                {session.user && (
                                    <h1 className="font-bold text-2xl mx-auto">
                                        {session.user.name}
                                    </h1>
                                )}
                                <h3>
                                    I love music, and I love sharing my thoughts with the world!
                                    Everyone should know what I think about all the songs, and I
                                    have the best music taste ever!
                                </h3>
                            </div>
                            <h3 className="text-text/50 italic font-light sm:pb-1">
                                Scoping out songs since: Nov 2, 2023
                            </h3>
                        </div>
                        <div className="border-l-2 border-l-accent-neutral/20 pl-6 w-2/6 sm:w-1/6">
                            <h1 className="mr-auto font-semibold text-xl pb-3">Lifetime Stats</h1>
                            <div className="flex flex-col space-y-2">
                                <div className="flex flex-row space-x-4">
                                    <div className="flex flex-col italic space-y-2">
                                        <h3>Lifetime Stars: 1432</h3>
                                        <h3>Total Replies: 102</h3>
                                        <h3>Liked Songs: 3250</h3>
                                        <h3>Followers: 105</h3>
                                        <h3>Following: 203</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="w-7/8 mr-auto border-t-2 my-6 border-secondary"></hr>
                    <div>
                        <h2 className="text-2xl pl-2 font-bold">Pinned Songs</h2>
                        <div className="flex flex-row w-full mx-auto place-content-between pt-5">
                            {!loading && songs ? (
                                songs
                                    .slice(0, 4)
                                    .map((song) => (
                                        <SongTile
                                            key={song.id}
                                            metadata={song}
                                            user={session.user}
                                        />
                                    ))
                            ) : (
                                <div className="h-80 flex place-content-center mx-auto">
                                    <Spinner />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="pt-5">
                        <h2 className="text-2xl pl-2 font-bold">Top Reviews</h2>
                        <div className="flex flex-row w-full mx-auto place-content-evenly pt-5">
                            <ReviewTile />
                            <ReviewTile />
                            <ReviewTile />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Mi
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

    return {props: {curSession: session}};
};
