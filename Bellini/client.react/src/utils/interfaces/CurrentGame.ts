export interface CurrentGame {
    id: number;
    gameName: string;
    hostId: number;
    startTime: Date;
    createTime: Date;
    gameCoverImageUrl: string;
    maxPlayers: number;
    isPrivate: boolean;
    roomPassword: string;
    gameStatus: {
        id: number;
        name: string;
    };
    questions: Array<{
        id: number;
        text: string;
        questionImageUrl: string;
        isCustom: boolean;
        answerOptions: Array<{
            id: number;
            text: string;
            isCorrect: boolean;
        }>;
    }>;
}