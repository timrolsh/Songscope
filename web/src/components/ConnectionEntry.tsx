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
        <div className="flex flex-row items-center justify-between py-2">
            <span>{providerName}</span>
            <button
                className={`px-4 py-2 rounded ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                } text-white`}
                onClick={onToggle}
            >
                {isConnected ? "Connected" : "Connect"}
            </button>
        </div>
    );
};
