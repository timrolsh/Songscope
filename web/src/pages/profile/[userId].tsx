import Image from "next/image";
import SongTile from "../../components/SongTile";
import SideBar from "../../components/SideBar";

import {getServerSession} from "next-auth/next";
import {authOptions} from "./../api/auth/[...nextauth]";
import {GetServerSideProps} from "next";
import {
    ProfileStatistics,
    SongMetadata,
    EnrichedSongMetadata,
    ProfileTopReviews,
    UserTopReviews,
    UserProfileSongs
} from "@/types";
import Spinner from "@/components/Spinner";
import {User} from "@/types";
import ReviewTile from "@/components/ReviewTile";
import {AccountJoinTimestamp} from "@/dates";
import Head from "next/head";
import clsx from "clsx";

export default ({
    user,
    userId,
    sideStatistics,
    reviews,
    favoriteSongs,
    showFavoriteSongs,
    pinnedSongs
}: {
    user: User;
    userId: string;
    // TODO verify this type
    sideStatistics: ProfileStatistics;
    reviews: ProfileTopReviews[];
    favoriteSongs: SongMetadata[];
    showFavoriteSongs: boolean;
    pinnedSongs: SongMetadata[];
}): JSX.Element => {
    const isOwnProfile = user.id === userId;

    return (
        <>
            <Head>
                <title>Songscope - Profile</title>
            </Head>
            <div className="flex flex-row h-full">
                <SideBar
                    variant={"profile"}
                    user={user}
                    favoriteSongs={favoriteSongs}
                    showFavoriteSongs={showFavoriteSongs}
                    isOwnProfile={isOwnProfile}
                    // Top and Hot Songs are not rendered in the sidebar for the profile page
                    topSongs={[]}
                    hotSongs={[]}
                />
                <div className="w-4/5 sm:w-5/6 h-screen overflow-auto">
                    <div className="pt-8 px-8">
                        {user ? (
                            <>
                                <div className="flex flex-row space-x-4">
                                    <div className="flex flex-col space-y-2 w-1/6">
                                        <Image
                                            src={user.image || "/default-profile.jpg"}
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
                                                {user.name}
                                            </h1>
                                            {/* TODO --> Improve placeholder */}
                                            <h3 className="text-text/90">
                                                {user.bio || "No bio yet!"}
                                            </h3>
                                        </div>
                                        <h3 className="text-text/50 italic font-light sm:pb-1">
                                            Scoping out songs since:{" "}
                                            {AccountJoinTimestamp(user.join_date)}
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
                                                            rating={song.rating}
                                                            metadata={song}
                                                            user={user}
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
                                {isOwnProfile || user.show_reviews ? (
                                    <div className="pt-5">
                                        <h2 className="text-2xl pl-2 font-bold">
                                            Top Reviews
                                            <p
                                                className={clsx(
                                                    "text-text/70 text-md font-light pt-2",
                                                    !user.show_reviews && "hidden"
                                                )}
                                            >
                                                <a href="/settings">
                                                    {" "}
                                                    {isOwnProfile &&
                                                        !user.show_reviews &&
                                                        "This section is only visible to you"}
                                                </a>
                                            </p>
                                        </h2>
                                        <div className="flex flex-row w-full mx-auto place-content-evenly pt-1">
                                            {reviews?.length ? (
                                                reviews.map((review) => (
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

import spotifyApi from "../api/spotify/wrapper";
import {db} from "./../api/auth/[...nextauth]";
import {RowDataPacket} from "mysql2";

async function enrichSongData(spotify_work_id: string): Promise<EnrichedSongMetadata> {
    const metadata = await spotifyApi.getSong(spotify_work_id);
    return {
        ...metadata,
        num_reviews: 0
    };
}

async function fetchTopUserReviews(userid: number): Promise<ProfileTopReviews[] | null> {
    try {
        const [rows] = await db.promise().query<UserTopReviews[]>(
            `select u.id user_id, c.id comment_id, c.spotify_work_id, c.comment_text, c.time,
                (SELECT CAST(coalesce(sum(liked), 0) as unsigned) from user_comment uc where uc.comment_id = c.id) as num_likes
            from comment c, users u
            where c.user_id = u.id
            and u.id=?
            order by num_likes desc, c.time desc
            LIMIT 3;`,
            [userid]
        );

        const withSongMetadata: ProfileTopReviews[] = await Promise.all(
            rows.map(async (row) => {
                const metadata = await enrichSongData(row.spotify_work_id);
                return {
                    spotify_work_id: metadata.id,
                    title: metadata.name,
                    artist: metadata.artist,
                    album: metadata.album,
                    image: metadata.albumArtUrl,

                    user_id: row.user_id,
                    comment_id: row.comment_id,
                    comment_text: row.comment_text,
                    time: row.time,
                    num_likes: row.num_likes
                };
            })
        );

        return withSongMetadata.length > 0 ? withSongMetadata : null;
    } catch (error) {
        console.error("Unable to fetch top reviewed songs with metadata", error);
        throw error;
    }
}

// Returns everything needed for the user profile
async function getProfileStatistics(user_id: string): Promise<ProfileStatistics> {
    try {
        const [statistics] = (
            await db.promise().query(
                `
            SELECT 
                (SELECT COUNT(*) FROM comment WHERE user_id = ?) AS total_comments,
                (SELECT COUNT(favorite) FROM user_song WHERE favorite = 1 AND user_id = ?) AS total_favorites,
                (SELECT AVG(rating) FROM user_song WHERE user_id = ?) AS avg_rating`,
                [user_id, user_id, user_id]
            )
        )[0] as RowDataPacket[];

        let stats: ProfileStatistics = {
            total_comments: Number(statistics.total_comments),
            total_favorites: Number(statistics.total_favorites),
            avg_rating: statistics.avg_rating ? Number(statistics.avg_rating) : undefined
        };

        return stats;
    } catch (error) {
        console.error("SONGSCOPE: Unable to fetch reviews", error);
        throw error; // Rethrow the error to be caught by the caller
    }
}

async function fetchProfile(profile_id: string) {
    try {
        // TODO --> Again, likely can be optimized. Big query.
        const [favoriteData, pinData, showFavorites] = (await Promise.all([
            db.promise().query(
                `
                select spotify_work_id, rating
                    from user_song
                    where user_id=?
                    and favorite=1;
                `,
                [profile_id]
            ),
            db.promise().query(
                `
                select spotify_work_id, rating
                    from user_song
                    where user_id=?
                    and pinned=1;
                `,
                [profile_id]
            ),
            db.promise().query(
                `
                select show_favorite_songs
                    from users
                    where id=?;
                `,
                [profile_id]
            )
        ])) as RowDataPacket[];

        // TODO --> Likely can be optimized
        const arrayedFavorites = favoriteData[0].map((s: RowDataPacket) => s.spotify_work_id);
        const arrayedPins = pinData[0].map((s: RowDataPacket) => s.spotify_work_id);
        let favoriteSongs: SongMetadata[] = [];
        let pins: SongMetadata[] = [];

        if (arrayedFavorites.length > 0) {
            favoriteSongs = await spotifyApi.getMultipleSongs(arrayedFavorites);
        }
        if (arrayedPins.length > 0) {
            pins = await spotifyApi.getMultipleSongs(arrayedPins);
        }

        let profile: UserProfileSongs = {
            favoritedSongs: favoriteSongs,
            showFavoriteSongs: Boolean(showFavorites[0][0].show_favorite_songs),
            pinnedSongs: pins
        };

        return profile;
    } catch (error) {
        console.error("SONGSCOPE: Unable to fetch reviews", error);
        throw error; // Rethrow the error to be caught by the caller
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

    if (!ctx.params || !ctx.params.userId || typeof ctx.params.userId !== "string") {
        // 404 if no user id is provided or if malformed
        return {
            redirect: {
                destination: "/404",
                permanent: false
            }
        };
    }

    // TODO the one request to the database needs to go here and the props for the page need to be populated, these are dummy values that need to be populated with real values
    return {
        props: {
            favoriteSongs: [],
            showFavoriteSongs: false,
            pinnedSongs: [],
            sideStatistics: null,
            reviews: [],
            userId: ctx.params.userId,
            user: session.user
        }
    };
};
