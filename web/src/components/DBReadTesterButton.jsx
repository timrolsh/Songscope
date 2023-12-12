export default () => {
    return (
        <>
            <button
                onClick={() => {
                    fetch("/api/db-read-test")
                        .then((response) => {
                            response.text().then((text) => {
                                alert(`Database read test successful: ${text}`);
                            });
                        })
                        .catch((err) => {
                            alert(`Database read test unsuccessful. Error: ${err}`);
                        });
                }}
            >
                Click to Get Current Time from Database
            </button>
        </>
    );
};
