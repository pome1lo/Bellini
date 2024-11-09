import React from "react";
import {StartedQuiz} from "@/utils/interfaces/StartedQuiz.ts";
import {FinishedQuiz} from "@/utils/interfaces/FinishedQuiz.ts";

interface QuizStartedPageProps {
    currentQuiz?: StartedQuiz;
    onQuizFinish: (quiz: FinishedQuiz) => void;
}

export const QuizStartedPage: React.FC<QuizStartedPageProps> = ({currentQuiz, onQuizFinish}) => {
    return (
        <>

            QuizStartedPage
        </>
    )
}