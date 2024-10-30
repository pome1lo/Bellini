import { Game } from "./Game";
import { Player } from "./Player";
import {Question} from "@/utils/interfaces/Question.ts";
import {AnswerOption} from "@/utils/interfaces/AnswerOption.ts";

export interface CompletedAnswer {
    id: number;
    gameId: number;
    playerId: number;
    questionId: number;
    selectedOptionId: number;
    isCorrect: boolean;
    game: Game;
    player: Player;
    question: Question;
    selectedOption: AnswerOption;
}