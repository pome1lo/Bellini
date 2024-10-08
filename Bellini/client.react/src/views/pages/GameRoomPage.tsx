import {useNavigate, useParams} from "react-router-dom";
import {HubConnectionBuilder} from "@microsoft/signalr";
import {useAuth} from "@/utils/context/authContext.tsx";
import {useEffect, useState} from "react";
import * as signalR from "@microsoft/signalr";
import {toast} from "@/components/ui/use-toast.ts";
import {serverFetch} from "@/utils/fetch's/serverFetch.ts";
import {DialogShareButton} from "@/views/partials/DialogShareButton.tsx";

interface CurrentGame {
    id: number;
    gameName: string;
    hostId: number;
    startTime: Date;
    maxPlayers: number;
    isActive: boolean;
    difficultyLevel: string;
}

export const GameRoomPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {isAuthenticated, user} = useAuth();
    const [isCurrentUserHost, setIsCurrentUserHost] = useState(false);
    const [currentGame, setCurrentGame] = useState<CurrentGame>();
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !user || !id) {
            navigate('/login');
            return;
        }
        serverFetch(`/game/${id}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                console.log(user.id);
                setCurrentGame(data);
                setIsCurrentUserHost(user.id === data.hostId)
            })
            .catch(error => {
                console.error('Error fetching games:', error.message);
            });
    }, [id, isAuthenticated, user, navigate]);

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
                    toast({title: message});
                }
            });

            try {
                await newConnection.start();
                await newConnection.invoke("JoinGame",
                    id.toString(),
                    user.id.toString(),
                    user.username.toString());

                toast({title: "You have successfully joined the game!"});
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
                    toast({title: "You have left the game."});
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
        <>
            {isCurrentUserHost ?
                <>
                    HOST
                </>
                :
                <>
                    user
                </>
            }
            <DialogShareButton link={window.location.href}/>
            <div>Game Room {id}</div>
        </>
    );
};
