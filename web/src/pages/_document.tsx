import {Html, Head, Main, NextScript} from "next/document";

export default (): JSX.Element => {
    return (
        <Html lang="en">
            <Head />
            <body className="bg-background text-text">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
};
