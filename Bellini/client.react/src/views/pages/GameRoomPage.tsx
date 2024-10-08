import {useNavigate, useParams} from "react-router-dom";
import {HubConnectionBuilder} from "@microsoft/signalr";
import {useAuth} from "@/utils/context/authContext.tsx";
import {useEffect, useState} from "react";
import * as signalR from "@microsoft/signalr";
import {toast} from "@/components/ui/use-toast.ts";
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";
import {DialogShareButton} from "@/views/partials/DialogShareButton.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";

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

    useEffect(() => {
        if (!isAuthenticated || !user || !id) {
            navigate('/login');
            return;
        }
        serverFetch(`/game/${id}`)
            .then(response => response.json())
            .then(data => {
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

            newConnection.on('PlayerJoined', (playerList: Player[], newPlayer: Player) => {
                setPlayers(playerList);
                console.log(playerList);
                console.log(`${newPlayer.username} has joined the game`);
            });

            newConnection.on('PlayerLeft', (updatedPlayerList: Player[]) => {
                setPlayers(updatedPlayerList);
                console.log('A player has left the game');
            });

            try {
                await newConnection.start();
                await newConnection.invoke("JoinGame", {
                    GameId: id.toString(),
                    UserId: user.id.toString(),
                    Username: user.username,
                    Email: user.email,
                    ProfileImageUrl: user.profileImageUrl
                });

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
            event.returnValue = '';
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
            <DialogShareButton link={window.location.href}/>
            <div>Game Room {id}</div>
            {isCurrentUserHost ?
                <>
                    HOST
                </>
                :
                <>
                    user
                </>
            }


            <Card x-chunk="dashboard-01-chunk-5">
                <CardHeader>
                    <CardTitle>Connected Users</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-8">

                    {players.map((player) => (
                        <div key={player.userId}  className="flex items-center gap-4">
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
                                <p className="text-sm font-medium leading-none">
                                    {player.username}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {player.email}
                                </p>
                            </div>
                            <div className="ml-auto font-medium">+$1,999.00</div>
                        </div>
                    ))}
                </CardContent>
            </Card>




        </>
    );
};
