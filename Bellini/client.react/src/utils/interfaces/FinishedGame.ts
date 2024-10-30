import {Player} from "@/utils/interfaces/Player.ts";
import {Question} from "@/utils/interfaces/Question.ts";
import {GameStatus} from "@/utils/interfaces/GameStatus.ts";
import {CompletedAnswer} from "@/utils/interfaces/CompletedAnswer.ts";

export interface FinishedGame {
    id: number;
    gameName: string;
    hostId: number;
    createTime: Date;
    startTime: Date;
    endTime: Date;
    maxPlayers: number;
    gameCoverImageUrl: string;
    isPrivate: boolean;
    roomPassword: string;
    gameStatusId: number;
    players: Player[];
    questions: Question[];
    completedAnswers: CompletedAnswer[];
    status: GameStatus;
}