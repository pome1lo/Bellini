import React from "react";
import {StartedGameDto} from "@/utils/interfaces/StartedGame.ts";

interface GameStartedPageProps {
    currentGame?: StartedGameDto;
}

export const GameStartedPage: React.FC<GameStartedPageProps> = ({currentGame}) => {
    return (
        <>
            {currentGame ?
                <> 
                </>
                :
                <></>
            }
        </>
    )
}