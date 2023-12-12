export default () => {
    return (
        <button
            className="px-4 py-2 bg-red-500 rounded-2xl drop-shadow-sm text-white font-semibold hover:bg-red-700 transition hover:-translate-y-0.5"
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
