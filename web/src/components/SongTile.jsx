import Image from "next/image";

import {IoMdStarHalf} from "react-icons/io";
import {IoMdStar} from "react-icons/io";
import {IoMdClose} from "react-icons/io";
import {IoPlayCircleOutline} from "react-icons/io5";

import {useState, useEffect} from "react";
import clsx from "clsx";

export function Modal({showModal, setShowModal, songMetadata}) {
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
                className="relative mx-auto z-30 border px-8 py-5 border-secondary w-1/2 h-1/2 bg-background/70 backdrop-blur-lg rounded-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <SongInfo songMetadata={songMetadata} />
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

function SongInfo({songMetadata}) {
    return (
        <div className="flex flex-row h-full divide-x divide-accent-neutral/20 space-x-8">
            <div className="flex flex-col place-content-between h-full w-2/5">
                <div>
                    <Image
                        src={songMetadata.albumArtUrl}
                        alt="Album Art"
                        width={150}
                        height={150}
                        className="border border-accent-neutral/5 shadow-xl rounded-xl select-none"
                    ></Image>
                    <div className="flex flex-row space-x-0 mx-auto my-1">
                        <IoMdStar className="text-secondary text-3xl" />
                        <IoMdStar className="text-secondary text-3xl" />
                        <IoMdStar className="text-secondary text-3xl" />
                        <IoMdStar className="text-secondary text-3xl" />
                        <IoMdStarHalf className="text-secondary text-3xl" />
                    </div>
                    <div className="flex flex-col -space-y-1 mt-2.5">
                        <h3 className="font-bold text-lg text-text">{songMetadata.name}</h3>
                        <h3 className="font-normal italic text-md text-text/50">
                            {songMetadata.artist}
                        </h3>
                    </div>
                    <div className="flex flex-col space-y-2.5 mt-3">
                        <div>
                            <h3 className="font-bold text-sm text-text/90">
                                Album:{" "}
                                <span className="font-normal italic text-sm text-text/50">
                                    Dark Lane Demo Tapes
                                </span>{" "}
                            </h3>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-text/90">
                                Popularity:{" "}
                                <span className="font-normal italic text-sm text-text/50">
                                    🔥🔥🔥🔥
                                </span>{" "}
                            </h3>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-text/90">
                                Released:{" "}
                                <span className="font-normal italic text-sm text-text/50">
                                    December 13, 2023
                                </span>{" "}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row space-x-2 mt-auto mb-2">
                    <div className="w-40 h-8 relative">
                        <div className="w-40 h-px left-0 top-[15.81px] absolute border border-rose-700"></div>
                        <div className="w-4 h-px left-[3px] top-[8.90px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-5 h-px left-[7px] top-[5.94px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-4 h-px left-[11px] top-[9.90px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-6 h-px left-[16px] top-[5.94px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-8 h-px left-[20px] top-0 absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-6 h-px left-[24px] top-[5.94px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-4 h-px left-[50px] top-[9.90px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-5 h-px left-[45px] top-[5.94px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-4 h-px left-[40px] top-[9.90px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-6 h-px left-[35px] top-[5.94px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-8 h-px left-[30px] top-0 absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-6 h-px left-[25px] top-[5.94px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-3 h-px left-[52px] top-[11.88px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-4 h-px left-[55px] top-[8.91px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-3 h-px left-[58px] top-[11.88px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-5 h-px left-[61px] top-[8.91px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-6 h-px left-[64px] top-[3.96px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-5 h-px left-[68px] top-[8.91px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-3 h-px left-[87px] top-[11.88px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-4 h-px left-[83px] top-[8.91px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-3 h-px left-[79px] top-[11.88px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-5 h-px left-[76px] top-[8.91px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-6 h-px left-[72px] top-[3.96px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-4 h-px left-[128px] top-[9.90px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-5 h-px left-[133px] top-[5.94px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-4 h-px left-[139px] top-[9.90px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-6 h-px left-[145px] top-[5.94px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-8 h-px left-[150px] top-0 absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-6 h-px left-[156px] top-[5.94px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-3 h-px left-[126px] top-[11.88px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-4 h-px left-[122px] top-[8.91px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-3 h-px left-[119px] top-[11.88px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-5 h-px left-[115px] top-[8.91px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-6 h-px left-[112px] top-[3.96px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-5 h-px left-[107px] top-[8.91px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-3 h-px left-[86px] top-[11.88px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-4 h-px left-[91px] top-[8.91px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-3 h-px left-[95px] top-[11.88px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-5 h-px left-[98px] top-[8.91px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                        <div className="w-6 h-px left-[103px] top-[3.96px] absolute origin-top-left rotate-90 border border-rose-700"></div>
                    </div>
                    {/* TODO --> Add Tooltip */}
                    <IoPlayCircleOutline className="text-3xl my-auto text-rose-700 hover:cursor-pointer" />
                </div>
            </div>
            <div className="flex flex-col divide-y divide-secondary/80 pl-8 w-3/5">
                <div className="h-1/2">
                    <h3 className="text-lg font-bold text-text">See what others are saying!</h3>
                    <div className="overflow-auto pt-2 h-3/4">
                        {[...Array(5)].map((_, idx) => {
                            return (
                                <div className="flex flex-row space-x-2 py-1 pl-1">
                                    <h3 className="font-semibold text-text/90">
                                        &gt; TimRolsh123{" "}
                                        <span className="italic font-normal">says </span>
                                        <span className="font-normal text-text/90">
                                            "This song is great! Better than his other works..."
                                        </span>
                                    </h3>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="h-1/2 text-lg font-bold text-text pt-2">
                    <div className="h-3/4">
                        <h3 className="pb-2">Leave a Review!</h3>
                        {/* TODO --> Add a character counter and limit */}
                        <textarea
                            type="text"
                            name="name"
                            className="text-text/90 p-2 font-normal text-sm bg-secondary/20 rounded-md w-full h-3/5 resize-none"
                        ></textarea>
                    </div>
                    <div className="flex flex-row place-content-between">
                        <div className="flex flex-row-reverse pb-1 mb-2 mr-auto">
                            <IoMdStar className="peer hover:text-primary text-accent-neutral/20 text-3xl" />
                            <IoMdStar className="peer peer-hover:text-primary hover:text-primary text-accent-neutral/20 text-3xl" />
                            <IoMdStar className="peer peer-hover:text-primary hover:text-primary text-accent-neutral/20 text-3xl" />
                            <IoMdStar className="peer peer-hover:text-primary hover:text-primary text-accent-neutral/20 text-3xl" />
                            <IoMdStar className="peer peer-hover:text-primary hover:text-primary text-accent-neutral/20 text-3xl" />
                        </div>
                        <button className="ml-auto bg-secondary/70 hover:bg-secondary text-text/90 hover:text-text/90 rounded-md px-3 py-1">
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ({rating = false, metadata}) => {
    // TODO --> Migrate this to global ctx, cannot have more than one modal at a time
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            {showModal && (
                <Modal showModal={showModal} setShowModal={setShowModal} songMetadata={metadata} />
            )}
            <div
                className="select-none group h-80 w-64 rounded-xl border-2 border-secondary/20 bg-secondary/5 hover:bg-secondary/20 hover:border-secondary/30 hover:cursor-pointer transition-all hover:shadow-lg hover:shadow-secondary/20"
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
                        <IoMdStar className="text-secondary text-2xl" />
                        <IoMdStar className="text-secondary text-2xl" />
                        <IoMdStar className="text-secondary text-2xl" />
                        <IoMdStar className="text-secondary text-2xl" />
                        <IoMdStarHalf className="text-secondary text-2xl" />
                    </div>
                )}
            </div>
        </>
    );
};
