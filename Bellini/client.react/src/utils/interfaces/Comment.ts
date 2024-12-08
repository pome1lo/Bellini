export interface Comment {
    id: number;
    gameId: number;
    userId: number;
    content: string;
    commentDate: Date;
    username: string;
    profileImageUrl: string;
}