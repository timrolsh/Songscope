/*
For connections with different providers like Spotify and Google
*/

export default ({
    providerName,
    isConnected,
    onToggle
}: {
    providerName: string;
    isConnected: boolean;
    onToggle: () => void;
}): JSX.Element => {
    return (
        <>
            <span>{providerName}</span>
            <button
                className={`px-3 py-1.5 ml-1.5 rounded-full font-semibold transition-all ${
                    isConnected ? "bg-green-600 hover:bg-green-700" : "bg-red-700 hover:bg-red-800"
                } text-white`}
                onClick={onToggle}
            >
                {isConnected ? "Connected" : "Connect"}
            </button>
            <br></br>
        </>
    );
};
