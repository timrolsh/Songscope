import GoogleSignInButton from "@/components/GoogleSignInButton";

export default () => {
    return (
        <div className="h-screen w-screen m-auto flex place-content-center bg-gradient-radial from-primary/5  to-accent-vivid/5">
            <div className="m-auto pb-32">
                <div className="bg-clip-text h-32 bg-gradient-to-r from-primary to-accent-vivid">
                    <h1 className="text-7xl text-center text-transparent font-bold tracking-wide">Songscope</h1>
                    <hr className="mt-5 mb-2 border-t-[.5px] border-text"></hr>
                    {/* <h4 className="text-3xl text-center text-text pb-5">Sign In With</h4> */}
                    <div className="flex flex-row place-content-center mx-auto">
                            <GoogleSignInButton />
                    </div>
                </div>
            </div>
        </div>
    );
};
