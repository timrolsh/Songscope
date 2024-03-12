import {Review, SongMetadata} from "@/types";
import {useWavesurfer} from "@wavesurfer/react";
import {useEffect, useRef, useState} from "react";

import Image from "next/image";
import {BsHeart, BsHeartFill, BsPinAngle, BsPinAngleFill} from "react-icons/bs";
import {IoMdStar, IoMdStarHalf} from "react-icons/io";
import {IoPauseCircleOutline, IoPlayCircleOutline} from "react-icons/io5";
import Link from "next/link";

import {theme} from "../../tailwind.config";
import {CommentTimestamp} from "@/dates";
import clsx from "clsx";
import {User} from "../types";
import {MdOutlineDeleteOutline} from "react-icons/md";
const tailwindColors = theme.extend.colors;

export default function ({
    songMetadata,
    user,
    dataEmitter
}: {
    songMetadata: SongMetadata;
    user: User;
    dataEmitter?: Function;
}) {
    const userId = user.id;
    const [pinned, setPinned] = useState(false);
    const [favorite, setFavorite] = useState(false);
    const [pinfavFetched, setPinfavFetched] = useState(false);
    const [rating, setRating] = useState(0);
    const [initialRating, setInitialRating] = useState(0);

    useEffect(() => {
        async function fetchRating() {
            const res = await fetch(`/api/db/get-rating`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({songid: songMetadata.id, userid: userId})
            });

            if (res.status !== 200) console.log("Non 200 code received");

            let data: number;

            if (res.ok) {
                data = await res.json();
                console.log("[INFO] Parsed successfully as JSON: ", data);
                setRating(data);
                setInitialRating(data);
            } else {
                throw new Error("Error fetching rating: " + res.status + " " + res.statusText);
            }
        }

        fetchRating().catch((error) => {
            console.error("Error fetching rating:", error);
        });
    }, []);

    useEffect(() => {
        async function fetchPinFav() {
            const res = await fetch(`/api/db/get-favorite-pin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({user_id: userId, song_id: songMetadata.id})
            });

            if (res.status !== 200) console.log("Non 200 code received");

            let data: Record<string, boolean>;

            if (res.ok) {
                const data = await res.json();
                console.log("[INFO] Parsed successfully as JSON: ", data);
                setPinned(data.pinned);
                setFavorite(data.favorite);
                setPinfavFetched(true);
            } else {
                throw new Error("Error fetching pin/fav: " + res.status + " " + res.statusText);
            }
        }

        fetchPinFav().catch((error) => {
            console.error("Error fetching pin/fav:", error);
        });
    }, []);

    function togglePin() {
        const res = fetch(`/api/db/pin-or-favorite-song`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: userId,
                song_id: songMetadata.id,
                pin_state: !pinned,
                fav_state: favorite
            })
        });

        res.then((res) => {
            if (res.status !== 200) console.log("Non 200 code received");
            if (res.ok) {
                setPinned(!pinned);
                if (dataEmitter) dataEmitter();
            } else {
                console.error("Error toggling pin/fav (db): ", res.status, res.statusText);
            }
        }).catch((e) => {
            console.error("Error toggling pin/fav (fetch): ", e);
        });
    }

    function toggleFavorite() {
        const res = fetch(`/api/db/pin-or-favorite-song`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: userId,
                song_id: songMetadata.id,
                pin_state: pinned,
                fav_state: !favorite
            })
        });

        res.then((res) => {
            if (res.status !== 200) console.log("Non 200 code received");
            if (res.ok) {
                setFavorite(!favorite);
                if (dataEmitter) dataEmitter();
            } else {
                console.error("Error toggling pin/fav (db): ", res.status, res.statusText);
            }
        }).catch((e) => {
            console.error("Error toggling pin/fav (fetch): ", e);
        });
    }

    function leaveRating(newRating: number) {
        setRating(newRating);
    }

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
        const interval = setInterval(getReviews, 3000);
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
        if (reviewText) {
            const formData = new FormData(event.currentTarget);
            formData.append("userid", userId);
            formData.append("songid", songMetadata.id);
            const data: Record<string, string> = {};

            for (const [key, value] of formData.entries()) {
                data[key] = value.toString();
            }

            await submitToServer(data, "/api/db/insert-review");
        }

        if (rating !== initialRating) {
            const response = await fetch("/api/db/leave-rating", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    songId: songMetadata.id,
                    userId: userId,
                    rating: rating
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }

        setReviewText("");
        getReviews();

        if (dataEmitter) dataEmitter();
    }

    async function deleteReview(comment_id: string, comment_user_id: string) {
        if (!user) {
            console.error("No user session found");
            return;
        }
        if (comment_user_id !== userId && !user.isAdmin) {
            console.error("Unauthorized to delete review");
            return;
        }

        const response = await fetch("/api/db/delete-review", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({comment_id, comment_user_id})
        });

        if (response.status === 401) console.error("Unauthorized");
        else if (response.status !== 200) console.log("Non 200 code received");

        if (response.ok && dataEmitter) {
            dataEmitter();
        } else {
            console.error("Error deleting review: ", response.status, response.statusText);
        }
    }

    return (
        <div className="flex flex-row h-full divide-x divide-accent-neutral/20 space-x-2">
            <div className="flex flex-col place-content-between h-full w-2/5 overflow-scroll pr-6">
                <div>
                    <div className="w-full flex flex-row place-content-between">
                        <Image
                            src={songMetadata.albumArtUrl}
                            alt="Album Art"
                            width={150}
                            height={150}
                            className="border border-accent-neutral/5 shadow-xl rounded-xl select-none"
                        ></Image>
                        {pinfavFetched && (
                            <div className="flex flex-col space-y-4">
                                {pinned ? (
                                    <BsPinAngleFill onClick={togglePin} />
                                ) : (
                                    <BsPinAngle onClick={togglePin} />
                                )}
                                {favorite ? (
                                    <BsHeartFill onClick={toggleFavorite} />
                                ) : (
                                    <BsHeart onClick={toggleFavorite} />
                                )}
                            </div>
                        )}
                    </div>
                    {songMetadata.rating && (
                        <div className="flex flex-row space-x-0 mx-auto my-1">
                            {Array.from({length: Math.floor(songMetadata.rating)}, (_, index) => (
                                <IoMdStar key={index} className="text-secondary text-3xl" />
                            ))}
                            {songMetadata.rating - Math.floor(songMetadata.rating) >= 0.5 && (
                                <IoMdStarHalf className="text-secondary text-3xl" />
                            )}
                        </div>
                    )}
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
                                    {Array(Math.floor(Number(songMetadata.popularity) / 20))
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
                                    <div
                                        className={clsx(
                                            (user.isAdmin || rvw.user_id === user.id) &&
                                                "hover:bg-accent-neutral/10 rounded-sm",
                                            "w-full flex flex-col py-1 group"
                                        )}
                                        key={idx}
                                    >
                                        <div className="flex flex-row space-x-2 pl-1">
                                            <h3 className="font-semibold text-text/90 w-11/12">
                                                &gt;{" "}
                                                <Link
                                                    className="hover:text-text font-bold"
                                                    href={"/profile/" + rvw.user_id}
                                                >
                                                    {rvw.name}
                                                </Link>{" "}
                                                <span className="italic font-normal">says </span>
                                                <span className="font-normal text-text/90 break-words">
                                                    "{rvw.comment_text}"
                                                </span>
                                            </h3>
                                        </div>
                                        <h4 className="font-light italic text-text/40 px-2 flex flex-row place-content-between">
                                            {CommentTimestamp(rvw.time)}
                                            {(user.isAdmin || rvw.user_id === user.id) && (
                                                <button
                                                    className="text-red-500 hover:text-red-700 hover:cursor-pointer invisible group-hover:visible"
                                                    onClick={() =>
                                                        deleteReview(rvw.comment_id, rvw.user_id)
                                                    }
                                                >
                                                    <MdOutlineDeleteOutline />
                                                </button>
                                            )}
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
                            className="text-text/90 p-2 font-normal text-sm bg-secondary/20 rounded-md w-full h-3/5 resize-none"
                        />
                    </div>

                    <div className="flex flex-row place-content-between">
                        <div className="flex flex-row-reverse pb-1 mb-2 mr-auto">
                            {[...Array(5)].reverse().map((_, index) => {
                                const ratingValue = 5 - index;
                                return (
                                    <IoMdStar
                                        key={ratingValue}
                                        onClick={() => leaveRating(ratingValue)}
                                        className={`cursor-pointer ${
                                            ratingValue <= rating
                                                ? "text-primary"
                                                : "text-accent-neutral/20"
                                        } text-3xl`}
                                    />
                                );
                            })}
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
