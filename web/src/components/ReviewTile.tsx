import {CommentTimestamp} from "@/dates";
import {ProfileTopReviews} from "@/pages/api/db/get-top-user-reviews";
import {Review, SongMetadata} from "@/types";
import {BsHeart, BsHeartFill} from "react-icons/bs";

export default ({profileReview}: {profileReview: ProfileTopReviews}) => {
    return (
        <div className="rounded-xl h-40 w-80 px-4 py-2 border border-secondary/20 bg-secondary/5 flex flex-col">
            <h3 className="font-bold italic text-text/90">{profileReview.title}</h3>
            <h3 className="font-light italic text-text/50">{profileReview.artist}</h3>
            <p className="font-normal text-secondary/90 text-sm overflow-ellipsis w-full text-nowrap overflow-y-scroll my-1.5">
                {profileReview.comment_text}
            </p>
            <div className="mt-auto flex flex-row place-content-between">
                <span className="flex flex-row space-x-1">
                    <p className="my-auto font-bold text-text/90 text-sm">
                        {profileReview.num_likes}
                    </p>
                    <BsHeartFill className="my-auto text-primary/90 text-sm" />
                </span>
                <p className="font-bold text-text/90 text-sm italic ml-auto">
                    {CommentTimestamp(profileReview.time)}
                </p>
            </div>
        </div>
    );
};
