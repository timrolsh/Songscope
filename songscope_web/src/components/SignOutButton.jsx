export default () => {
    return (
        <button
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
