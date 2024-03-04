import Image from "next/image";
import {IoMdStarHalf} from "react-icons/io";
import {IoMdStar} from "react-icons/io";
import {useState} from "react";
import {User} from "@/types";
import Modal from "./Modal";

export default ({
    rating = null,
    metadata,
    user,
    dataEmitter
}: {
    rating?: number | null;
    metadata: any;
    user: User;
    dataEmitter?: Function;
}) => {
    // TODO --> Migrate this to global ctx, cannot have more than one modal at a time
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            {showModal && (
                <Modal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    songMetadata={metadata}
                    user={user}
                    dataEmitter={dataEmitter}
                />
            )}
            <div
                className="mx-auto select-none group h-80 w-64 rounded-xl border-2 border-secondary/20 bg-secondary/5 hover:bg-secondary/20 hover:border-secondary/30 hover:cursor-pointer transition-all hover:shadow-lg hover:shadow-secondary/20"
                onClick={() => setShowModal(!showModal)}
            >
                <Image
                    src={metadata.albumArtUrl}
                    alt="Album Art"
                    width={150}
                    height={150}
                    className="group-hover:border-accent-neutral/10 transition-all mx-auto mt-6 border border-accent-neutral/5 shadow-xl rounded-xl select-none"
                ></Image>
                <div className="flex flex-col select-text place-content-start pt-4">
                    <h1 className="text-xl font-bold text-center text-text/90 group-hover:text-text line-clamp-1 px-1">
                        {metadata.name}
                    </h1>
                    <span className="text-sm text-center font-light text-text/50 group-hover:text-text/80">
                        {metadata.artist}
                    </span>
                </div>
                {rating && (
                    <div className="mx-auto place-content-center flex flex-row space-x-0.5 py-2 ">
                        {rating && (
                            <div className="mx-auto place-content-center flex flex-row space-x-0.5 py-2">
                                {Array.from({length: Math.floor(rating)}, (_, index) => (
                                    <IoMdStar key={index} className="text-secondary text-2xl" />
                                ))}
                                {rating % 1 !== 0 && (
                                    <IoMdStarHalf className="text-secondary text-2xl" />
                                )}
                                {Math.ceil(rating) - rating > 0.5 && (
                                    <IoMdStarHalf className="text-secondary text-2xl" />
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};
