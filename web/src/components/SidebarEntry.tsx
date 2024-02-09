import React from "react";
import {SongMetadata} from "@/types";
import Image from "next/image";

interface SidebarEntryProps {
    song: SongMetadata;
}

const SidebarEntry: React.FC<SidebarEntryProps> = ({song}) => {
    return (
        <div className="flex flex-row place-content-before hover:bg-accent-neutral/20 transition px-2.5 py-1.5 my-0.5 rounded-md">
            <Image
                src={song.albumArtUrl}
                alt="Album Art"
                width={40}
                height={40}
                className="rounded-md"
            />

            {/* Improve text clipping on this and make it better than simply truncate */}
            <div className="flex flex-col space-y-1 pl-2 my-auto text-sm w-5/6 font-normal text-text/90 ">
                <h3 className="truncate w-full">{song.name}</h3>
                <span className="italic truncate text-sm text-text/60">{song.artist}</span>
            </div>
        </div>
    );
};

export default SidebarEntry;
