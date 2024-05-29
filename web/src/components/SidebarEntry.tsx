import React, { useState } from "react";
import {SongMetadata} from "@/types";
import Image from "next/image";
import Modal from "./Modal";
import {User} from "@/types";

interface SidebarEntryProps {
    song: SongMetadata;
    user?: User;
}

const SidebarEntry: React.FC<SidebarEntryProps> = ({song, user}) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            {
                (showModal && user) && (
                    <Modal
                        showModal={showModal}
                        setShowModal={setShowModal}
                        songMetadata={song}
                        user={user}
                    />
                )
            }
            <div className="flex flex-row place-content-before hover:bg-accent-neutral/20 transition px-2.5 py-1.5 my-0.5 rounded-md hover:cursor-pointer"
                onClick={() => setShowModal(!showModal)}
            >
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
        </>
    );
};

export default SidebarEntry;
