import {CommentTimestamp} from "@/dates";
import {ProfileTopReviews} from "@/types";
import {BsHeartFill} from "react-icons/bs";

export default ({profileReview}: {profileReview: ProfileTopReviews}) => {
    return (
        <div className="rounded-xl h-32 w-80 px-4 py-2 border border-secondary/20 bg-secondary/5 flex flex-col">
            <div className="flex flex-col h-16">
                <h3 className="font-bold italic text-text/90 truncate">{profileReview.title}</h3>
                <h3 className="font-light italic text-text/50">{profileReview.artist}</h3>
            </div>
            <p className="font-normal text-secondary/90 text-sm w-full overflow-y-scroll my-1.5 h-12">
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
