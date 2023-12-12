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

const search = async (name, type=["album", "artist", "playlist", "track"]) => {
    let access_token = await getAuth();
    const res = await fetch("https://api.spotify.com/v1/search?q=" + name + "&type=" + type, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${access_token}`,
        }
    });
    return JSON.parse(await res.text());
}


export default async (request, response) => {
    try {
        let access_token = await getAuth();
        const res = await search("Travis Scott");
        response.statusCode = 200;
        console.log("res", res);
        response.send(res);
    } catch (error) {
        console.error(error);
        response.statusCode = 500;
        response.send(`Internal Server Error: {error}`);
    }
};
