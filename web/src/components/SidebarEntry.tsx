import React from "react";
import {Song} from "@/types";

interface SidebarEntryProps {
    song: Song;
}

const SidebarEntry: React.FC<SidebarEntryProps> = ({song}) => {
    return (
        <div className="flex flex-row place-content-before hover:bg-accent-neutral/20 transition px-2.5 py-1.5 my-0.5 rounded-md">
            <div className="w-5 h-5 bg-primary/20 my-auto"></div>
            <h3 className="pl-2 my-auto text-sm font-normal text-text/90">
                {song.title} - <span className="italic">{song.artist}</span>
            </h3>
        </div>
    );
};

export default SidebarEntry;
