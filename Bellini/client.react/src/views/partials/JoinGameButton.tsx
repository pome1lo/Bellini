import React, { useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { Button } from "@/components/ui/button.tsx";
import { toast } from "@/components/ui/use-toast";

interface JoinGameButtonProps {
    gameId: number; // ID игры, к которой нужно подключиться
}

export const JoinGameButton: React.FC<JoinGameButtonProps> = ({ gameId }) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const connectToGame = async () => {
        try {
            // Создаем новое подключение к хабу
            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl("/gameHub") // URL хаба
                .configureLogging(signalR.LogLevel.Information) // Настройка логирования
                .build();

            // Устанавливаем события подключения и отключения
            newConnection.onclose(() => {
                setIsConnected(false);
                toast({ title: "Disconnected from the game." });
            });

            // Подключаемся к хабу
            await newConnection.start();
            setConnection(newConnection);
            setIsConnected(true);
            toast({ title: "Connected to the game!" });

            // Отправляем сообщение о присоединении к игре
            await newConnection.invoke("JoinGame", gameId);
            toast({ title: "You have successfully joined the game!" });
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
