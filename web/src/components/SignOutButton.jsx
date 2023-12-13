export default () => {
    return (
        <button
            className="pl-4 py-1 bg-red-700/80 rounded-md drop-shadow-sm text-text hover:font-semibold hover:bg-red-700 transition-all hover:-translate-y-0.5 text-left"
            onClick={() => {
                localStorage.signedIn = false;
                localStorage.removeItem("token");
                localStorage.removeItem("name");
                location.href = "/";
            }}
        >
            Sign Out
        </button>
    );
};
