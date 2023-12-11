export default () => {
    
    return (
        // TODO --> on hover, make it so that you cannot highlight/select text?
        <div className="flex flex-row place-content-before hover:bg-accent-neutral/20 transition px-2.5 py-1.5 rounded-md"> 
            <div className="w-5 h-5 bg-primary my-auto"></div>
            <h3 className="pl-4 my-auto text-lg font-normal"> Pain 1993 - <span className="italic">Drake</span></h3>
        </div>
    );
};
