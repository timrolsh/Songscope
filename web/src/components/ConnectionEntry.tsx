import {signIn} from "next-auth/react";

/*
For connections with different providers like Spotify and Google
*/

export default ({
    providerName,
    isConnected
}: {
    providerName: string;
    isConnected: boolean;
}): JSX.Element => {
    const handleConnect = () => {
        if (!isConnected) {
            signIn(providerName.toLowerCase(), {callbackUrl: "/settings"});
        }
    };

    return (
        <>
            <span>{providerName}</span>
            <button
                className={`px-3 py-1.5 ml-1.5 rounded-full font-semibold transition-all ${
                    isConnected ? "bg-green-600 hover:bg-green-700" : "bg-red-700 hover:bg-red-800"
                } text-white`}
                onClick={handleConnect}
                disabled={isConnected}
            >
                {isConnected ? "Connected" : "Connect"}
            </button>
            <br></br>
        </>
    );
};
