import {Question} from "@/utils/interfaces/Question.ts";
import {Player} from "@/utils/interfaces/Player.ts";

export interface StartedGame {
    id: number;
    gameName: string;
    hostId: number;
    createTime: Date;
    startTime: Date;
    maxPlayers: number;
    gameCoverImageUrl: string;
    players: Player[];
    questions: Question[];
    ErrorCode: string;
    Message: string;
}





