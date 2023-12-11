import Image from 'next/image';
import { IoMdStarOutline } from "react-icons/io";
import { IoMdStarHalf } from "react-icons/io";
import { IoMdStar } from "react-icons/io";

export default () => {
    return (
        <div className="h-96 w-80 rounded-xl border border-accent-neutral/20">
            <Image 
                src="https://media.pitchfork.com/photos/5eac22c8bae33a8e8fd0b191/1:1/w_450%2Cc_limit/Drake.jpg"
                width={250}
                height={250}
                className="mx-auto mt-3"
            >
            </Image>
            <div className="mx-auto place-content-center flex flex-row space-x-2 py-2">
                <IoMdStar className="text-yellow-500 text-2xl" />
                <IoMdStar className="text-yellow-500 text-2xl" />
                <IoMdStar className="text-yellow-500 text-2xl" />
                <IoMdStar className="text-yellow-500 text-2xl" />
                <IoMdStarHalf className="text-yellow-500 text-2xl" />
            </div>
            <div className="w-full flex flex-row place-content-evenly px-8 pt-2">
                <h1 className="text-xl font-bold text-center text-text mr-auto mt-auto">Pain 1993</h1>
                <span className="text-lg text-center font-normal text-text mt-auto">Drake</span>
            </div>
        </div>
    );
};
