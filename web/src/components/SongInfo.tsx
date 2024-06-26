import {Review, SongMetadata} from "@/types";
import {useWavesurfer} from "@wavesurfer/react";
import {useEffect, useRef, useState} from "react";

import Image from "next/image";
import {BsHeart, BsHeartFill, BsPinAngle, BsPinAngleFill} from "react-icons/bs";
import {IoMdStar, IoMdStarHalf} from "react-icons/io";
import {IoPauseCircleOutline, IoPlayCircleOutline} from "react-icons/io5";

import {theme} from "../../tailwind.config";
import {User} from "../types";
import Comment from "./Comment";
const tailwindColors = theme.extend.colors;

export default function ({
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
    const userId = user.id;

    const [dbUserRating, setDbUserRating] = useState(songMetadata.user_rating);

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
        } catch {
            console.log("[WARN] Failed to parse as JSON, setting to empty array");
            data = [];
        }
        setReviews(data);
    }

    useEffect(() => {
        getReviews();
        const interval = setInterval(getReviews, 2000);
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

    async function updateRatingFavPin(favorited: boolean, pinned: boolean) {
        const response = await fetch("/api/db/rating-fav-pin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                song_id: songMetadata.id,
                rating: userRating || null,
                favorited,
                pinned
            })
        });
        const jsonResponse = await response.json();
        setAverageRating(jsonResponse.avg_rating);
        setFavorited(jsonResponse.favorited);
        setPinned(jsonResponse.pinned);
        setUserRating(jsonResponse.user_rating);
        setDbUserRating(jsonResponse.user_rating);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
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

        if (userRating !== dbUserRating) {
            updateRatingFavPin(favorited || false, pinned || false);
        }

        setReviewText("");
        getReviews();

        if (dataEmitter) dataEmitter();
    }

    return (
        <div className="flex flex-row h-full divide-x divide-accent-neutral/20 space-x-2">
            <div className="flex flex-col place-content-between h-full w-2/5 overflow-scroll pr-6">
                <div>
                    <div className="w-full flex flex-row place-content-between">
                        <img
                            src={songMetadata.albumArtUrl}
                            alt="Album Art"
                            width={150}
                            height={150}
                            className="border border-accent-neutral/5 shadow-xl rounded-xl select-none"
                        />
                        {
                            // React does not update state fast enough, hardcoded values are passed into request
                            <div className="flex flex-col space-y-4">
                                {pinned ? (
                                    <BsPinAngleFill
                                        onClick={() => {
                                            setPinned(false);
                                            updateRatingFavPin(favorited || false, false);
                                        }}
                                    />
                                ) : (
                                    <BsPinAngle
                                        onClick={() => {
                                            setPinned(true);
                                            updateRatingFavPin(favorited || false, true);
                                        }}
                                    />
                                )}
                                {favorited ? (
                                    <BsHeartFill
                                        onClick={() => {
                                            setFavorited(false);
                                            updateRatingFavPin(false, pinned || false);
                                        }}
                                    />
                                ) : (
                                    <BsHeart
                                        onClick={() => {
                                            setFavorited(true);
                                            updateRatingFavPin(true, pinned || false);
                                        }}
                                    />
                                )}
                            </div>
                        }
                    </div>
                    {averageRating && (
                        <div className="flex flex-row space-x-0 mx-auto my-1">
                            {Array.from({length: Math.floor(averageRating)}, (_, index) => (
                                <IoMdStar key={index} className="text-secondary text-3xl" />
                            ))}
                            {averageRating - Math.floor(averageRating) >= 0.5 && (
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
                            reviews.map((rvw) => {
                                return (
                                    <Comment user={user} review={rvw} dataEmitter={dataEmitter} />
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
                                        onClick={() => setUserRating(ratingValue)}
                                        className={`cursor-pointer ${
                                            ratingValue <= (userRating ? userRating : 0)
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
