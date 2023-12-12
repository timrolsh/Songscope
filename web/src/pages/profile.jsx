import Image from 'next/image';
import SideBar from "@/components/SideBar";
import {useEffect, useState} from "react";

function ReviewTile() {
    return (
        <div className="rounded-xl h-32 w-64 px-4 py-2 border border-accent-neutral/10 bg-accent-vivid/5 flex flex-col">
            <h3 className="font-semibold italic">Pain 1993 - Drake</h3>
            <p className="font-light text-text/80 text-sm">Why lorem text placeholder...</p>
            <div className="mt-auto flex flex-row place-content-between">
                <p className="font-bold text-text text-md italic">24 Stars</p>
                <p className="font-bold text-text text-md italic ml-auto">125 Views</p>
            </div>
        </div>
    )
}

function PinnedTile() {
    return (
        <div className="h-64 w-52 rounded-xl border border-accent-neutral/10 bg-accent-neutral/5">
            <Image 
                src="https://media.pitchfork.com/photos/5eac22c8bae33a8e8fd0b191/1:1/w_450%2Cc_limit/Drake.jpg"
                width={150}
                height={150}
                className="mx-auto mt-6 border border-accent-neutral/20 rounded-xl"
            >
            </Image>
            <div className="w-full flex flex-col place-content-evenly px-8 pt-2">
                <h1 className="text-lg font-bold text-center text-text mt-auto">Pain 1993</h1>
                <span className="text-lg text-center font-normal text-text mt-auto">Drake</span>
            </div>
        </div>
    );
};

export default () => {
    const [name, setName] = useState("Loading...");
    /*
    when the component for this page first mounts, unload the token from the 
    cookie, clear cookie, store token in localstorage, put the name of the
    user on the page
    */
    useEffect(() => {
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
            <SideBar variant={"profile"}/> 
            <div className="w-4/5 h-screen overflow-auto">
                <div className="pt-8 px-8">
                    <div className="flex flex-row space-x-4">
                        <div className="flex flex-col space-y-2 w-1/6">
                            <Image 
                                src="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
                                width={225}
                                height={225}
                                className="border border-accent-neutral/20 rounded-xl"
                            >
                            </Image>
                            <div className="flex flex-row space-x-2" >
                                {/* <div className="w-5 h-5 rounded-2xl bg-lime-400 mb-auto"></div> */}
                            </div>
                        </div>
                        <div className="w-1/2 text-lg">
                            <h1 className="font-bold text-2xl mx-auto pb-4">{name}</h1>
                            <h3>I love music, and I love sharing my thoughts with the world! Everyone should know what I think about all the songs, and I have the best music taste ever!</h3>
                            <h3 className="text-text/50 italic font-light pt-8">Scoping out songs since: Nov 2, 2023</h3>
                        </div>
                        <div className="border-l-2 border-l-accent-neutral/20 pl-6 w-2/6">
                            <h1 className="mr-auto font-semibold text-xl pb-3">Lifetime Stats</h1>
                            <div className="flex flex-col space-y-2">
                                <div className="flex flex-row space-x-4">
                                    <div className="flex flex-col italic space-y-2">
                                        <h3>Lifetime Stars: 1432</h3>
                                        <h3>Total Replies: 102</h3>
                                        <h3>Liked Songs: 3250</h3>
                                        <h3>Followers: 105</h3>
                                        <h3>Following: 203</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="w-5/6 mr-auto border-t-2 my-6 border-accent-vivid/30"></hr>
                    <div>
                        <h2 className="text-2xl font-bold">Pinned Songs</h2>
                        <div className="flex flex-row w-5/6 mx-auto place-content-around pt-5">
                            <PinnedTile />
                            <PinnedTile />
                            <PinnedTile />
                        </div>
                    </div>
                    <div className="pt-5">
                        <h2 className="text-2xl font-bold">Top Reviews</h2>
                        <div className="flex flex-row w-5/6 mx-auto place-content-around pt-5">
                            <ReviewTile />
                            <ReviewTile />
                            <ReviewTile />
                        </div>
                    </div>
                </div> 
            </div>
       </div>
    );
};
