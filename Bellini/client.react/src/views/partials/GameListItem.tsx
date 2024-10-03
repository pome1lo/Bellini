import {JoinGameButton} from "@/views/partials/JoinGameButton.tsx";

interface GameListItemProps {
    id: number;
    gameName: string;
    startTime: Date;
}

export const GameListItem: React.FC<GameListItemProps> = ({ id, gameName, startTime }) => {
    return (
        <>
            <div key={id} className={"mb-10 flex"}>
                <p>Game name: {gameName || 'NO NAME'}</p>
                <p>Start time: {new Date(startTime).toLocaleString()}</p>
                <JoinGameButton gameId={id}/>
            </div>
        </>
    )
}