import {Outlet} from "react-router-dom";
import {Header} from "@/components/header.tsx";
import {Footer} from "@/components/footer.tsx";
import {Toaster} from "sonner";

export const BasicLayout = () => {
    return (
        <>
            <Header/>
            <div className="bg-muted/40 p-4">
                <Toaster position="top-center" expand={false} richColors />
                <Outlet/>
            </div>
            <Footer/>
        </>
    )
}