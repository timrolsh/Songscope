import DBTesterButton from "@/components/DBTesterButton";
import SignOutButton from "@/components/SignOutButton";
import {useEffect, useState} from "react";

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
            .find((cookie) => cookie.startsWith(" token="))
            .split("=")[1];
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        const userInfo = JSON.parse(atob(token.split(".")[1]));
        setName(userInfo.name);
        localStorage.token = token;
        localStorage.name = userInfo.name;
        localStorage.signedIn = true;
    }, []);
    return (
        <>
            <div className="bg-clip-text flex palce-content-center w-full h-64 bg-gradient-to-r from-red-600 via-red-400 to-amber-300">
                <h1 className="text-8xl text-center m-auto text-transparent font-semibold">Songscope</h1>
            </div>
            
            <h3 className="pl-2 text-2xl font-semibold">
                {
                    name === "Loading..." ? 
                        <span className="italic">Loading</span> : 
                        <> Welcome <span className="italic">{name}</span> </>
                        
                }
            </h3>
            <SignOutButton />
            <br></br>
            <DBTesterButton />
        </>
    );
};
