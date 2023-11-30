import GoogleSignInButton from "@/components/GoogleSignInButton";

export default () => {
    return (
        <>
            <div className="bg-clip-text flex palce-content-center w-full h-64 bg-gradient-to-r from-red-600 via-red-400 to-amber-300">
                <h1 className="text-8xl text-center m-auto text-transparent font-semibold">Songscope</h1>
            </div>
            <GoogleSignInButton />
        </>
    );
}