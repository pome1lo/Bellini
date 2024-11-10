export interface QuizQuestion {
    id: number;
    text: string;
    answerOptions: QuizAnswerOption[];
}

export interface QuizAnswerOption {
    id: number;
    text: string;
}