import {Outlet} from "react-router-dom";
import {Header} from "@/components/header.tsx";
import {Footer} from "@/components/footer.tsx";
import {Toaster} from "sonner";

export const GameLayout = () => {
    return (
        <>
            <Header/>
            <div>
                <Toaster position="top-center" expand={false} richColors />
                <Outlet/>
            </div>
            <Footer/>
        </>
    )
}