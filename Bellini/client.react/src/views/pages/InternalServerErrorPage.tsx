import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";

export const InternalServerErrorPage = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className="flex justify-center items-center h-screen flex-col">
                <h1 className="font-black text-9xl text-roboto m-2 mt-3 animate-bounce">500</h1>
                <h3 className="text-3xl font-medium">Sorry for the temporary inconvenience</h3>
                <p className="m-2 mb-5 text-center">Try refreshing the page after a while or returning to the
                    main <br></br> page. Sorry for the temporary inconvenience</p>
                <Button className="w-96" onClick={() => navigate('/')}>Return to the main page</Button>
            </div>
        </>
    )
}