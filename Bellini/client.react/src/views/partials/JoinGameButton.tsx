import React, { useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { Button } from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";
import {ToastAction} from "@/components/ui/toast.tsx";
import {useToast} from "@/components/ui/use-toast.ts";
import {useAuth} from "@/utils/context/authContext.tsx";

interface JoinGameButtonProps {
    gameId: number; // ID игры, к которой нужно подключиться
}

export const JoinGameButton: React.FC<JoinGameButtonProps> = ({ gameId }) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast()

    const connectToGame = async () => {
        try {
            if (!isAuthenticated || !user) {
               navigate('/login');
            } else {
                navigate(`/games/rooms/${gameId}`);
                // const newConnection = new signalR.HubConnectionBuilder()
                //     .withUrl("https://localhost:7292/gameHub", {
                //         transport: signalR.HttpTransportType.ServerSentEvents,
                //         withCredentials: true
                //     })
                //     .configureLogging(signalR.LogLevel.Information)
                //     .withAutomaticReconnect()
                //     .build();
                //
                // newConnection.onclose(() => {
                //     setIsConnected(false);
                //     toast({ title: "Disconnected from the game." });
                // });
                //
                // newConnection.on("ReceiveMessage", (message) => {
                //     console.log("Message received: ", message);
                //     toast({
                //         title: "Scheduled: Catch up ",
                //         description: message,
                //         action: (
                //             <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
                //         ),
                //     })
                // });
                //
                // await newConnection.start()
                //     .then(() => console.log("Connected to SignalR hub"))
                //     .catch(err => console.error("Connection error: ", err));
                // setConnection(newConnection);
                // setIsConnected(true);
                // toast({ title: "Connected to the game!" });
                //
                // await newConnection.invoke("JoinGame",
                //     gameId.toString(),
                //     user.id.toString(),
                //     user.username.toString());
                //
                // toast({ title: "You have successfully joined the game!" });
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
