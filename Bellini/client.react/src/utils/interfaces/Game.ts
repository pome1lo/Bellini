import {Question} from "@/utils/interfaces/Question.ts";
import {Player} from "@/utils/interfaces/Player.ts";

export interface Game {
    id: number;
    gameName: string;
    hostId: number;
    createTime: Date;
    startTime: Date;
    maxPlayers: number;
    isPrivate: boolean;
    gameCoverImageUrl: string;
    players: Player[];
    questions: Question[];
    gameStatus: {
        name: string;
    };
    status: {
        name: string;
    };
}