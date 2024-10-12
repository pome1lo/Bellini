import {useNavigate, useParams} from "react-router-dom";
import {HubConnectionBuilder} from "@microsoft/signalr";
import {useAuth} from "@/utils/context/authContext.tsx";
import {useEffect, useState} from "react";
import * as signalR from "@microsoft/signalr";
import {toast} from "@/components/ui/use-toast.ts";
import {DialogShareButton} from "@/views/partials/DialogShareButton.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Button} from "@/components/ui/button.tsx";
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";
import {Breadcrumbs} from "@/views/partials/Breadcrumbs.tsx";

interface CurrentGame {
    id: number;
    gameName: string;
    hostId: number;
    startTime: Date;
    maxPlayers: number;
    isActive: boolean;
    difficultyLevel: string;
}

interface Player {
    userId: string;
    username: string;
    email: string;
    profileImageUrl: string;
}

export const GameRoomPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {isAuthenticated, user} = useAuth();
    const [isCurrentUserHost, setIsCurrentUserHost] = useState(false);
    const [currentGame, setCurrentGame] = useState<CurrentGame>();
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [isUserJoined, setIsUserJoined] = useState(false);

    const breadcrumbItems = [
        {path: '/', name: 'Home'},
        {path: '/games', name: 'Games'},
        {path: `/games/room/${id}`, name: currentGame?.gameName},
    ];

    useEffect(() => {
        if (!isAuthenticated || !user || !id) {
            navigate('/login');
            return;
        }

        serverFetch(`/game/${id}`)
            .then(response => response.json())
            .then(data => {
                setCurrentGame(data);
                setIsCurrentUserHost(user.id === data.hostId);
            })
            .catch(error => {
                console.error('Error fetching game:', error.message);
            });
    }, [id, isAuthenticated, user, navigate]);

    useEffect(() => {
        if (!isAuthenticated || !user || !id) {
            navigate('/login');
            return;
        }

        const newConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:7292/gameHub", {
                transport: signalR.HttpTransportType.ServerSentEvents,
                withCredentials: true
            })
            .withAutomaticReconnect()
            .build();

        newConnection.on('PlayerJoined', (updatedPlayerList: Player[]) => {
            setPlayers(updatedPlayerList);
            console.log('A player has joined the game');
        });3

        newConnection.on('PlayerLeft', (updatedPlayerList: Player[]) => {
            setPlayers(updatedPlayerList);
            console.log('A player has left the game');
        });

        newConnection.start()
            .then(() => {
                console.log('Connected to SignalR');
                newConnection.invoke("GetPlayers", id.toString())
                    .then((playerList: Player[]) => {
                        setPlayers(playerList);
                    });
            })
            .catch(error => console.error('Connection failed: ', error));

        setConnection(newConnection);

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = "Are you sure you want to leave the game?";
            return "Are you sure you want to leave the game?";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            if (connection) {
                disconnect();
                connection.stop();
            }
        };
    }, [id, isAuthenticated, user, navigate]);


    useEffect(() => {
        return () => {
            if (connection) {
                disconnect();
            }
        };
    }, [connection]);

    async function connect() {
        if (!connection || isUserJoined) return;

        try {
            await connection.invoke("JoinGame", {
                GameId: id.toString(),
                UserId: user.id.toString(),
                Username: user.username,
                Email: user.email,
                ProfileImageUrl: user.profileImageUrl
            });

            setIsUserJoined(true);
            toast({title: "You have successfully joined the game!"});
        } catch (error) {
            console.error('Error joining game:', error);
        }
    }

    async function disconnect() {
        if (connection) {
            try {
                if (connection.state === signalR.HubConnectionState.Connected) {
                    await connection.invoke("LeaveGame", id.toString(), user.id.toString());
                    toast({title: "You have left the game."});
                }
            } catch (error) {
                console.error('Error while disconnecting:', error);
            } finally {
                await connection.stop();
                setPlayers([]);
                navigate('/games');
            }
        }
    }

    return (
        <>
            {
                currentGame
                ?
                     <>
                        <Breadcrumbs items={breadcrumbItems}/>

                        <DialogShareButton link={window.location.href}/>
                        <div>Game Room {id}</div>
                        {isCurrentUserHost ? <span>HOST</span> : <span>USER</span>}


                        {!isUserJoined ? (
                            <Button onClick={connect}>Connect</Button>
                        ) :
                            <Button variant="destructive" onClick={disconnect}>Disconnect</Button>
                        }

                        <Card x-chunk="dashboard-01-chunk-5">
                            <CardHeader>
                                <CardTitle>Connected Users</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-8">
                                {players.map((player) => (
                                    <div key={player.userId} className="flex items-center gap-4">
                                        <Avatar className="hidden h-9 w-9 sm:flex">
                                            <AvatarImage
                                                src={player.profileImageUrl}
                                                alt={`${player.username}'s profile`}
                                            />
                                            <AvatarFallback>
                                                {(player.username.charAt(0) + player.email.charAt(0)).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-1">
                                            <p className="text-sm font-medium leading-none">{player.username}</p>
                                            <p className="text-sm text-muted-foreground">{player.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </>
                :
                    <>
                    ЗАГРУЗОЧКА
                    </>
            }
        </>
    );
};
