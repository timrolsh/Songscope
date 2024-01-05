export default () => {
    return (
        <>
            <input
                type="number"
                id="rating"
                name="rating"
                min="1"
                max="5"
                placeholder="Rating (1-5)"
                className="text-black w-48 h-8"
            ></input>
            <br></br>
            <button
                onClick={() => {
                    fetch("/api/db-write-test", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            spotify_work_id: "2QRedhP5RmKJiJ1i8VgDGR",
                            rating: document.getElementById("rating").value,
                            user_id: 0
                        })
                    })
                        .then((response) => {
                            response.text().then((text) => {
                                alert(`Database write test successful: ${text}`);
                            });
                        })
                        .catch((err) => {
                            alert(`Database write test unsuccessful. Error: ${err}`);
                        });
                }}
            >
                Create Rating for "Playboi Carti - Whole Lotta Red" for User ID 0
            </button>
        </>
    );
};
