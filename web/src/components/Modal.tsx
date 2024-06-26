import {SongMetadata, User} from "@/types";
import clsx from "clsx";
import {useEffect, useState} from "react";
import SongInfo from "./SongInfo";
import {IoMdClose} from "react-icons/io";

export default function ({
    showModal,
    setShowModal,
    songMetadata,
    user,
    dataEmitter,
    averageRating,
    setAverageRating,
    userRating,
    setUserRating,
    pinned,
    setPinned,
    favorited,
    setFavorited
}: {
    showModal: boolean;
    setShowModal: (value: boolean) => void;
    songMetadata: SongMetadata;
    user: User;
    dataEmitter?: Function;
    averageRating?: number;
    setAverageRating: (value: number) => void;
    userRating?: number;
    setUserRating: (value: number) => void;
    pinned?: boolean;
    setPinned: (value: boolean) => void;
    favorited?: boolean;
    setFavorited: (value: boolean) => void;
}) {
    // Used to smoothly transition in modal
    // Needed a changing state since otherwise Next will not render the transition from opacity 0 to 100
    const [display, setDisplay] = useState(false);

    useEffect(() => {
        setDisplay(showModal);
    }, [showModal]);
    return (
        <div
            className={clsx(
                "flex flex-col duration-200 place-content-center w-screen h-screen absolute bg-black/40 top-0 left-0 transition-all opacity-0",
                display && "opacity-100"
            )}
            onClick={() => setShowModal(!showModal)}
        >
            {/* This div will serve as the body for the modal. TODO --> Convert to a slotted component for reuse */}
            <div
                className="relative mx-auto z-30 border px-8 py-5 border-secondary w-3/5 h-3/5 bg-background/70 backdrop-blur-lg rounded-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <SongInfo
                    songMetadata={songMetadata}
                    user={user}
                    dataEmitter={dataEmitter}
                    averageRating={averageRating || undefined}
                    setAverageRating={setAverageRating}
                    userRating={userRating || undefined}
                    setUserRating={setUserRating}
                    pinned={pinned}
                    setPinned={setPinned}
                    favorited={favorited}
                    setFavorited={setFavorited}
                />
                <button
                    className="text-red-700 absolute right-2 top-1 text-2xl"
                    onClick={() => setShowModal(!showModal)}
                >
                    <IoMdClose />
                </button>
            </div>
        </div>
    );
}
