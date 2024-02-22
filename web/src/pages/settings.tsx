import ToggleButton from "../components/ToggleButton";
import SideBar from "../components/SideBar";
import {authOptions} from "./api/auth/[...nextauth]";
import {getServerSession} from "next-auth/next";
import {GetServerSideProps} from "next";
import {UserProps} from "./user";
import {MdAccountCircle, MdInfoOutline, MdOutlineSecurity} from "react-icons/md";

export function TextEntry({name}: {name: string}) {
    return (
        <div className="flex flex-row w-3/5">
            <h3 className="w-1/3">{name}:</h3>
            <input className="w-2/3 border-b-2 border-accent-neutral/20 bg-transparent"></input>
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
                    <TextEntry name={"Display Name"} />
                    <TextEntry name={"Bio"} />
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
                    <button className="text-red-500">Delete Account</button>
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
