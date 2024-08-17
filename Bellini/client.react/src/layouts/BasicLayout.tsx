import {Outlet} from "react-router-dom";
import {Header} from "@/views/partials/Header.tsx";

export const BasicLayout = () => {
    return (
        <>
            <Header/>
            <div className="container">
                <Outlet/>

            </div>
        </>
    )
}