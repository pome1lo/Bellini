import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "@/utils/context/authContext.tsx";
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";
import {Quiz, QuizResult} from "@/utils/interfaces/Quiz.ts";
import {toast} from "@/components/ui/use-toast.tsx";
import {StartedQuiz} from "@/utils/interfaces/StartedQuiz.ts";
import {Button} from "@/components/ui/button.tsx";
import {Breadcrumbs} from "@/components/breadcrumbs.tsx";
import {authFetch} from "@/utils/fetchs/authFetch.ts";

interface QuizRoomPageProps {
    onQuizStart: (game: StartedQuiz) => void;
    isQuizFinished: (isFinished: boolean) => void;
    onQuizFinish: (game: Quiz) => void;
}

export const QuizRoomPage: React.FC<QuizRoomPageProps> = ({onQuizStart, isQuizFinished, onQuizFinish}) => {
    const {id} = useParams();
    const [currentQuiz, setCurrentQUiz] = useState<Quiz>();
    const navigate = useNavigate();
    const {isAuthenticated, user, logout, getAccessToken} = useAuth();

    useEffect(() => {
        if (!isAuthenticated || !user || !id) {
            navigate('/login');
            return; 
        }
        serverFetch(`/quizzes/${id}`)
            .then(response => response.json())
            .then(data => {
                setCurrentQUiz(data);
                if ((data.quizResults as QuizResult[]).some(result => result.userId.toString() == user.id && !result.isReplay)) {
                    isQuizFinished(true);
                    onQuizFinish(data);
                }
            })
            .catch(error => {
                console.error('Error fetching game:', error.message);
            });
    }, [id, isAuthenticated, user, navigate]);


    async function startQuiz() {
        try {
            if (!isAuthenticated || !user) {
                navigate('/login');
                return;
            }
            const response = await authFetch(`/quizzes/${id}/start`, getAccessToken, logout, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    userId: user.id,
                }),
            });

            if (response.ok) {
                const responseData: StartedQuiz = await response.json();
                onQuizStart(responseData);
            } else {
                const responseData: unknown = await response.json();
                toast({
                    title: "Ошибка",
                    description: (responseData as Error).message || "Произошла непредвиденная ошибка.",
                    variant: "destructive"
                });
            }

        } catch (error : unknown) {
            console.error('Error while disconnecting:', error);
            toast({
                title: "Ошибка",
                description: (error as Error).message || "Произошла непредвиденная ошибка.",
                variant: "destructive"
            });
        }
    }


    return (
        <div className="p-4">
            <Breadcrumbs items={[
                {path: '/', name: 'Главная'},
                {path: '/quizzes', name: 'Викторины'},
                {path: `/quizzes/${currentQuiz?.id}`, name: currentQuiz?.gameName ?? "неизвестно"},
            ]}/>
            <div className="mt-4 flex flex-col justify-center items-center h-[78vh]">
                <h1 className="text-4xl text-center font-bold">{currentQuiz?.gameName}</h1>
                <p className="mt-3 mb-3">Количество вопросов {currentQuiz?.questions.length}</p>

                <Button className="h-8 ms-3 gap-1" onClick={startQuiz}>
                    Начать игру
                </Button>
            </div>
        </div>
    );
}