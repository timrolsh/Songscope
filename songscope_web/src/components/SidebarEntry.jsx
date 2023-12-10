export default () => {
    
    return (
        // TODO --> on hover, make it so that you cannot highlight/select text?
        <div className="flex flex-row place-content-before hover:bg-accent-neutral/20 transition px-2.5 py-1.5 rounded-md"> 
            <div className="w-8 h-8 bg-primary"></div>
            <h3 className="pl-4 my-auto text-xl font-normal"> Pain 1993 - <span className="italic">Drake</span></h3>
        </div>
    );
};
