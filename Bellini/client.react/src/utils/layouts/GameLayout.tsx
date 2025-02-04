import {Outlet} from "react-router-dom";
import {Header} from "@/components/header.tsx";
import {Footer} from "@/components/footer.tsx";

export const GameLayout = () => {
    return (
        <>
            <Header/>
            <div>
                <Outlet/>

            </div>
            <Footer/>
        </>
    )
}