import {signIn} from "next-auth/react";
import {getServerSession} from "next-auth/next";
import {authOptions} from "./api/auth/[...nextauth]";
import {GetServerSideProps} from "next";

export default ({}) => {
    return (
        <div className="h-screen w-screen m-auto flex place-content-center bg-gradient-radial from-primary/5  to-accent-vivid/5">
            <div className="m-auto pb-32">
                <div className="bg-clip-text h-32 bg-gradient-to-r from-primary to-accent-vivid">
                    <h1 className="text-7xl text-center text-transparent font-bold tracking-wide">
                        Songscope
                    </h1>
                    <h3 className="text-2xl text-center font-extralight tracking-wide text-gray-300 pt-3 pb-1">
                        Music Review Made Easy
                    </h3>
                    <hr className="my-4 border-t-[.5px] border-text"></hr>
                    <div className="flex flex-row place-content-center mx-auto">
                        <button
                            onClick={() => {
                                signIn();
                            }}
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const sess = await getServerSession(ctx.req, ctx.res, authOptions);

    if (sess) {
        return {
            redirect: {
                destination: "/user",
                permanent: false
            }
        };
    }

    return {props: {}};
};
