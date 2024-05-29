import {Review, User} from "@/types";
import {useEffect, useState} from "react";

import {BsHeart, BsHeartFill} from "react-icons/bs";
import Link from "next/link";

import {CommentTimestamp} from "@/dates";
import clsx from "clsx";
import {MdOutlineDeleteOutline} from "react-icons/md";

export default function ({
    user,
    review,
    dataEmitter
}: {
    user: User;
    review: Review;
    dataEmitter?: Function;
}) {
    const [like, setLike] = useState<boolean>(review.user_liked);

    async function toggleLike() {
        const res = await fetch(`/api/db/like-comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({user_id: user.id, comment_id: review.comment_id, like: !like})
        });

        if (res.status !== 200) console.log("Non 200 code received");

        if (res.ok) {
            setLike(!like);
        } else {
            console.error("Error toggling like: ", res.status, res.statusText);
        }
    }

    async function deleteReview(comment_id: string, comment_user_id: string) {
        if (!user) {
            console.error("No user session found");
            return;
        }
        if (comment_user_id !== review.user_id && !user.isAdmin) {
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
        <div
            className={clsx(
                (user.isAdmin || review.user_id === user.id) &&
                    "hover:bg-accent-neutral/10 rounded-md",
                "w-full flex flex-col py-2 group pl-3 pr-5"
            )}
            key={review.comment_id}
        >
            <div className="flex flex-row place-content-between">
                <div className="flex flex-row space-x-2">
                    <h3 className="font-semibold text-text/90 text-md">
                        <Link
                            className="hover:text-white font-bold"
                            href={"/profile/" + review.user_id}
                        >
                            {review.name}
                        </Link>{" "}
                    </h3>
                    <h4 className="font-light italic text-text/40 my-auto text-xs">
                        {CommentTimestamp(review.time)}
                    </h4>
                </div>
                <div className="flex flex-col space-y-3">
                    <button
                        className={clsx(
                            like
                                ? "text-primary hover:text-red-700"
                                : "text-gray-500 hover:text-primary",
                            "hover:cursor-pointer text-sm my-auto"
                        )}
                        onClick={toggleLike}
                    >
                        {like ? <BsHeartFill /> : <BsHeart />}
                    </button>
                </div>
            </div>
            <div className="pl-2 ml-1 border-l-2 border-accent-neutral/50">
                <span className="text-sm font-normal text-text/90 break-words">
                    {review.comment_text}
                </span>
                <div className="flex flex-row place-content-between">
                    <span className="text-sm italic font-normal text-text/40 break-words">
                        {review.num_likes === 1
                            ? review.num_likes + " like"
                            : review.num_likes + " likes"}
                    </span>
                    {(user.isAdmin || review.user_id === user.id) && (
                        <button
                            className="text-primary hover:text-red-700 hover:cursor-pointer invisible group-hover:visible"
                            onClick={() => deleteReview(review.comment_id, review.user_id)}
                        >
                            <MdOutlineDeleteOutline />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}