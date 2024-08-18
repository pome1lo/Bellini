import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";

export const NotFoundPage = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className="flex justify-center items-center h-screen flex-col">
                <h1 className="font-black text-9xl text-roboto m-2 mt-3 animate-bounce">404</h1>
                <h3 className="text-3xl font-medium">We searched the entire site</h3>
                <p className="m-2 mb-5 text-center">It looks like this page doesn't exist. If you still need help,
                    contact<br/> technical support.</p>
                <Button className="w-96" onClick={() => navigate('/')}>Return to the main page</Button>
            </div>
        </>
    )
}