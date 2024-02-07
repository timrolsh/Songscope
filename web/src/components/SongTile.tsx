import Image from "next/image";
import {IoMdStarHalf} from "react-icons/io";
import {IoMdStar} from "react-icons/io";
import {IoMdClose} from "react-icons/io";
import {IoPlayCircleOutline, IoPauseCircleOutline} from "react-icons/io5";

import {useWavesurfer} from "@wavesurfer/react";

import {theme} from "../../tailwind.config";

const tailwindColors = theme.extend.colors;

import {useState, useRef, useEffect, useCallback} from "react";
import clsx from "clsx";
import {SongMetadata, Review} from "@/types";
import {User} from "@/types";

export function Modal({
    showModal,
    setShowModal,
    songMetadata,
    user
}: {
    showModal: boolean;
    setShowModal: (value: boolean) => void;
    songMetadata: SongMetadata;
    user: User;
}) {
    console.log("Modal user: ", user);
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
                <SongInfo songMetadata={songMetadata} userId={user.id} />
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

function SongInfo({songMetadata, userId}: {songMetadata: any; userId: any}) {
    const containerRef = useRef<any>();

    const {wavesurfer, isReady, isPlaying, currentTime} = useWavesurfer({
        container: containerRef,
        url: songMetadata.previewUrl,
        waveColor: tailwindColors.secondary,
        progressColor: tailwindColors.primary,
        dragToSeek: true,
        height: "auto",
        barWidth: 1.5,
        barGap: 1,
        barRadius: 5,
        cursorColor: tailwindColors.accent.neutral
    });

    const onPlayPause = () => {
        wavesurfer && wavesurfer.playPause();
    };

    const [reviewText, setReviewText] = useState("");
    // TODO: Beautify the datetime returned and format it in human-readable format
    const [reviews, setReviews] = useState<Review[]>([]);

    async function getReviews() {
        const res = await fetch(`/api/db/get-reviews?songid=${songMetadata.id}`);
        if (res.status !== 200) console.log("Non 200 code received");

        let data: Review[];
        try {
            data = JSON.parse(await res.text());
            console.log("[INFO] Parsed successfully as JSON: ", data);
        } catch {
            console.log("[WARN] Failed to parse as JSON, setting to empty array");
            data = [];
        }
        setReviews(data);
    }

    useEffect(() => {
        getReviews();
        const interval = setInterval(getReviews, 5000);
        return () => clearInterval(interval);
    }, []);

    async function submitToServer(data: any, endpoint: string): Promise<Response> {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        return response;
    }

    async function submitReview(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        console.log("Appending userid: ", userId);
        formData.append("userid", userId);
        formData.append("songid", songMetadata.id);
        const data: Record<string, string> = {};

        for (const [key, value] of formData.entries()) {
            data[key] = value.toString();
        }

        await submitToServer(data, "/api/db/insert-review");

        setReviewText("");
        getReviews();
    }

    return (
        <div className="flex flex-row h-full divide-x divide-accent-neutral/20 space-x-8">
            <div className="flex flex-col place-content-between h-full w-2/5 overflow-scroll">
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
                                    {songMetadata.album}
                                </span>{" "}
                            </h3>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-text/90">
                                Popularity:{" "}
                                <span className="font-normal italic text-sm text-text/50">
                                    {/* TODO --> Verify this is working properly */}
                                    {Array(Math.floor(songMetadata.popularity / 20))
                                        .fill(0)
                                        .map((_) => "🔥")}
                                </span>{" "}
                            </h3>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-text/90">
                                Released:{" "}
                                <span className="font-normal italic text-sm text-text/50">
                                    {songMetadata.releaseDate}
                                </span>{" "}
                            </h3>
                        </div>
                    </div>
                </div>
                {songMetadata.previewUrl && (
                    // Would be cool to have users able to link to certain parts of the song within comments
                    <div className="flex flex-row space-x-2 mt-auto mb-2 pt-2">
                        {/* Look into adding in timestamps later... */}
                        {/* <div> */}
                        <div className="w-40 h-8 relative" ref={containerRef} />
                        {/* <p className="absolute bottom-1 text-sm italic text-accent-neutral/70">{currentTime.toFixed(0)} : {wavesurfer?.getDuration().toFixed(0)}</p> */}
                        {/* </div> */}
                        {isPlaying ? (
                            <IoPauseCircleOutline
                                className="text-3xl my-auto text-rose-700 hover:cursor-pointer"
                                onClick={onPlayPause}
                            />
                        ) : (
                            <IoPlayCircleOutline
                                className="text-3xl my-auto text-rose-700 hover:cursor-pointer"
                                onClick={onPlayPause}
                            />
                        )}
                    </div>
                )}
            </div>
            <div className="flex flex-col divide-y divide-secondary/80 pl-8 w-3/5">
                <div className="h-1/2">
                    <h3 className="text-lg font-bold text-text">See what others are saying!</h3>
                    <div className="overflow-auto pt-2 h-3/4">
                        {reviews?.length ? (
                            reviews.map((rvw, idx) => {
                                return (
                                    <div className="w-full flex flex-col py-1" key={idx}>
                                        <div className="flex flex-row space-x-2 pl-1">
                                            <h3 className="font-semibold text-text/90">
                                                &gt; <a className="hover:text-text font-bold" href={"/profile/" + rvw.id}>{rvw.name}</a>{" "}
                                                <span className="italic font-normal">says </span>
                                                <span className="font-normal text-text/90">
                                                    "{rvw.comment_text}"
                                                </span>
                                            </h3>
                                        </div>
                                        <h4 className="font-light italic text-text/40 pl-1">
                                            {rvw.time}
                                        </h4>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-row space-x-2 py-1 pl-1">
                                <h3 className="font-normal italic text-text/60">
                                    No comments yet! Be the first to leave a review!
                                </h3>
                            </div>
                        )}
                    </div>
                </div>
                <form className="h-1/2 text-lg font-bold text-text pt-2" onSubmit={submitReview}>
                    <div className="h-3/4">
                        <h3 className="pb-2">Leave a Review!</h3>
                        {/* TODO --> Add a character counter and limit */}
                        <textarea
                            name="reviewbody"
                            onChange={(e) => setReviewText(e.target.value)}
                            value={reviewText}
                            required
                            className="text-text/90 p-2 font-normal text-sm bg-secondary/20 rounded-md w-full h-3/5 resize-none"
                        />
                    </div>
                    <div className="flex flex-row place-content-between">
                        <div className="flex flex-row-reverse pb-1 mb-2 mr-auto">
                            <IoMdStar className="peer hover:text-primary text-accent-neutral/20 text-3xl" />
                            <IoMdStar className="peer peer-hover:text-primary hover:text-primary text-accent-neutral/20 text-3xl" />
                            <IoMdStar className="peer peer-hover:text-primary hover:text-primary text-accent-neutral/20 text-3xl" />
                            <IoMdStar className="peer peer-hover:text-primary hover:text-primary text-accent-neutral/20 text-3xl" />
                            <IoMdStar className="peer peer-hover:text-primary hover:text-primary text-accent-neutral/20 text-3xl" />
                        </div>
                        <button
                            className="ml-auto bg-secondary/70 hover:bg-secondary text-text/90 hover:text-text/90 rounded-md px-3 py-1"
                            type="submit"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ({
    rating = false,
    metadata,
    user,
}: {
    rating?: boolean;
    metadata: any;
    user: User;
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
