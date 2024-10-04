import React, { useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { Button } from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";
import {ToastAction} from "@/components/ui/toast.tsx";
import {useToast} from "@/components/ui/use-toast.ts";

interface JoinGameButtonProps {
    gameId: number; // ID игры, к которой нужно подключиться
}

export const JoinGameButton: React.FC<JoinGameButtonProps> = ({ gameId }) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [currentUserId] = useState(sessionStorage.getItem('__user-id'));
    const [currentUsername] = useState(sessionStorage.getItem('__username'));
    const [isConnected, setIsConnected] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast()

    const connectToGame = async () => {
        try {
            if(!currentUserId || !currentUsername) {
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

                newConnection.on("ReceiveMessage", (message) => {
                    console.log("Message received: ", message);
                    toast({
                        title: "Scheduled: Catch up ",
                        description: message,
                        action: (
                            <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
                        ),
                    })
                });

                // Подключаемся к хабу
                await newConnection.start()
                    .then(() => console.log("Connected to SignalR hub"))
                    .catch(err => console.error("Connection error: ", err));
                setConnection(newConnection);
                setIsConnected(true);
                toast({ title: "Connected to the game!" });

                // Отправляем сообщение о присоединении к игре
                await newConnection.invoke("JoinGame",
                    gameId.toString(),
                    currentUserId.toString(),
                    currentUsername.toString()
                );

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
