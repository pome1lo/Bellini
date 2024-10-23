import React from "react";
import {useParams} from "react-router-dom";

export const QuizRoomPage = () => {
    const {id} = useParams();

    return (
        <>
            {id}
        </>
    );
}