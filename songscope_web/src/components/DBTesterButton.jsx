export default () => {
    return (
        <>
            <button
                onClick={() => {
                    fetch("/api/db-test")
                        .then((response) => {
                            response.text().then((text) => {
                                alert(`Database test successful: ${text}`);
                            });
                        })
                        .catch((err) => {
                            alert(`Database test unsuccessful. Error: ${err}`);
                        });
                }}
            >
                Click to Get Current Time from Database
            </button>
        </>
    );
};
