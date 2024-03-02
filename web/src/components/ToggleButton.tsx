import {useState} from "react";

export default function ToggleButton({
    onChange,
    apiRoute,
    checked
}: {
    onChange: (isChecked: boolean, value: string) => void;
    apiRoute: string;
    checked: boolean;
}) {
    const [isChecked, setIsChecked] = useState(checked);

    const handleClick = () => {
        const newChecked = !isChecked;
        setIsChecked(newChecked);
        onChange(newChecked, apiRoute);
    };

    return (
        <label className="relative inline-flex items-center mb-5 cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                onChange={handleClick}
                checked={isChecked}
            />
            <div className="w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-green-600"></div>
        </label>
    );
}
