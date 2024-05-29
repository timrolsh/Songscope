import type {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {getProviders} from "next-auth/react";
import {getServerSession} from "next-auth/next";
import {authOptions} from "../api/auth/[...nextauth]";
import AuthProviderBlock from "@/components/AuthProviderBlock";

export default ({
    providers
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element => {
    return (
        <div className="h-screen w-screen m-auto flex place-content-center bg-gradient-radial from-primary/5  to-accent-vivid/5">
            <div className="flex flex-col place-content-center m-auto w-full h-screen">
                <div className="w-5/6 sm:w-1/3 h-3/5 m-auto border border-accent-neutral/50 rounded-xl bg-background shadow-2xl">
                    <div className="h-1/4">
                        <div className="bg-clip-text py-3 bg-gradient-to-r from-primary to-accent-vivid pt-8">
                            <h1 className="text-4xl text-center text-transparent font-bold tracking-wide">
                                Songscope
                            </h1>
                        </div>
                        <h3 className="text-center text-2xl text-white/90 font-semibold">
                            Sign In
                        </h3>
                        <hr className="w-2/3 border-accent-neutral mx-auto mt-4 mb-6"></hr>
                    </div>
                    <div className="flex flex-col h-3/4 py-8 place-content-start overflow-y-scroll space-y-4">
                        <>
                            {Object.values(providers).map((provider, idx) => (
                                <AuthProviderBlock
                                    key={provider.id}
                                    providerName={provider.name}
                                    iconLink={`/providers/${provider.id}.png`}
                                    provider={provider}
                                />
                            ))}
                        </>
                    </div>
                </div>
            </div>
        </div>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    // @ts-expect-error
    const session = await getServerSession(context.req, context.res, authOptions);

    // If the user is already logged in, redirect.
    // Note: Make sure not to redirect to the same page
    // To avoid an infinite loop!
    if (session) {
        return {redirect: {destination: "/"}};
    }

    const providers = await getProviders();

    return {
        props: {providers: providers ?? []}
    };
}
