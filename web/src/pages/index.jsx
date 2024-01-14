import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/router';

export default () => {
    const session = useSession();
    const router = useRouter();

    console.log("sess:", session);

    if(session && session.status === "authenticated") {
        console.log("user is authenticated... redirecting")
        // redirect when auth'ed
        router.replace("/user");        
        return null;
    }

    return (
        <div className="h-screen w-screen m-auto flex place-content-center bg-gradient-radial from-primary/5  to-accent-vivid/5">
            <div className="m-auto pb-32">
                <div className="bg-clip-text h-32 bg-gradient-to-r from-primary to-accent-vivid">
                    <h1 className="text-7xl text-center text-transparent font-bold tracking-wide">
                        Songscope
                    </h1>
                    <h3 className="text-2xl text-center font-extralight tracking-wide text-gray-300 pt-3 pb-1">
                        Music Review Made Easy
                    </h3>
                    <hr className="my-4 border-t-[.5px] border-text"></hr>
                    {/* <h4 className="text-3xl text-center text-text pb-5">Sign In With</h4> */}
                    <div className="flex flex-row place-content-center mx-auto">
                        <button onClick={signIn}>Sign In</button>
                    </div>
                </div>
            </div>
        </div>
    )
};