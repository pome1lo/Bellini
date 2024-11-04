export interface ActiveGame {
    id: number;
    gameName: string;
    hostId: number;
    startTime: Date;
    maxPlayers: number;
    gameCoverImageUrl: string;
    isPrivate: boolean;
    status: string;
}