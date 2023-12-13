import Link from "next/link";
import SidebarEntry from "./SidebarEntry";
import SignOutButton from "./SignOutButton";

import { MdOutlineSecurity } from "react-icons/md";
import { MdOutlineCompareArrows } from "react-icons/md";
import { MdInfoOutline } from "react-icons/md";
import { HiOutlineCog8Tooth } from "react-icons/hi2";
import { useState, useEffect } from "react";
const LinkStyles = "w-full rounded-md border bg-accent-neutral/5 border-accent-neutral/10 hover:bg-accent-neutral/20 pl-4 hover:font-semibold transition py-1 hover:-translate-y-0.5";
const SettingsLinkStyles = "rounded-lg hover:bg-accent-neutral/50 transition-all py-2 hover:font-semibold hover:-translate-y-0.5 text-text text-xl font-normal pl-4 flex flex-row space-x-2  border-b-1 border-accent-neutral/20";

function renderDashboardBody() {
    return (
        <>
             <div className="flex flex-col">
                <SidebarEntry />
                <SidebarEntry />
                <SidebarEntry />
                <SidebarEntry />
                <SidebarEntry />
            </div>
            <hr className="border-t-2 border-accent-neutral/20 mt-5 mb-4"></hr>
            <h3 className="text-text/90 text-xl font-semibold pb-2">Hot Reviews</h3> 
            <div className="flex flex-col">
                <SidebarEntry />
                <SidebarEntry />
                <SidebarEntry />
                <SidebarEntry />
            </div>
        </> 
    );
};

function renderSettingsBody() {
    return (
        <>
            <div className="flex flex-col">
                <Link className={SettingsLinkStyles} href="/settings/general"> <HiOutlineCog8Tooth className="my-auto pb-1 text-xl mr-3"/> General</Link>
                <hr className="border-t-1 border-accent-neutral/20 w-5/6 "></hr>
                <Link className={SettingsLinkStyles} href=""> <MdOutlineCompareArrows className="my-auto pb-1 text-xl mr-3"/> Integrations</Link>
                <hr className="border-t-1 border-accent-neutral/20 w-5/6 "></hr>
                <Link className={SettingsLinkStyles} href=""><MdOutlineSecurity className="my-auto pb-1 text-xl mr-3"/> Privacy</Link>
                <hr className="border-t-1 border-accent-neutral/20 w-5/6 "></hr>
                <Link className={SettingsLinkStyles} href=""> <MdInfoOutline className="my-auto pb-1 text-xl mr-3"/> Music Preferences</Link>
            </div>
        </>
    );
}

function renderProfileBody() {
    return (
        <>
            <div className="flex flex-col">
                <SidebarEntry />
                <SidebarEntry />
                <SidebarEntry />
                <SidebarEntry />
            </div>
        </>
    );
}

export default ({variant}) => {
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
        <div className="flex flex-col w-1/7 bg-accent-neutral/5 border-r-2 border-accent-neutral/5 h-screen px-3">
            <h1 className="text-text text-2xl font-semibold pt-4 pb-2 text-text">
                {
                    variant == "profile" ? name + "'s Profile" : variant == "settings" ? "Settings" : "Dashboard"
                } 
            </h1> 
            <hr className="border-t-2 border-accent-neutral/20 pt-2 pb-1"></hr>
            <h3 className="text-xl font-semibold pb-1 text-text/90">
                {
                    variant == "profile" ? "Favorite Songs" : variant == "settings" ? "Settings" : "Top Songs"
                }
            </h3>
            {
                variant == "profile" ? renderProfileBody() : variant == "settings" ? renderSettingsBody() : renderDashboardBody()
            } 
            <hr className="border-t-2 border-accent-neutral/20 mt-auto mb-4"></hr>
            <div className="w-full h-52 flex flex-col mb-4">
                <div className="my-auto flex flex-col h-full place-content-evenly">
                    <Link className={LinkStyles} href="/user">Home</Link>
                    <Link className={LinkStyles} href="/settings/general">User Settings</Link>
                    <Link className={LinkStyles} href="/profile">Profile</Link>
                    <SignOutButton />
                </div>
            </div>
        </div>
    )
};
