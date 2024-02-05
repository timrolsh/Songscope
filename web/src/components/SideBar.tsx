import Link from "next/link";
import SidebarEntry from "./SidebarEntry";
import {signOut} from "next-auth/react";

import {MdOutlineSecurity} from "react-icons/md";
import {MdOutlineCompareArrows} from "react-icons/md";
import {MdInfoOutline} from "react-icons/md";
import {HiOutlineCog8Tooth} from "react-icons/hi2";
import {useState, useEffect} from "react";
import Spinner from "@/components/Spinner";

const LinkStyles =
    "w-full rounded-md border bg-accent-neutral/5 border-accent-neutral/10 hover:bg-accent-neutral/20 pl-4 \
    transition py-1 hover:-translate-y-0.5 aria-disabled:cursor-default aria-disabled:opacity-50 aria-disabled:hover:translate-y-0 aria-disabled:hover:bg-accent-neutral/5";
const SettingsLinkStyles =
    "rounded-lg hover:bg-accent-neutral/50 transition-all py-2 hover:font-semibold hover:-translate-y-0.5 text-text/90 hover:text-text text-sm font-normal px-2 flex flex-row space-x-2";

interface Song {
    id: string;
    title: string;
    artist: string;
}

// TODO --> Migrate this to slot architecture for better reusability
function renderDashboardBody() {
    const [hotSongs, setHotSongs] = useState([]);
    const [topSongs, setTopSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSongs() {
            setLoading(true);
            try {
                const hotResponse = await fetch("/api/db/get-hot-reviewed");
                const hotSongsData = await hotResponse.json();
                setHotSongs(hotSongsData);

                const topResponse = await fetch("/api/db/get-top-reviewed");
                const topSongsData = await topResponse.json();
                setTopSongs(topSongsData);
            } catch (error) {
                console.error("Failed to fetch songs:", error);
            }
            setLoading(false);
        }

        fetchSongs();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    return (
        <>
            {topSongs.length > 0 && (
                <div className="flex flex-col">
                    <h3 className="text-text/90 text-xl font-semibold pb-2">Top Songs</h3>
                    {topSongs.map((song: Song) => (
                        <SidebarEntry key={song.id} song={song} />
                    ))}
                </div>
            )}
            {hotSongs.length > 0 && (
                <>
                    <hr className="border-t-2 border-accent-neutral/20 mt-5 mb-4"></hr>
                    <h3 className="text-text/90 text-xl font-semibold pb-2">Hot Reviews</h3>
                    <div className="flex flex-col">
                        {hotSongs.map((song: Song) => (
                            <SidebarEntry key={song.id} song={song} />
                        ))}
                    </div>
                </>
            )}
        </>
    );
}

function renderSettingsBody() {
    return (
        <>
            <div className="flex flex-col">
                <Link className={SettingsLinkStyles} href="/settings/general">
                    {" "}
                    <HiOutlineCog8Tooth className="my-auto text-xl mr-3" /> General
                </Link>
                <Link className={SettingsLinkStyles} href="">
                    {" "}
                    <MdOutlineCompareArrows className="my-auto text-xl mr-3" /> Integrations
                </Link>
                <Link className={SettingsLinkStyles} href="">
                    <MdOutlineSecurity className="my-auto text-xl mr-3" /> Privacy
                </Link>
                <Link className={SettingsLinkStyles} href="">
                    {" "}
                    <MdInfoOutline className="my-auto text-xl mr-3" />
                    Preferences
                </Link>
            </div>
        </>
    );
}

function renderProfileBody() {
    return (
        <>
            <div className="flex flex-col">
                {/* <SidebarEntry />
                <SidebarEntry />
                <SidebarEntry />
                <SidebarEntry /> */}
            </div>
        </>
    );
}

export default ({variant}: {variant: string}) => {
    const [name, setName] = useState("Loading...");

    // TODO --> session migration

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
            {variant != "settings" && (
                <h3 className="text-xl font-semibold pb-1 text-text/90">
                    {variant == "profile"
                        ? "Favorite Songs"
                        : variant == "settings"
                          ? "Config"
                          : "Top Songs"}
                </h3>
            )}
            {variant == "profile"
                ? renderProfileBody()
                : variant == "settings"
                  ? renderSettingsBody()
                  : renderDashboardBody()}
            <hr className="border-t-2 border-accent-neutral/20 mt-auto mb-4"></hr>
            <div className="w-full h-52 flex flex-col mb-4">
                <div className="my-auto flex flex-col h-full place-content-evenly">
                    <Link
                        className={LinkStyles}
                        href="/user"
                        aria-disabled={variant !== "profile" && variant !== "settings"}
                    >
                        Home
                    </Link>
                    <Link
                        className={LinkStyles}
                        href="/profile"
                        aria-disabled={variant === "profile"}
                    >
                        Profile
                    </Link>
                    <Link
                        className={LinkStyles}
                        href="/settings/general"
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
