import Image from 'next/image';
import { IoMdStarOutline } from "react-icons/io";
import { IoMdStarHalf } from "react-icons/io";
import { IoMdStar } from "react-icons/io";

export default ({rating = false}) => {
    return (
        <div className="group h-80 w-64 rounded-xl border-2 border-secondary/20 bg-secondary/5 hover:bg-secondary/20 hover:border-secondary/30 hover:cursor-pointer transition-all hover:shadow-lg hover:shadow-secondary/20">
            <Image 
                src="https://media.pitchfork.com/photos/5eac22c8bae33a8e8fd0b191/1:1/w_450%2Cc_limit/Drake.jpg"
                width={175}
                height={175}
                className="group-hover:border-accent-neutral/10 transition-all mx-auto mt-6 border border-accent-neutral/5 shadow-xl rounded-xl"
            >
            </Image>
            <div className="flex flex-col place-content-start pt-4"> 
                <h1 className="text-xl font-bold text-center text-text/90 group-hover:text-text">Pain 1993</h1>
                <span className="text-sm text-center font-light text-text/50 group-hover:text-text/80">Drake</span>
            </div>
            {
                rating && 
                <div className="mx-auto place-content-center flex flex-row space-x-0.5 py-2">
                    <IoMdStar className="text-secondary text-2xl" />
                    <IoMdStar className="text-secondary text-2xl" />
                    <IoMdStar className="text-secondary text-2xl" />
                    <IoMdStar className="text-secondary text-2xl" />
                    <IoMdStarHalf className="text-secondary text-2xl" />
                </div>
            }
        </div>
    );
};
