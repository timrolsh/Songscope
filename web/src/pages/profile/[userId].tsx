import Image from "next/image";
import SongTile from "../../components/SongTile";
import SideBar from "../../components/SideBar";

import {getServerSession} from "next-auth/next";
import {authOptions, db} from "./../api/auth/[...nextauth]";
import {GetServerSideProps} from "next";
import {ProfileStatistics, SongMetadata, ProfileTopReviews} from "@/types";
import Spinner from "@/components/Spinner";
import {User} from "@/types";
import ReviewTile from "@/components/ReviewTile";
import {AccountJoinTimestamp} from "@/dates";
import Head from "next/head";
import clsx from "clsx";
import spotifyApi from "../api/spotify/wrapper";

export default ({
    user,
    sideStatistics,
    reviews,
    favoriteSongs,
    pinnedSongs,
    targetUser
}: {
    user: User;
    userId: string;
    sideStatistics: ProfileStatistics;
    reviews: ProfileTopReviews[];
    favoriteSongs: SongMetadata[];
    pinnedSongs: SongMetadata[];
    targetUser: User;
}): JSX.Element => {
    const isOwnProfile = targetUser.id === user.id;

    return (
        <>
            <Head>
                <title>Songscope - Profile</title>
            </Head>
            <div className="flex flex-row h-full">
                <SideBar
                    variant={"profile"}
                    user={user}
                    targetUser={targetUser}
                    favoriteSongs={favoriteSongs}
                    // Top and Hot Songs are not rendered in the sidebar for the profile page
                    topSongs={[]}
                    hotSongs={[]}
                />
                <div className="w-4/5 sm:w-5/6 h-screen overflow-auto">
                    <div className="pt-8 px-8">
                        {targetUser ? (
                            <>
                                <div className="flex flex-row space-x-4">
                                    <div className="flex flex-col space-y-2 w-1/6">
                                        <Image
                                            src={targetUser.image || "/default-profile.jpg"}
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
                                                {targetUser.name}
                                            </h1>
                                            {/* TODO --> Improve placeholder */}
                                            <h3 className="text-text/90">
                                                {targetUser.bio || "No bio yet!"}
                                            </h3>
                                        </div>
                                        <h3 className="text-text/50 italic font-light sm:pb-1">
                                            Scoping out songs since:{" "}
                                            {AccountJoinTimestamp(targetUser.join_date)}
                                        </h3>
                                    </div>
                                    <div className="border-l-2 border-l-accent-neutral/20 pl-6 w-2/6 sm:w-1/6">
                                        <h1 className="mr-auto font-semibold text-xl pb-3">
                                            Lifetime Stats
                                        </h1>
                                        <div className="flex flex-col space-y-2">
                                            <div className="flex flex-row space-x-4">
                                                <div className="flex flex-col italic space-y-2">
                                                    {sideStatistics ? (
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
                                                                {sideStatistics.avg_rating
                                                                    ? sideStatistics.avg_rating
                                                                    : "N/A"}
                                                            </h3>
                                                        </>
                                                    ) : (
                                                        <Spinner />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="w-7/8 mr-auto border-t-2 my-6 border-secondary"></hr>
                                <div className="my-auto">
                                    <h2 className="text-2xl pl-2 font-bold">Pinned Songs</h2>
                                    <div className="flex flex-row w-full mx-auto place-content-between pt-5">
                                        {pinnedSongs ? (
                                            pinnedSongs.length ? (
                                                // TODO --> Fix this, bandaid solution to only show 3 pinned songs (better for display purposes)
                                                pinnedSongs
                                                    .slice(0, 3)
                                                    .map((song) => (
                                                        <SongTile
                                                            key={song.id}
                                                            songMetadata={song}
                                                            user={targetUser}
                                                        />
                                                    ))
                                            ) : (
                                                <div className="w-full flex place-content-center h-72">
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
                                {isOwnProfile || targetUser.show_reviews ? (
                                    <div className="pt-5">
                                        <h2 className="text-2xl pl-2 font-bold">
                                            Top Reviews
                                            <p
                                                className={clsx(
                                                    "text-text/70 text-md font-light pt-2",
                                                    !targetUser.show_reviews && "hidden"
                                                )}
                                            >
                                                <a href="/settings">
                                                    {" "}
                                                    {isOwnProfile &&
                                                        !targetUser.show_reviews &&
                                                        "This section is only visible to you"}
                                                </a>
                                            </p>
                                        </h2>
                                        <div className="flex flex-row w-full mx-auto place-content-evenly pt-1">
                                            {reviews?.length ? (
                                                reviews.sort((a, b) => b.num_likes - a.num_likes).slice(0, 3).map((review) => (
                                                    <ReviewTile
                                                        key={review.comment_id}
                                                        profileReview={review}
                                                    />
                                                ))
                                            ) : (
                                                <div className="w-full flex place-content-center h-80">
                                                    <h3 className="text-text/50 italic m-auto">
                                                        No reviews yet!
                                                    </h3>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </>
                        ) : (
                            <Spinner />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    if (!ctx.params || !ctx.params.userId || typeof ctx.params.userId !== "string") {
        // 404 if no user id is provided or if malformed
        return {
            redirect: {
                destination: "/404",
                permanent: false
            }
        };
    }
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
    console.log("IDENTIFIERS: ", session.user.id, ctx.params.userId)
    const updateconcatlen = await db.promise().execute("SET SESSION group_concat_max_len = 1000000;");
    const dbResponse = await db.promise().query(
        `
        SELECT u.*,
            IF(? = u.id OR u.show_favorite_songs = 1,
                CAST(CONCAT('[', GROUP_CONCAT(DISTINCT '"', usf.spotify_work_id, '"'), ']') AS JSON),
                NULL)                                                AS favoriteSongs,
            IF(? = u.id OR u.show_reviews = 1,
                CAST(CONCAT('[', GROUP_CONCAT(DISTINCT '"', usp.spotify_work_id, '"'), ']') AS JSON),
                NULL)                                                AS pinnedSongs,
            IF(? = u.id OR u.show_favorite_songs = 1, (SELECT COUNT(*) FROM user_song WHERE favorite = 1 AND user_id = u.id),
                NULL)                                                AS total_favorites,
            (SELECT AVG(rating) FROM user_song WHERE user_id = u.id) AS avg_rating,
            (SELECT COUNT(*) FROM comment WHERE user_id = u.id)      AS total_comments,
            CASE
                WHEN ? = u.id OR u.show_reviews = 1 THEN
                    CAST(CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT(
                            'user_id', u.id,
                            'comment_id', c.id,
                            'spotify_work_id', c.spotify_work_id,
                            'comment_text', c.comment_text,
                            'time', c.time,
                            'num_likes', (SELECT CAST(COALESCE(SUM(liked), 0) AS UNSIGNED)
                                        FROM user_comment uc
                                        WHERE uc.comment_id = c.id)
                                                        ) ORDER BY c.time DESC), ']') AS JSON)
                END                                                  AS top_reviews
        FROM users u
            LEFT JOIN user_song usf ON u.id = usf.user_id AND usf.favorite = 1
            LEFT JOIN user_song usp ON u.id = usp.user_id AND usp.pinned = 1
            LEFT JOIN comment c ON u.id = c.user_id
        WHERE u.id = ?
        GROUP BY u.id;
        `,
        [session.user.id, session.user.id, session.user.id, session.user.id, ctx.params.userId]
    );

    const dbResponseAny = (dbResponse as any)[0][0];
    // Create maps of all favorite songs, pinned songs, and top reviews
    const favoriteSongs: {[key: string]: SongMetadata | null} = {};
    const pinnedSongs: {[key: string]: SongMetadata | null} = {};
    // filter out null reviews that come out of database json array
    const profileTopReviews: ProfileTopReviews[] = dbResponseAny.top_reviews.filter(
        (review: ProfileTopReviews) => review.spotify_work_id !== null
    );
    // Make set of unique spotify works to lookup in the spotify api
    let spotifyIds: Set<string> = new Set();
    if (dbResponseAny.favoriteSongs !== null) {
        for (let song of dbResponseAny.favoriteSongs) {
            spotifyIds.add(song);
            favoriteSongs[song] = null;
        }
    }
    if (dbResponseAny.pinnedSongs !== null) {
        for (let song of dbResponseAny.pinnedSongs) {
            spotifyIds.add(song);
            pinnedSongs[song] = null;
        }
    }
    for (let review of profileTopReviews) {
        spotifyIds.add(review.spotify_work_id);
    }
    let spotifyApiResponse: {[key: string]: SongMetadata} = {};
    if (spotifyIds.size !== 0) {
        // Get spotify metadata for all songs
        spotifyApiResponse = await spotifyApi.getMultipleSongs(
            Array.from(spotifyIds),
            session.user
        );
    }
    // Add spotify metadata to the appropriate song maps
    for (let song of Object.keys(spotifyApiResponse)) {
        if (favoriteSongs[song] === null) {
            favoriteSongs[song] = spotifyApiResponse[song];
        }
        if (pinnedSongs[song] === null) {
            pinnedSongs[song] = spotifyApiResponse[song];
        }
    }
    if (dbResponseAny.top_reviews !== null) {
        for (let review of profileTopReviews) {
            review.title = spotifyApiResponse[review.spotify_work_id].name;
            review.artist = spotifyApiResponse[review.spotify_work_id].artist;
            review.album = spotifyApiResponse[review.spotify_work_id].album;
            review.image = spotifyApiResponse[review.spotify_work_id].albumArtUrl;
        }
    }

    return {
        props: {
            favoriteSongs: Object.values(favoriteSongs),
            pinnedSongs: Object.values(pinnedSongs),
            sideStatistics: {
                total_comments: dbResponseAny.total_comments,
                total_favorites: dbResponseAny.total_favorites,
                avg_rating: dbResponseAny.avg_rating
            },
            reviews: Object.values(profileTopReviews),
            userId: ctx.params.userId,
            targetUser: {
                id: dbResponseAny.id,
                name: dbResponseAny.name,
                first_name: dbResponseAny.first_name,
                last_name: dbResponseAny.last_name,
                image: dbResponseAny.image,
                bio: dbResponseAny.bio,
                join_date: JSON.stringify(dbResponseAny.join_date).slice(1, -1),
                show_favorite_songs: dbResponseAny.show_favorite_songs,
                show_reviews: dbResponseAny.show_reviews,
                show_explicit: dbResponseAny.show_explicit
            },
            user: session.user
        }
    };
};

`

`;
