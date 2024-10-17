import {Game} from "@/utils/interfaces/Game.ts";
import {AnswerOption} from "@/utils/interfaces/AnswerOption.ts";

export interface Question {
    id: number;
    text: string;
    gameId: number;
    game: Game;
    isCustom: boolean;
    answerOptions: AnswerOption[];
}
