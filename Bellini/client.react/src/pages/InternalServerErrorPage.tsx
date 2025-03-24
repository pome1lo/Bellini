import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";

export const InternalServerErrorPage = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className="flex justify-center items-center h-screen flex-col container">
                <h1 className="font-black text-9xl text-roboto m-2 mt-3 animate-bounce">500</h1>
                <h3 className="font-medium sm:text-3xl text-2xl text-center">Приносим извинения за временные неудобства</h3>
                <div className="w-full md:w-1/2">
                    <p className="m-2 mb-5 text-center">Попробуйте обновить страницу через некоторое время или вернитесь на
                        главную страницу. Приносим извинения за временные неудобства</p>
                </div>
                <Button className="sm:w-96 w-72" onClick={() => navigate('/')}>Вернитесь на главную страницу</Button>
            </div>
        </>
    )
}