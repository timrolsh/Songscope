import ToggleButton from "../components/ToggleButton";
import SideBar from "../components/SideBar";
import {authOptions} from "./api/auth/[...nextauth]";
import {getServerSession} from "next-auth/next";
import {GetServerSideProps} from "next";
import {UserProps} from "./user";
import {MdAccountCircle, MdInfoOutline, MdOutlineSecurity} from "react-icons/md";
import {useState} from "react";

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
            <input className="w-2/3 border-b-2 border-accent-neutral/20 bg-transparent" value={value} onChange={(e) => onChange(e.target.value)}></input>
        </div>
    );
}

export function ButtonEntry({name}: {name: string}) {
    return (
        <div className="flex flex-row h-6 w-3/5">
            <h3 className="w-2/3">{name}:</h3>
            <div className="ml-auto">
                <ToggleButton />
            </div>
        </div>
    );
}
export default ({curSession}: UserProps): JSX.Element => {
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
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
                body: JSON.stringify({user_id: curSession.user?.id})
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
    const updateUserInfo = async () => {
        console.log("displayName:", displayName, "bio:", bio);
        try {
            const response = await fetch("/api/db/update-user-info", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({user_id: curSession.user?.id, displayName: displayName, bio: bio})
            });

            if (response.ok) {
                // TODO: Add a better success message
                alert("User info updated");
            } else {
                console.error("Error updating user info");
            }
        } catch (error) {
            console.error("Error updating user info:", error);
        }
    };
    return (
        <div className="flex flex-row h-full">
            <SideBar variant={"settings"} user={curSession.user} />
            <div className="w-4/5 pl-8 h-screen overflow-auto">
                <h2 className="text-2xl font-bold pt-6 pb-2 flex flex-row">
                    {" "}
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
                <h2 className="text-2xl font-bold pt-6 pb-2 flex flex-row">
                    {" "}
                    <MdOutlineSecurity className="my-auto text-xl mr-3" />
                    Privacy
                </h2>
                <div className="space-y-4">
                    <ButtonEntry name={"Show Favorite Songs"} />
                    <ButtonEntry name={"Show Reviews on Profile"} />
                </div>
                <h2 className="text-2xl font-bold pt-6 pb-2 flex flex-row">
                    {" "}
                    <MdInfoOutline className="my-auto text-xl mr-3" />
                    Account
                </h2>
                <div className="space-y-4">
                    <button className="text-red-500" onClick={deleteUser}>
                        Delete Account
                    </button>
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

    return {props: {curSession: session}};
};
