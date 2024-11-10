import React, { useEffect, useState } from "react";
import { StartedQuiz } from "@/utils/interfaces/StartedQuiz.ts";
import { FinishedQuiz } from "@/utils/interfaces/FinishedQuiz.ts";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/utils/context/authContext.tsx";
import { serverFetch } from "@/utils/fetchs/serverFetch.ts";
import { toast } from "@/components/ui/use-toast.ts";
import { useNavigate, useParams } from "react-router-dom";
import {Quiz} from "@/utils/interfaces/Quiz.ts";

interface QuizStartedPageProps {
    currentQuiz?: StartedQuiz;
    onQuizFinish: (quiz: Quiz) => void;
}

export const QuizStartedPage: React.FC<QuizStartedPageProps> = ({ currentQuiz, onQuizFinish }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { isAuthenticated, user } = useAuth();

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
        if (selectedAnswer === null) {
            setSelectedAnswer(index);
            const updatedAnswers = [...userAnswers];
            updatedAnswers[currentQuestionIndex] = {
                questionId: currentQuiz!.questions[currentQuestionIndex].id,
                answerId: currentQuiz!.questions[currentQuestionIndex].answerOptions[index].id,
            };
            setUserAnswers(updatedAnswers);
        }
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
            const response = await serverFetch(`/quizzes/${id}/end`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    userAnswers: userAnswers.map(answer => ({
                        questionId: answer.questionId,
                        answerId: answer.answerId,
                    })),
                }),
            });
            const responseData: Quiz = await response.json();

            if (response.ok) {
                onQuizFinish(responseData);
            } else {
                toast({
                    title: "Error",
                    description: responseData.Message || "An error occurred.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred.",
                variant: "destructive",
            });
        }
    };

    const progressValue = ((currentQuestionIndex + 1) / currentQuiz?.questions.length!) * 100;

    return (
        <div className="quiz-container">
            {!showQuestion ? (
                <div className="countdown">{countdown}</div>
            ) : (
                <div className="question-section">
                    <Progress value={progressValue} />
                    <Card>
                        <CardHeader>
                            <CardTitle>{currentQuiz?.questions[currentQuestionIndex].text}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {currentQuiz?.questions[currentQuestionIndex].answerOptions.map((option, index) => (
                                <Button
                                    key={index}
                                    onClick={() => handleAnswerSelect(index)}
                                    disabled={selectedAnswer !== null}
                                >
                                    {option.text}
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                    <Button onClick={currentQuestionIndex < currentQuiz!.questions.length - 1 ? handleNextQuestion : handleFinishQuiz}>
                        {currentQuestionIndex < currentQuiz!.questions.length - 1 ? "Next" : "Finish"}
                    </Button>
                </div>
            )}
        </div>
    );
};
