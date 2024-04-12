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
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    isConnected ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                } text-white`}
                onClick={onToggle}
            >
                {isConnected ? "Connected" : "Connect"}
            </button>
            <br></br>
        </>
    );
};
