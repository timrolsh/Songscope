import Link from "next/link";

export default (): JSX.Element => {
    return (
        <div className="h-screen w-screen m-auto flex place-content-center bg-gradient-radial from-primary/5  to-accent-vivid/5">
            <div className="m-auto pb-32">
                <div className="bg-clip-text bg-gradient-to-br from-primary to-accent-vivid">
                    <h1 className="text-9xl text-center text-transparent font-bold tracking-wide">
                        404
                    </h1>
                    <h3 className="text-2xl text-center font-semibold tracking-wide text-gray-300 pb-4">
                        Page Not Found
                    </h3>

                    <div className="border border-accent-neutral/30 flex flex-row place-content-center text-white/80 hover:text-white bg-secondary/80 mx-8 py-1 rounded-lg hover:bg-secondary transition">
                        <Link className="text-lg" href={"/"}>
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
