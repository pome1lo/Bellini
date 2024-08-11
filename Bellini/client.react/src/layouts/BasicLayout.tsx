import {Outlet} from "react-router-dom";
import {Header} from "../views/components/Header.tsx";

export const BasicLayout = () => {
    return (
        <>
            <Header/>
            <Outlet/>
        </>
    )
}