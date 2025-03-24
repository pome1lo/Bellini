import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";

export const NotFoundPage = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className="flex justify-center items-center h-screen flex-col container">
                <h1 className="font-black text-9xl text-roboto m-2 mt-3 animate-bounce">404</h1>
                <h3 className="text-3xl font-medium">Мы обыскали весь сайт</h3>
                <div className="w-full md:w-12/12">
                    <p className="m-2 mb-5 text-center">Похоже, что этой страницы не существует. Если вам все еще нужна помощь,
                        обратитесь в службу технической поддержки.</p>
                </div>
                <Button className="w-96" onClick={() => navigate('/')}>Вернитесь на главную страницу</Button>
            </div>
        </>
    )
}