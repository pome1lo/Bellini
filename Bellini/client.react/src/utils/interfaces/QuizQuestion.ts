export interface QuizQuestion {
    id: number;
    text: string;
    quizQuestionImageUrl: string;
    answerOptions: Answer[];
}

export interface Answer {
    id: number
    text: string;
    isCorrect: boolean;
}