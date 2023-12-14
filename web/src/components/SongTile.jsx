import Image from 'next/image';
import { IoMdStarOutline } from "react-icons/io";
import { IoMdStarHalf } from "react-icons/io";
import { IoMdStar } from "react-icons/io";

export default ({songName, artistName, albumArt}) => {
    return (
        <div className="h-80 w-70 rounded-xl border border-accent-vivid/30 bg-accent-neutral/5">
            <Image 
                src={albumArt}
                width={200}
                height={200}
                className="mx-auto mt-6 border border-accent-neutral/20 rounded-xl"
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
                <h1 className="text-lg font-bold text-center text-text mr-auto mt-auto">{songName}</h1>
                <span className="text-lg text-center font-normal text-text mt-auto">{artistName}</span>
            </div>
        </div>
    );
};
