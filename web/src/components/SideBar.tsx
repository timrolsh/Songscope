import Link from "next/link";
import SidebarEntry from "./SidebarEntry";
import {signOut} from "next-auth/react";
import {SongMetadata} from "@/types";

const LinkStyles =
    "w-full rounded-md border bg-accent-neutral/5 border-accent-neutral/10 hover:bg-accent-neutral/20 pl-4 \
    transition py-1 hover:-translate-y-0.5 aria-disabled:cursor-default aria-disabled:opacity-50 aria-disabled:hover:translate-y-0 aria-disabled:hover:bg-accent-neutral/5";

// TODO --> Migrate this to slot architecture for better reusability
function renderDashboardBody(hotSongs: SongMetadata[], topSongs: SongMetadata[]): JSX.Element {
    return (
        <>
            {topSongs && (
                <>
                    <div className="flex flex-col">
                        <h3 className="text-text/90 text-xl font-semibold pb-2">Top Songs</h3>
                        <div className="flex flex-col overflow-y-scroll max-h-60">
                            {topSongs.map((song: SongMetadata) => (
                                <SidebarEntry key={song.id} song={song} />
                            ))}
                        </div>
                    </div>
                </>
            )}
            {hotSongs && (
                <>
                    <hr className="border-t-2 border-accent-neutral/20 mt-5 mb-4"></hr>
                    <h3 className="text-text/90 text-xl font-semibold pb-2">Hot Reviews</h3>
                    <div className="flex flex-col overflow-y-scroll max-h-60">
                        {hotSongs.map((song: SongMetadata) => (
                            <SidebarEntry key={song.id} song={song} />
                        ))}
                    </div>
                </>
            )}
        </>
    );
}

function renderProfileBody(
    songs?: SongMetadata[],
    showFavoriteSongs?: boolean,
    isOwnProfile?: boolean
) {
    if (!isOwnProfile && !showFavoriteSongs) {
        return <></>;
    }
    if (!songs || songs.length === 0) {
        return (
            <div className="text-text/70 italic text-md font-semibold pt-2">
                No favorite songs yet!
            </div>
        );
    }

    return (
        <>
            <h3 className="text-text/90 text-xl font-semibold pb-2">Favorite Songs</h3>
            {isOwnProfile && !showFavoriteSongs && (
                <div className="text-text/70 text-md font-light pt-2">
                    <a href="/settings">This section is only visible to you</a>
                </div>
            )}
            <div className="flex flex-col overflow-scroll">
                {songs.map((song) => {
                    return <SidebarEntry key={song.id} song={song} />;
                })}
            </div>
        </>
    );
}

// TODO for these components, put the db requests in server side props on the user page and then pass down all the user data to the export default component and then have that one pass all the needed props down to these components
export default ({
    variant,
    user,
    favoriteSongs,
    showFavoriteSongs,
    isOwnProfile,
    hotSongs,
    topSongs
}: {
    variant: string;
    user: any;
    favoriteSongs?: SongMetadata[];
    showFavoriteSongs?: boolean;
    isOwnProfile?: boolean;
    hotSongs: SongMetadata[];
    topSongs: SongMetadata[];
}) => {
    return (
        <div className="flex flex-col w-1/5 sm:w-1/6 bg-accent-neutral/5 border-r-2 border-accent-neutral/5 h-screen px-3">
            <h1 className="text-text text-2xl font-semibold pt-4 pb-2">
                {variant == "profile"
                    ? "User Profile"
                    : variant == "settings"
                      ? "Settings"
                      : "Dashboard"}
            </h1>
            <hr className="border-t-2 border-accent-neutral/20 pt-2 pb-1"></hr>
            {variant == "profile" ? (
                renderProfileBody(favoriteSongs, showFavoriteSongs, isOwnProfile)
            ) : variant == "settings" ? (
                <></>
            ) : (
                renderDashboardBody(hotSongs, topSongs)
            )}
            <hr className="border-t-2 border-accent-neutral/20 mt-auto mb-4 "></hr>
            <div className="w-full h-52 flex flex-col mb-4">
                <div className="my-auto flex flex-col h-full place-content-evenly">
                    <Link
                        className={LinkStyles}
                        href="/user"
                        aria-disabled={variant !== "profile" && variant !== "settings"}
                    >
                        Home
                    </Link>
                    {user && (
                        <Link
                            className={LinkStyles}
                            href={{
                                pathname: "/profile/[id]",
                                query: {id: user.id}
                            }}
                            aria-disabled={variant === "profile"} // Make this non-disabled if you are on someone else's profile that isn't your own
                        >
                            Profile
                        </Link>
                    )}
                    <Link
                        className={LinkStyles}
                        href="/settings"
                        aria-disabled={variant === "settings"}
                    >
                        User Settings
                    </Link>
                    <button
                        className="pl-4 py-1 bg-red-700/80 rounded-md drop-shadow-sm text-text hover:font-semibold hover:bg-red-700 transition-all hover:-translate-y-0.5 text-left"
                        onClick={() => {
                            signOut();
                        }}
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};