export default () => {
    return (
        <>
            <button
                onClick={() => {
                    fetch("/api/spotify-test")
                        .then((response) => {
                            response.text().then((res) => {
                                let albumArt = document.getElementById("album-art");
                                albumArt.src = res;
                                albumArt.style.visibility = "visible";
                            });
                        })
                        .catch((err) => {
                            alert(`Loading album art unsuccessful. Error: ${err}`);
                        });
                }}
            >
                Click to fetch an album's art from the Spotify API
            </button>
            <img
                id="album-art"
                src=""
                alt="Album Art"
                className="mx-auto"
                style={{visibility: "hidden"}}
            />
        </>
    );
};
