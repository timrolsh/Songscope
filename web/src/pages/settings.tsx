import ToggleButton from "../components/ToggleButton";
import SideBar from "../components/SideBar";
import {authOptions, db} from "./api/auth/[...nextauth]";
import {getServerSession} from "next-auth/next";
import {GetServerSideProps} from "next";
import {MdAccountCircle, MdInfoOutline, MdLink, MdOutlineSecurity} from "react-icons/md";
import {useState} from "react";
import Head from "next/head";
import ConnectionEntry from "../components/ConnectionEntry";
import {User} from "@/types";

export function TextEntry({
    name,
    value,
    onChange
}: {
    name: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="flex flex-row w-3/5">
            <h3 className="w-1/3">{name}:</h3>
            <input
                className="w-2/3 border-b-2 border-accent-neutral/20 bg-transparent"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            ></input>
        </div>
    );
}

export function ButtonEntry({
    name,
    onChange,
    apiRoute,
    checked
}: {
    name: string;
    onChange: (isChecked: boolean, value: string) => void;
    apiRoute: string;
    checked: boolean;
}) {
    return (
        <div className="flex flex-row h-6 w-3/5">
            <h3 className="w-2/3">{name}:</h3>
            <div className="ml-auto">
                <ToggleButton onChange={onChange} apiRoute={apiRoute} checked={checked} />
            </div>
        </div>
    );
}

export default ({
    user,
    connections
}: {
    user: User;
    connections: {"google": boolean; "spotify": boolean};
}): JSX.Element => {
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [showFavoriteSongs, setShowFavoriteSongs] = useState(false);
    const [showReviews, setShowReviews] = useState(false);
    const [showExplicitSongs, setShowExplicitSongs] = useState(false);
    const deleteUser = async () => {
        if (!confirm("Are you sure you want to continue?")) {
            return;
        }
        try {
            const response = await fetch("/api/db/delete-user", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({user_id: user.id})
            });

            if (response.ok) {
                window.location.href = "/";
            } else {
                console.error("Error deleting user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    // TODO: If they do not specify a name/bio, then don't set it to something empty...
    const updateUserInfo = async () => {
        try {
            const response = await fetch("/api/db/update-user-info", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: user.id,
                    displayName: displayName,
                    bio: bio
                })
            });

            if (!response.ok) {
                if (response.status === 409) {
                    alert("Display name already taken");
                } else {
                    alert("Error updating user info, please try again later");
                }
            }
        } catch (error) {
            console.error("Error updating user info:", error);
        }
    };

    const updateToggleSetting = async (apiRoute: string, value: boolean) => {
        try {
            const response = await fetch(apiRoute, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({user_id: user.id, value: value})
            });

            if (!response.ok) {
                alert("Error updating settings, please try again later");
            }
        } catch (error) {
            console.error("Error updating settings:", error);
        }
    };

    return (
        <>
            <Head>
                <title>Songscope - Settings</title>
            </Head>
            <div className="flex flex-row h-full">
                {/* Top and Hot Songs are not rendered in the sidebar for the settings page */}
                <SideBar variant="settings" user={user} hotSongs={[]} topSongs={[]} />
                <div className="w-4/5 pl-8 h-screen overflow-auto">
                    <h2 className="text-2xl font-bold pt-6 pb-2 flex flex-row">
                        <MdAccountCircle className="my-auto text-xl mr-3" />
                        User Information
                    </h2>
                    <div className="space-y-4">
                        <TextEntry
                            name={"Display Name"}
                            value={displayName}
                            onChange={setDisplayName}
                        />
                        <TextEntry name={"Bio"} value={bio} onChange={setBio} />
                        <button
                            className="bg-secondary/80 hover:bg-secondary text-text/80 hover:text-text py-2 px-4 rounded-md transition"
                            onClick={updateUserInfo}
                        >
                            Update
                        </button>
                    </div>
                    <div className="space-y-4 mt-8">
                        <h2 className="text-2xl font-bold pt-6 pb-2 flex flex-row">
                            <MdLink className="my-auto text-xl mr-3" /> Connections
                        </h2>
                        <ConnectionEntry providerName="Spotify" isConnected={connections.spotify} />
                        <ConnectionEntry providerName="Google" isConnected={connections.google} />
                    </div>
                    <h2 className="text-2xl font-bold pt-6 pb-2 flex flex-row">
                        <MdOutlineSecurity className="my-auto text-xl mr-3" />
                        Privacy
                    </h2>
                    <div className="space-y-4">
                        <ButtonEntry
                            name={"Show Favorite Songs"}
                            onChange={(isChecked, value) => updateToggleSetting(value, isChecked)}
                            apiRoute={"api/db/update-favorite-songs-visibility"}
                            checked={showFavoriteSongs}
                        />
                        <ButtonEntry
                            name={"Show Reviews on Profile"}
                            onChange={(isChecked, value) => updateToggleSetting(value, isChecked)}
                            apiRoute={"api/db/update-review-visibility"}
                            checked={showReviews}
                        />
                    </div>
                    <h2 className="text-2xl font-bold pt-6 pb-2 flex flex-row">
                        <MdInfoOutline className="my-auto text-xl mr-3" />
                        Account
                    </h2>
                    <div className="space-y-4">
                        <ButtonEntry
                            name={"Show Explicit Songs"}
                            onChange={(isChecked, value) => updateToggleSetting(value, isChecked)}
                            apiRoute={"api/db/update-explicit-song-visibility"}
                            checked={showExplicitSongs}
                        />
                        <button className="text-red-500" onClick={deleteUser}>
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </>
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

    const results = await db
        .promise()
        .query(`select provider FROM accounts WHERE userId = ?`, [session.user.id]);
    const booleans = {google: false, spotify: false};
    for (const entry of (results as any)[0]) {
        if (entry.provider === "spotify") {
            booleans.spotify = true;
        } else if (entry.provider === "google") {
            booleans.google = true;
        }
    }
    return {props: {user: session.user, connections: booleans}};
};
