import Link from "next/link";
import SidebarEntry from "./SidebarEntry";
import SignOutButton from "./SignOutButton";

import { MdOutlineSecurity } from "react-icons/md";
import { MdOutlineCompareArrows } from "react-icons/md";
import { MdInfoOutline } from "react-icons/md";
import { HiOutlineCog8Tooth } from "react-icons/hi2";
import { useState, useEffect } from "react";
const LinkStyles = "rounded-lg w-full border border-accent-neutral/30 hover:bg-accent-neutral/50 transition py-2 hover:-translate-y-0.5";
const SettingsLinkStyles = "rounded-lg hover:bg-accent-neutral/50 transition-all py-2 hover:font-semibold hover:-translate-y-0.5 text-text text-xl font-normal pl-4 flex flex-row space-x-2  border-b-1 border-accent-neutral/20";

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
 
    if(variant == "profile") {
        return (
            <div className="flex flex-col w-1/5 bg-accent-vivid/10 border-r-2 border-accent-neutral/10 h-screen px-4">
                <h1 className="text-text text-2xl font-semibold text-center pt-4 pb-2">{name}'s Profile</h1> 
                <hr className="border-t-2 border-accent-neutral/20 w-4/5 mx-auto py-2"></hr>
                <h3 className="text-xl font-semibold">Favorite Songs</h3>
                <div className="flex flex-col space-y-4">
                    <SidebarEntry />
                    <SidebarEntry />
                    <SidebarEntry />
                    <SidebarEntry />
                </div>
                <div className="w-full mt-auto h-52 flex flex-col space-y-2 mb-4">
                    <hr className="border-t-2 border-accent-neutral/20 w-4/5 mx-auto"></hr>
                    <div className="my-auto flex flex-col h-full place-content-evenly">
                        <Link className={LinkStyles} href="/user">Home</Link>
                        <Link className={LinkStyles} href="/settings/general">User Settings</Link>
                        <Link className={LinkStyles} href="/profile">Profile</Link>
                        <SignOutButton />
                    </div>
                </div>
            </div>
        );
    } else if(variant == "settings") {
        return (
            <div className="flex flex-col w-1/5 bg-accent-vivid/10 border-r-2 border-accent-neutral/10 h-screen px-4">
                <h1 className="text-text text-3xl font-semibold text-center pt-4 pb-2">Settings</h1> 
                <hr className="border-t-2 border-accent-neutral/20 w-4/5 mx-auto py-2"></hr>
                <div className="flex flex-col space-y-4">
                    <Link className={SettingsLinkStyles} href="/settings/general"> <HiOutlineCog8Tooth className="my-auto pb-1 text-xl mr-3"/> General</Link>
                    <hr className="border-t-1 border-accent-neutral/20 w-5/6 mx-auto"></hr>
                    <Link className={SettingsLinkStyles} href=""> <MdOutlineCompareArrows className="my-auto pb-1 text-xl mr-3"/> Integrations</Link>
                    <hr className="border-t-1 border-accent-neutral/20 w-5/6 mx-auto"></hr>
                    <Link className={SettingsLinkStyles} href=""><MdOutlineSecurity className="my-auto pb-1 text-xl mr-3"/> Privacy</Link>
                    <hr className="border-t-1 border-accent-neutral/20 w-5/6 mx-auto"></hr>
                    <Link className={SettingsLinkStyles} href=""> <MdInfoOutline className="my-auto pb-1 text-xl mr-3"/> Music Preferences</Link>
                </div>
                <div className="w-full mt-auto h-52 flex flex-col space-y-2 mb-4">
                    <hr className="border-t-2 border-accent-neutral/20 w-4/5 mx-auto"></hr>
                    <div className="my-auto flex flex-col h-full place-content-evenly">
                        <Link className={LinkStyles} href="/user">Home</Link>
                        <Link className={LinkStyles} href="/settings/general">User Settings</Link>
                        <Link className={LinkStyles} href="/profile">Profile</Link>
                        <SignOutButton />
                    </div>
                </div>
            </div>
        );
    } 
    return (
        <div className="flex flex-col w-1/5 bg-accent-vivid/10 border-r-2 border-accent-neutral/10 h-screen px-4">
            <h1 className="text-text text-3xl font-semibold text-center pt-4 pb-2">Dashboard</h1> 
            <hr className="border-t-2 border-accent-neutral/20 w-4/5 mx-auto py-2"></hr>
            <h3 className="text-text text-xl font-normal pb-2">Recommendations</h3> 
            <div className="flex flex-col space-y-4">
                <SidebarEntry />
                <SidebarEntry />
                <SidebarEntry />
                <SidebarEntry />
                <SidebarEntry />
            </div>
            <hr className="border-t-2 border-accent-neutral/20 w-4/5 mx-auto mt-5 mb-4"></hr>
            <h3 className="text-text text-xl font-normal pb-2">Hot Reviews</h3> 
            <div className="flex flex-col space-y-4">
                <SidebarEntry />
                <SidebarEntry />
                <SidebarEntry />
                <SidebarEntry />
            </div>
            <div className="w-full mt-auto h-52 flex flex-col space-y-2 mb-4">
                <hr className="border-t-2 border-accent-neutral/20 w-4/5 mx-auto"></hr>
                <div className="my-auto flex flex-col h-full place-content-evenly">
                    <Link className={LinkStyles} href="/user">Home</Link>
                    <Link className={LinkStyles} href="/settings/general">User Settings</Link>
                    <Link className={LinkStyles} href="/profile">Profile</Link>
                    <SignOutButton />
                </div>
            </div>
        </div>
    );
};
