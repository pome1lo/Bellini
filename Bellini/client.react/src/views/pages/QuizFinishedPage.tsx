import React from "react";
import { FinishedQuiz } from "@/utils/interfaces/FinishedQuiz";

interface QuizFinishedPageProps {
    currentQuiz: FinishedQuiz;
}

export const QuizFinishedPage: React.FC<QuizFinishedPageProps> = ({currentQuiz}) => {
    return (
        <>
            QuizFinishedPage
        </>
    )
}