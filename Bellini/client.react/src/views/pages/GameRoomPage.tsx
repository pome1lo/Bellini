import {useNavigate, useParams} from "react-router-dom";
import {HubConnectionBuilder} from "@microsoft/signalr";
import {useAuth} from "@/utils/context/authContext.tsx";
import {useEffect} from "react";
import * as signalR from "@microsoft/signalr";
import {toast} from "@/components/ui/use-toast.ts";

export const GameRoomPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        if (!isAuthenticated || !user || !id) {
            navigate('/login');
        } else {
            const connectToRoom = async () => {
                const connection = new HubConnectionBuilder()
                    .withUrl("https://localhost:7292/gameHub", {
                        transport: signalR.HttpTransportType.ServerSentEvents,
                        withCredentials: true
                    })
                    .withAutomaticReconnect()
                    .build();

                try {
                    await connection.start();
                    await connection.invoke("JoinGame",
                        id.toString(),
                        user.id.toString(),
                        user.username.toString());

                    toast({ title: "You have successfully joined the game!" });
                } catch (error) {
                    console.error('Connection failed:', error);
                }
            };

            connectToRoom();
        }
    }, [id, isAuthenticated]);

    return (
        <div>Game Room {id}</div>
    );
};