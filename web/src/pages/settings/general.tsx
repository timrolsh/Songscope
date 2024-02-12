import ToggleButton from "../../components/ToggleButton";
import SideBar from "../../components/SideBar";
import {authOptions} from "./../api/auth/[...nextauth]";
import {getServerSession} from "next-auth/next";
import {GetServerSideProps} from "next";
import {UserProps} from "../user";

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
    // TODO --> Add prefilled information based on existing user information

    return (
        <div className="flex flex-row h-full">
            <SideBar variant={"settings"} user={curSession.user} />
            <div className="w-4/5 pl-8 h-screen overflow-auto">
                <h1 className="text-2xl font-bold pt-6 pb-2">General</h1>
                <hr className="w-2/5"></hr>
                <h3 className="text-lg font-semibold py-3">User Information</h3>
                <div className="space-y-4">
                    <TextEntry name={"Display Name"} />
                    <TextEntry name={"Linked Email"} />
                </div>
                <hr className="w-2/5 my-8 mb-2"></hr>
                <h3 className="text-lg font-semibold py-3">Display Settings</h3>
                <div className="space-y-4">
                    <ButtonEntry name={"Show Liked Songs"} />
                    <ButtonEntry name={"Show Reviews on Profile"} />
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
