import SideBar from "@/components/SideBar";
import { useEffect, useState } from "react";

import SongTile from "@/components/SongTile";

export default () => {
    const [name, setName] = useState("Loading...");
    const [songs, setSongs] = useState([]);
    /*
    when the component for this page first mounts, unload the token from the 
    cookie, clear cookie, store token in localstorage, put the name of the
    user on the page
    */
    useEffect(() => {
        fetch("/api/spotify/get-playlist-songs", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "id": "37i9dQZF1DX6R7QUWePReA" })
        })
            .then(response => response.json())
            .then(data => {
                setSongs(data);
            })
            .catch(error => {
                console.error("Error fetching songs:", error);
            });

        // if user is already signed in, get their name from localStorage
        if (localStorage.signedIn && localStorage.signedIn === "true") {
            setName(localStorage.name);
            return;
        }
        // otherwise user is not signed in, pull their token from and write to localStorage
        const token = document.cookie
            .split(";")
            .map((cookie) => cookie.trim()) // Trim whitespace from each cookie string
            .find((cookie) => cookie.startsWith("token=")) // Find the token cookie
            .split("=")[1];
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        const userInfo = JSON.parse(atob(token.split(".")[1]));
        setName(userInfo.name);
        localStorage.token = token;
        localStorage.name = userInfo.name;
        localStorage.signedIn = true;
    }, []);
    return (
        <div className="flex flex-row h-full">
            <SideBar />
            <div className="w-4/5 h-screen overflow-auto">
                <h1 className="text-3xl font-bold px-8 pt-4">Welcome, {name}!</h1>
                <h2 className="text-xl italic px-8 pt-4">Browse Songs, Albums, and Artists</h2>
                <div className="grid grid-cols-4 gap-8 p-8 overflow-auto">
                    {songs.map((song) => (
                        <SongTile
                            key={song.id}
                            songName={song.name}
                            artistName={song.artist}
                            albumArt={song.albumArtUrl}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
