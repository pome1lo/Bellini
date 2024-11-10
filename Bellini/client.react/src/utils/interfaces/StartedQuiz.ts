import {QuizQuestion} from "@/utils/interfaces/QuizQuestion.ts";

export interface StartedQuiz {
    gameCoverImageUrl: string;
    gameName: string;
    questions: QuizQuestion[];
    // Вся инфа о квизе + вопросы
}