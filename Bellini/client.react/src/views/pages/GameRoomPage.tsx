import {useParams} from "react-router-dom";
import {HubConnectionBuilder} from "@microsoft/signalr";
import {useAuth} from "@/utils/context/authContext.tsx";
import {useEffect} from "react";

export const GameRoomPage = () => {
    const { id } = useParams();
    const { isAuthenticated } = useAuth(); // Предполагается, что есть хук, который проверяет авторизацию

    useEffect(() => {
        if (isAuthenticated) {
            const connectToRoom = async () => {
                const connection = new HubConnectionBuilder()
                    .withUrl(`https://localhost:7292/gameHub`)
                    .withAutomaticReconnect()
                    .build();

                try {
                    await connection.start();
                    console.log('Connected to room:', id);
                    await connection.invoke('JoinRoom', id); // Предполагается метод подключения к комнате
                } catch (error) {
                    console.error('Connection failed:', error);
                }
            };

            connectToRoom();
        } else {
            // Редирект на страницу авторизации, если не авторизован
            // Например, history.push('/login');
        }
    }, [id, isAuthenticated]);

    return (
        <div>Game Room {id}</div>
    );
};