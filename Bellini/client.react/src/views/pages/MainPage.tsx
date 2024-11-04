import {Trash2} from "lucide-react";

export const MainPage = () => {
    return (
        <>
            <h1 className="text-3xl text-center mb-16 mt-16">Main page
                <Trash2 className="w-full h-[300px] hover:bg-red-700 transition-colors duration-1000 animate-bounce"/>
            </h1>
        </>
    );
}