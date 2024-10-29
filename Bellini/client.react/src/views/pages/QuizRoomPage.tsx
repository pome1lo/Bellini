import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "@/utils/context/authContext.tsx";
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";
import {Quiz} from "@/utils/interfaces/Quiz.ts";

export const QuizRoomPage = () => {
    const {id} = useParams();
    const [currentQUiz, setCurrentQUiz] = useState<Quiz>();
    const navigate = useNavigate();
    const {isAuthenticated, user} = useAuth();

    useEffect(() => {
        if (!isAuthenticated || !user || !id) {
            navigate('/login');
            return;
        }

        serverFetch(`/quizzes/${id}`)
            .then(response => response.json())
            .then(data => {
                setCurrentQUiz(data);
                console.log(data);
            })
            .catch(error => {
                console.error('Error fetching game:', error.message);
            });
    }, [id, isAuthenticated, user, navigate]);

    return (
        <>
            {id}
            {currentQUiz?.gameName}
        </>
    );
}