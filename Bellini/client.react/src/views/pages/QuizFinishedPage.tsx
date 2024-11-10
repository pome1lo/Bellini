import React from "react";
import { FinishedQuiz } from "@/utils/interfaces/FinishedQuiz";
import {Quiz} from "@/utils/interfaces/Quiz.ts";

interface QuizFinishedPageProps {
    currentQuiz: Quiz;
}

export const QuizFinishedPage: React.FC<QuizFinishedPageProps> = ({currentQuiz}) => {
    console.log(currentQuiz)
    return (
        <>
            QuizFinishedPage
        </>
    )
}