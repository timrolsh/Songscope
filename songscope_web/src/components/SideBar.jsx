import SidebarEntry from "./SidebarEntry";
import SignOutButton from "./SignOutButton";

const buttonStyles = "rounded-lg w-full border border-accent-neutral/30 hover:bg-accent-neutral/50 transition py-2 hover:-translate-y-0.5";
export default () => {
    
    return (
        <div className="flex flex-col w-1/5 bg-accent-vivid/10 border-r-2 border-accent-neutral/10 h-screen px-4">
            <h1 className="text-text text-4xl font-semibold text-center pt-4 pb-2">Dashboard</h1> 
            <hr className="border-t-2 border-accent-neutral/20 w-4/5 mx-auto py-2"></hr>
            <h3 className="text-text text-2xl font-normal pb-2">Recommendations</h3> 
            <div className="flex flex-col space-y-4">
                <SidebarEntry />
                <SidebarEntry />
                <SidebarEntry />
                <SidebarEntry />
                <SidebarEntry />
            </div>
            <hr className="border-t-2 border-accent-neutral/20 w-4/5 mx-auto mt-5 mb-4"></hr>
            {/* 
            <h3 className="flex flex-row pb-2">
                 <div className="bg-clip-text bg-gradient-to-t from-amber-800 via-red-400 to-red-600 flex flex-row my-auto">
                    <h1 className="text-3xl text-transparent tracking-wide pr-2 my-auto">HOT</h1> <span className="text-2xl my-auto">Reviews</span>
                </div> 
            </h3>
            */}
            <h3 className="text-text text-2xl font-normal pb-2">Hot Reviews</h3> 
            <div className="flex flex-col space-y-4">
                <SidebarEntry />
                <SidebarEntry />
                <SidebarEntry />
                <SidebarEntry />
                <SidebarEntry />
            </div>
            <div className="w-full mt-auto h-52 flex flex-col space-y-2 mb-4">
                <hr className="border-t-2 border-accent-neutral/20 w-4/5 mx-auto"></hr>
                <div className="my-auto flex flex-col h-full place-content-evenly">
                    <button className={buttonStyles}>User Settings</button>
                    <button className={buttonStyles}>Feedback</button>
                    <button className={buttonStyles}>Support</button>
                    <SignOutButton />
                </div>
            </div>
        </div>
    );
};
