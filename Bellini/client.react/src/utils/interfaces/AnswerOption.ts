import {Question} from "@/utils/interfaces/Question.ts";

export interface AnswerOption {
    id: number;
    text: string;
    isCorrect: boolean;
    questionId: number;
    question: Question;
}