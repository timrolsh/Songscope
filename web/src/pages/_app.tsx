import {AppProps} from "next/app";
import {SessionProvider} from "next-auth/react";
import "../styles/globals.css";
import {AdapterSession} from "next-auth/adapters";
import Head from "next/head";

interface MyAppProps extends AppProps {
    pageProps: {
        session?: AdapterSession & {expires: string};
    };
}

export default ({Component, pageProps: {session, ...pageProps}}: MyAppProps): JSX.Element => {
    const modifiedSession = session ? {...session, user: {}} : undefined;
    return (
        <>
            <Head>
                <title>Songscope</title>
            </Head>
            <SessionProvider session={modifiedSession}>
                <Component {...pageProps} />
            </SessionProvider>
        </>
    );
};
