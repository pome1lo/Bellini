import React, {useEffect, useState} from "react";
import {StartedQuiz} from "@/utils/interfaces/StartedQuiz.ts";
import {Button} from "@/components/ui/button.tsx";
import {Progress} from "@/components/ui/progress.tsx";
import {useAuth} from "@/utils/context/authContext.tsx";
import {toast} from "@/components/ui/use-toast.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {Quiz} from "@/utils/interfaces/Quiz.ts";
import {authFetch} from "@/utils/fetchs/authFetch.ts";

interface QuizStartedPageProps {
    currentQuiz?: StartedQuiz;
    onQuizFinish: (quiz: Quiz) => void;
}

export const QuizStartedPage: React.FC<QuizStartedPageProps> = ({currentQuiz, onQuizFinish}) => {
    const navigate = useNavigate();
    const {id} = useParams();
    const {user, getAccessToken, logout, isAuthenticated} = useAuth();

    const [countdown, setCountdown] = useState(3);
    const [showQuestion, setShowQuestion] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [userAnswers, setUserAnswers] = useState<{ questionId: number; answerId: number }[]>([]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setShowQuestion(true);
        }
    }, [countdown]);

    const handleAnswerSelect = (index: number) => {
        setSelectedAnswer(index);
        const updatedAnswers = [...userAnswers];
        updatedAnswers[currentQuestionIndex] = {
            questionId: currentQuiz!.questions[currentQuestionIndex].id,
            answerId: currentQuiz!.questions[currentQuestionIndex].answerOptions[index].id,
        };
        setUserAnswers(updatedAnswers);
    };

    const handleNextQuestion = () => {
        setSelectedAnswer(null);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const handleFinishQuiz = async () => {
        try {
            if (!isAuthenticated || !user) {
                navigate('/login');
                return;
            }
            console.log("ANSWERS")
            console.log(userAnswers)
            const response = await authFetch(`/quizzes/${id}/end`, getAccessToken, logout, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    userId: user.id,
                    userAnswers: userAnswers.map(answer => ({
                        questionId: answer.questionId,
                        answerId: answer.answerId,
                    })),
                }),
            });


            if (response.ok) {
                const responseData = await response.json();
                onQuizFinish(responseData.quiz);
            } else {
                const responseData: unknown = await response.json();
                toast({
                    title: "Error",
                    description: (responseData as Error).message || "An error occurred.",
                    variant: "destructive",
                });
            }
        } catch (error: unknown) {
            toast({
                title: "Error",
                description: "An unexpected error occurred." + (error as Error).message,
                variant: "destructive",
            });
        }
    };

    const progressValue = ((currentQuestionIndex + 1) / currentQuiz!.questions.length!) * 100;

    return (
        <div className="quiz-container">
            {!showQuestion ? (
                <div className={`countdown flex justify-center items-center h-[80vh]`}>
                    <h1 className="animate-pulse text-[35rem] text-roboto">{countdown}</h1>
                </div>
            ) : (
                <div className="question-section flex flex-col items-center justify-center h-[85vh] pb-20">
                    <div className="absolute flex flex-wrap justify-center items-center top-20 sm:w-1/2 w-[250px]">
                        <Progress value={progressValue} className="h-2 mb-5"/>
                        <Button
                            className="me-4"
                            onClick={currentQuestionIndex < currentQuiz!.questions.length - 1 ? handleNextQuestion : handleFinishQuiz}
                            disabled={selectedAnswer === null}
                        >
                            {currentQuestionIndex < currentQuiz!.questions.length - 1 ? "Next" : "Finish"}
                        </Button>
                        <Button disabled={true} variant="outline">
                            {currentQuestionIndex + 1} / {currentQuiz?.questions.length}
                        </Button>
                    </div>
                    <div className="flex flex-col items-center lg:max-w-1/2">
                        {currentQuiz?.questions[currentQuestionIndex].quizQuestionImageUrl &&
                            <img src={currentQuiz?.questions[currentQuestionIndex].quizQuestionImageUrl} className="max-w-[300px] mt-32" alt=""/>
                        }
                        <h1 className="text-xl w-full lg:w-2/3 mb-4 p-4 text-center font-bold">{currentQuiz?.questions[currentQuestionIndex].text}</h1>

                        <div className="flex items-center sm:w-full flex-wrap w-3/4">
                            {currentQuiz?.questions[currentQuestionIndex].answerOptions.map((option, index) => (
                                <Button
                                    className="m-2 sm:m-3 w-full text-md"
                                    variant={selectedAnswer !== null && selectedAnswer === index ? "default" : "outline"}
                                    key={index}
                                    onClick={() => handleAnswerSelect(index)}
                                    disabled={selectedAnswer !== null}
                                >
                                    {option.text}
                                </Button>
                            ))}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};
