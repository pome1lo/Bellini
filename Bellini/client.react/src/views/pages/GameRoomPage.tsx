import { useNavigate, useParams } from "react-router-dom";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useAuth } from "@/utils/context/authContext.tsx";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { toast } from "@/components/ui/use-toast.ts";

export const GameRoomPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !user || !id) {
            navigate('/login');
            return;
        }

        if (connection) {
            return;
        }

        const connectToRoom = async () => {
            const newConnection = new HubConnectionBuilder()
                .withUrl("https://localhost:7292/gameHub", {
                    transport: signalR.HttpTransportType.ServerSentEvents,
                    withCredentials: true
                })
                .withAutomaticReconnect()
                .build();

            newConnection.on("ReceiveMessage", (message: string) => {
                if (!message.includes(user.username)) {
                    toast({ title: message });
                }
            });

            try {
                await newConnection.start();
                await newConnection.invoke("JoinGame",
                    id.toString(),
                    user.id.toString(),
                    user.username.toString());

                toast({ title: "You have successfully joined the game!" });
                setConnection(newConnection);
            } catch (error) {
                console.error('Connection failed:', error);
            }
        };

        connectToRoom();

        const leaveGame = async () => {
            if (connection) {
                try {
                    await connection.invoke("LeaveGame", id.toString());
                    await connection.stop();
                    toast({ title: "You have left the game." });
                } catch (error) {
                    console.error('Error while leaving the game:', error);
                }
            }
        };

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = ''; // Попросит подтверждение при покидании страницы
        };

        const handleRouteLeave = (event: Event) => {
            if (window.confirm("Вы действительно хотите покинуть страницу?")) {
                leaveGame();
            } else {
                event.preventDefault();
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("popstate", handleRouteLeave);

        return () => {
            leaveGame();
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handleRouteLeave);
        };
    }, [id, isAuthenticated, user, connection, navigate]);

    return (
        <div>Game Room {id}</div>
    );
};
