import React from "react";
import {FinishedGame} from "@/utils/interfaces/FinishedGame.ts";

interface GameFinishedPageProps {
    currentGame?: FinishedGame;
}

export const GameFinishedPage: React.FC<GameFinishedPageProps> = ({currentGame}) => {
  return (
      <>
          GameFinishedPage
      </>
  );
}