import React, { useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { Button } from "@/components/ui/button.tsx";
import { toast } from "@/components/ui/use-toast";
import {useNavigate} from "react-router-dom";

interface JoinGameButtonProps {
    gameId: number; // ID игры, к которой нужно подключиться
}

export const JoinGameButton: React.FC<JoinGameButtonProps> = ({ gameId }) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [currentUserId] = useState(sessionStorage.getItem('__user-id'));
    const [isConnected, setIsConnected] = useState(false);
    const navigate = useNavigate();

    const connectToGame = async () => {
        try {
            alert(currentUserId)
            if(currentUserId) {
               alert("s")
               navigate('/login');
            } else {
                // Создаем новое подключение к хабу
                const newConnection = new signalR.HubConnectionBuilder()
                    .withUrl("https://localhost:7292/gameHub", { withCredentials: true })
                    .configureLogging(signalR.LogLevel.Information) // Настройка логирования
                    .withAutomaticReconnect()
                    .build();

                // Устанавливаем события подключения и отключения
                newConnection.onclose(() => {
                    setIsConnected(false);
                    toast({ title: "Disconnected from the game." });
                });

                // Подключаемся к хабу
                await newConnection.start()
                    .then(() => console.log("Connected to SignalR hub"))
                    .catch(err => console.error("Connection error: ", err));
                setConnection(newConnection);
                setIsConnected(true);
                toast({ title: "Connected to the game!" });

                // Отправляем сообщение о присоединении к игре
                await newConnection.invoke("JoinGame", gameId.toString());

                toast({ title: "You have successfully joined the game!" });
            }
        } catch (error) {
            console.error('Connection failed: ', error);
            toast({ title: "Connection failed!", description: "Please try again.", variant: "destructive" });
        }
    };

    return (
        <Button onClick={connectToGame} disabled={isConnected}>
            {isConnected ? 'Connected' : 'Join Game'}
        </Button>
    );
};
