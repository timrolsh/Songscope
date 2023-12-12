// Test route for plumbing project, delete later
require("dotenv").config();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const auth_token = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

function toUrlEncoded(obj) {
    return Object.keys(obj)
        .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]))
        .join("&");
}

const getAuth = async () => {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Authorization": `Basic ${auth_token}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: toUrlEncoded({grant_type: "client_credentials"})
    });
    return JSON.parse(await response.text()).access_token;
};

export default async (request, response) => {
    try {
        let access_token = await getAuth();
        const result = await fetch("https://api.spotify.com/v1/albums/2QRedhP5RmKJiJ1i8VgDGR", {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        let albumArtUrl = await result.json();
        albumArtUrl = albumArtUrl.images[0].url;
        response.statusCode = 200;
        response.send(albumArtUrl);
    } catch (error) {
        console.error(error);
        response.statusCode = 500;
        response.send(`Internal Server Error: {error}`);
    }
};
