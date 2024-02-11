import Image from "next/image";
import SongTile from "../../components/SongTile";
import SideBar from "../../components/SideBar";

import {getServerSession} from "next-auth/next";
import {authOptions} from "./../api/auth/[...nextauth]";
import {GetServerSideProps} from "next";
import {ProfileStatistics, SongMetadata} from "@/types";
import Spinner from "@/components/Spinner";
import {User, UserProfileSongs} from "@/types";
import {Session} from "@auth/core/types";
import {useEffect, useState} from "react";
import ReviewTile from "@/components/ReviewTile";
import {AccountJoinTimestamp} from "@/dates";

interface ProfileProps {
    curSession: Session;
    userId: string;
}

export default ({curSession, userId}: ProfileProps): JSX.Element => {
    // Migrate this to use React Suspense eventually... couldn't get it working
    const [pinnedFavoritesLoading, setPinnedFavoritesLoading] = useState<boolean>(true);
    const [userProfileLoading, setUserProfileLoading] = useState<boolean>(true);
    const [sideStatsLoading, setSideStatsLoading] = useState<boolean>(true);

    const [userProfile, setUserProfile] = useState<User>();
    const [pinnedSongs, setPinnedSongs] = useState<SongMetadata[]>();
    const [favoriteSongs, setFavoriteSongs] = useState<SongMetadata[]>();

    const [pinfavChange, setPinfavChange] = useState<boolean>(false);
    const [sideStatsUpdate, setSideStatsUpdate] = useState<boolean>(false);

    const [sideStatistics, setSideStatistics] = useState<ProfileStatistics>();

    function dataEmitter() {
        // TODO --> This is a bit of a hacky way to force a re-render of the component... sidestats update could use more polishing
        setSideStatsUpdate(!sideStatsUpdate);
        setPinfavChange(!pinfavChange);
    }

    // TODO --> Deal with this...
    const [reviewsLoading, setReviewsLoading] = useState<boolean>(true);
    const [reviews, setReviews] = useState<any>();

    useEffect(() => {
        const fetchBasicProfile = async () => {
            setUserProfileLoading(true);
            const res = await fetch("/api/db/get-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({user_id: userId})
            });

            if (res.ok) {
                const data = await res.json();
                setUserProfile(data);
            } else {
                // TODO --> Redirect to error page... log error
                throw new Error(
                    "Error fetching user from database: " + res.status + " " + res.statusText
                );
            }

            setUserProfileLoading(false);
        };

        fetchBasicProfile().catch((error) => {
            console.error("Error fetching user profile:", error);
        });
    }, [userId]);

    useEffect(() => {
        const fetchFavoritesPinned = async () => {
            const res = await fetch("/api/db/fetch-profile-songs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({profile_id: userId})
            });

            if (res.ok) {
                const data: UserProfileSongs = await res.json();
                setPinnedSongs(data.pinnedSongs);
                setFavoriteSongs(data.favoritedSongs);
                fetchProfileStatistics();
            } else {
                // TODO --> Redirect to error page... log error
                throw new Error(
                    "Error fetching favorite/pinned songs: " + res.status + " " + res.statusText
                );
            }
            setPinnedFavoritesLoading(false);
        };

        fetchFavoritesPinned().catch((error) => {
            console.error("Error fetching favorite/pinned songs:", error);
        });
    }, [userId, pinfavChange]);

    const fetchProfileStatistics = async () => {
        const res = await fetch("/api/db/get-user-statistics", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({user_id: userId})
        });

        if (res.ok) {
            const data = await res.json();
            setSideStatistics(data);
            setSideStatsLoading(false);
        } else {
            // TODO --> Redirect to error page... log error
            throw new Error("Error fetching user statistics: " + res.status + " " + res.statusText);
        }
    };

    useEffect(() => {
        fetchProfileStatistics().catch((error) => {
            console.error("Error fetching user statistics:", error);
        });
    }, [userId, sideStatsUpdate]);

    return (
        <div className="flex flex-row h-full">
            <SideBar variant={"profile"} user={curSession.user} favoriteSongs={favoriteSongs} />
            <div className="w-4/5 sm:w-5/6 h-screen overflow-auto">
                <div className="pt-8 px-8">
                    {!userProfileLoading && userProfile ? (
                        <>
                            <div className="flex flex-row space-x-4">
                                <div className="flex flex-col space-y-2 w-1/6">
                                    <Image
                                        src={userProfile.image || "/default-profile.jpg"}
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
                                        <h1 className="font-bold text-2xl mx-auto">
                                            {userProfile.name}
                                        </h1>
                                        {/* TODO --> Improve placeholder */}
                                        <h3 className="text-text/90">
                                            {userProfile.bio || "No bio yet!"}
                                        </h3>
                                    </div>
                                    <h3 className="text-text/50 italic font-light sm:pb-1">
                                        Scoping out songs since:{" "}
                                        {AccountJoinTimestamp(userProfile.join_date)}
                                    </h3>
                                </div>
                                <div className="border-l-2 border-l-accent-neutral/20 pl-6 w-2/6 sm:w-1/6">
                                    <h1 className="mr-auto font-semibold text-xl pb-3">
                                        Lifetime Stats
                                    </h1>
                                    <div className="flex flex-col space-y-2">
                                        <div className="flex flex-row space-x-4">
                                            <div className="flex flex-col italic space-y-2">
                                                {!sideStatsLoading && sideStatistics ? (
                                                    <>
                                                        <h3>
                                                            Total Comments:{" "}
                                                            {sideStatistics.total_comments}
                                                        </h3>
                                                        <h3>
                                                            Total Favorites:{" "}
                                                            {sideStatistics.total_favorites}
                                                        </h3>
                                                        {/* TODO --> Figure out some nicer fallback for no rating... */}
                                                        <h3>
                                                            Average Rating:{" "}
                                                            {typeof sideStatistics.avg_rating !==
                                                            "undefined"
                                                                ? sideStatistics.avg_rating.toFixed(
                                                                      2
                                                                  )
                                                                : "N/A"}
                                                        </h3>
                                                    </>
                                                ) : (
                                                    <Spinner />
                                                )}

                                                {/* <h3>Lifetime Stars: 1432</h3>
                                                <h3>Total Replies: 102</h3>
                                                <h3>Liked Songs: 3250</h3>
                                                <h3>Followers: 105</h3>
                                                <h3>Following: 203</h3> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className="w-7/8 mr-auto border-t-2 my-6 border-secondary"></hr>
                            <div className="my-auto">
                                <h2 className="text-2xl pl-2 font-bold">Pinned Songs</h2>
                                <div className="flex flex-row w-full mx-auto place-content-between pt-5">
                                    {!pinnedFavoritesLoading && pinnedSongs ? (
                                        pinnedSongs.length ? (
                                            pinnedSongs.map((song) => (
                                                <SongTile
                                                    key={song.id}
                                                    metadata={song}
                                                    user={curSession.user as User}
                                                    dataEmitter={dataEmitter}
                                                />
                                            ))
                                        ) : (
                                            <div className="w-full flex place-content-center h-80">
                                                <h3 className="text-text/50 italic m-auto">
                                                    No pinned songs yet!
                                                </h3>
                                            </div>
                                        )
                                    ) : (
                                        <div className="h-80 flex place-content-center mx-auto">
                                            <Spinner />
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* TODO --> Impl */}
                            <div className="pt-5">
                                <h2 className="text-2xl pl-2 font-bold">Top Reviews</h2>
                                <div className="flex flex-row w-full mx-auto place-content-evenly pt-5">
                                    <ReviewTile />
                                    <ReviewTile />
                                    <ReviewTile />
                                </div>
                            </div>
                        </>
                    ) : (
                        <Spinner />
                    )}
                </div>
            </div>
        </div>
    );
};

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

    if (!ctx.params || !ctx.params.userId || typeof ctx.params.userId !== "string") {
        // 404 if no user id is provided or if malformed
        return {
            redirect: {
                destination: "/404",
                permanent: false
            }
        };
    }

    const curUserProfile: string = ctx.params?.userId;
    return {props: {curSession: session, userId: curUserProfile}};
};
