import {Outlet} from "react-router-dom";
import {Header} from "@/views/partials/Header.tsx";
import {Footer} from "@/views/partials/Footer.tsx";

export const BasicLayout = () => {
    return (
        <>
            <Header/>
            <div className="">
                <Outlet/>

            </div>
            <Footer/>
        </>
    )
}