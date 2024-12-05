import {QuizQuestion} from "@/utils/interfaces/QuizQuestion.ts";

export interface Quiz {
    id: number;
    gameName: string;
    gameCoverImageUrl: string;
    questions: QuizQuestion[];
    hasUserCompleted: boolean;
}