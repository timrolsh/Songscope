// Test route for plumbing project, delete later
const qs = require("qs");
require("dotenv").config();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const auth_token = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

const getAuth = async () => {
    const token_url = "https://accounts.spotify.com/api/token";
    const data = qs.stringify({ 'grant_type': 'client_credentials' });
    const response = await fetch(token_url, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth_token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
    });
    const json = await response.json();
    return json.access_token;
}

export default async (request, response) => {
    try {
        let access_token = await getAuth();
        const result = await fetch("https://api.spotify.com/v1/albums/2QRedhP5RmKJiJ1i8VgDGR", {
            headers: {
                Authorization: `Bearer ${access_token}`,
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
