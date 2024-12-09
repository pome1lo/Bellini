import {useNavigate, useParams} from "react-router-dom";
import {HubConnectionBuilder} from "@microsoft/signalr";
import {useAuth} from "@/utils/context/authContext.tsx";
import React, {useEffect, useState} from "react";
import * as signalR from "@microsoft/signalr";
import {toast} from "@/components/ui/use-toast.ts";
import {DialogShareButton} from "@/views/partials/dialogs/DialogShareButton.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Button} from "@/components/ui/button.tsx";
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";
import {Breadcrumbs} from "@/views/partials/Breadcrumbs.tsx";
import {DialogCreateQuestion} from "@/views/partials/dialogs/DialogCreateQuestion.tsx";
import {CirclePlay, FileType, TrendingUp, Users} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {GameQuestionItem} from "@/views/partials/GameQuestionItem.tsx";
import {StartedGame} from "@/utils/interfaces/StartedGame.ts";
import {FinishedGame} from "@/utils/interfaces/FinishedGame.ts";
import {GameRoomSkeleton} from "@/views/partials/skeletons/GameRoomSkeleton.tsx";
import {DialogGamePassword} from "@/views/partials/dialogs/DialogGamePassword.tsx";
import {CurrentGame} from "@/utils/interfaces/CurrentGame.ts";

interface Player {
    userId: string;
    username: string;
    email: string;
    profileImageUrl: string;
}

interface GameRoomPageProps {
    onStart: (game: StartedGame) => void;
    isFinished: (isFinished: boolean) => void;
    onFinish: (game: FinishedGame) => void;
}

interface JoinGameDto {
    gameId: string;
    userId: string;
    username: string;
    email: string;
    profileImageUrl: string;
}

export const GameRoomPage: React.FC<GameRoomPageProps> = ({onStart, isFinished, onFinish}) => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {isAuthenticated, user} = useAuth();
    const [isCurrentUserHost, setIsCurrentUserHost] = useState(false);
    const [currentGame, setCurrentGame] = useState<CurrentGame>();
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [isUserJoined, setIsUserJoined] = useState(false);
    const [isQuestionCreated, setIsQuestionCreated] = useState(false);
    const [isQuestionDeleted, setIsQuestionDeleted] = useState(false);
    const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean>(false);

    useEffect(() => {
        if (!isAuthenticated || !user || !id) {
            navigate('/login');
            return;
        }
        serverFetch(`/game/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.gameStatus.name == "Completed") {
                    isFinished(true);
                    onFinish(data);
                    return;
                }
                setCurrentGame(data);
                setIsCurrentUserHost(user.id === data.hostId);
            })
            .catch(error => {
                console.error('Error fetching game:', error.message);
            });
    }, [id, isAuthenticated, user, navigate, isQuestionCreated, isQuestionDeleted]);


    useEffect(() => {

        if (!isAuthenticated || !user || !id) {
            navigate('/login');
            return;
        }
        if (currentGame && currentGame.isPrivate && !isPasswordCorrect) {
            return;
        }

        const newConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:7292/gameHub", {
                transport: signalR.HttpTransportType.ServerSentEvents,
                withCredentials: true
            })
            .withAutomaticReconnect()
            .build();

        newConnection.on('PlayerJoined', (updatedPlayerList: Player[], joinGameDto: JoinGameDto) => {
            setPlayers(updatedPlayerList);
            console.warn("PlayerJoined" + updatedPlayerList.length);
            toast({
                title: 'Player joined',
                description: `User ${joinGameDto.username} joined the game!`
            });
        });

        newConnection.on('PlayerLeft', (updatedPlayerList: Player[]) => {
            setPlayers(updatedPlayerList);
            console.warn("PlayerLeft" + updatedPlayerList.length);
        });

        newConnection.on("GetPlayers", (gameId: string, playerList: Player[]) => {
            if (gameId === id) {
                setPlayers(playerList);
                console.warn("Updated players list for game", gameId, playerList.length);
            }
        });

        newConnection.on('GameStarted', (gameStarted: StartedGame) => {
            if (gameStarted.hostId == gameStarted.hostId) {
                onStart(gameStarted);
            }
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
    }, [id, isPasswordCorrect, isAuthenticated, user, navigate]);

    useEffect(() => {
        return () => {
            if (connection) {
                disconnect();
            }
        };
    }, [connection]);

    async function connect() {
        if (!connection || isUserJoined) return;


        if (currentGame?.maxPlayers > (players ? players.length : 0)) {
            try {
                await connection.invoke("JoinGame", {
                    GameId: id?.toString(),
                    UserId: user?.id.toString(),
                    Username: user?.username,
                    Email: user?.email,
                    ProfileImageUrl: user?.profileImageUrl
                });
                setIsUserJoined(true);
                toast({title: "You have successfully joined the game!"});
            } catch (error) {
                console.error('Error joining game:', error);
            }
        } else {
            toast({
                title: "Something went wrong", variant: "destructive",
                description: "The room is full. Try to connect later.",
            });
        }
    }

    async function disconnect() {
        if (connection) {
            try {
                if (connection.state === signalR.HubConnectionState.Connected) {
                    await connection.invoke("LeaveGame", id?.toString(), user?.id.toString());
                    setIsUserJoined(false);
                    toast({title: "You have left the game."});

                }
            } catch (error) {
                console.error('Error while disconnecting:', error);
            }
        }
    }

    async function startGame() {
        if (connection) {
            try {
                if (!isAuthenticated || !user) {
                    navigate('/login');
                    return;
                }

                const serverPlayers = players.map(player => ({
                    userId: parseInt(player.userId),
                    name: player.username,
                    GameId: id,
                    score: 0,
                    profileImageUrl: player.profileImageUrl
                }));

                const response = await serverFetch(`/game/${id}/start`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        players: serverPlayers,
                        gameId: id,
                        hostId: user.id,
                    }),
                });
                const responseData: StartedGame = await response.json();
                if (response.ok) {
                    onStart(responseData);
                } else if (responseData.ErrorCode == "NotFoundGameQuestionsException") {
                    toast({
                        title: "Error",
                        description: responseData.Message || "An error occurred.",
                        variant: "destructive"
                    });
                } else {
                    toast({
                        title: "Error",
                        description: responseData.Message || "An error occurred.",
                        variant: "destructive"
                    });
                }
            } catch (error: unknown) {
                console.error('Error while disconnecting:', error);
                toast({
                    title: "Error",
                    description: (error as Error).message || "An unexpected error occurred.",
                    variant: "destructive"
                });
            }
        }
    }

    async function dropQuestion(questionId: number) {
        try {
            if (!isAuthenticated || !user) {
                navigate("/login");
                return;
            }
            const response = await serverFetch(`/questions/${questionId}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: currentGame?.id.toString(),
            });

            if (response.ok) {
                setIsQuestionDeleted(!isQuestionDeleted);
                toast({title: "Question Deleted", description: "The question was successfully deleted."});
            } else {
                const responseData = await response.json();
                toast({
                    title: "Error",
                    description: responseData.message || "An error occurred.",
                    variant: "destructive",
                });
            }
        } catch (ex: unknown) {
            toast({
                title: "Error",
                description: (ex as Error).message || "An unexpected error occurred.",
                variant: "destructive"
            });
        }
    }

    return (
        <>
            {!isPasswordCorrect && currentGame?.isPrivate ?
                <DialogGamePassword
                    correctPassword={currentGame?.roomPassword ?? ""}
                    isPasswordCorrect={isPasswordCorrect}
                    setIsPasswordCorrect={setIsPasswordCorrect}
                />
                :
                <>
                    {currentGame ?
                        <>
                            <Breadcrumbs items={[
                                {path: '/', name: 'Home'},
                                {path: '/games', name: 'Games'},
                                {path: `/games/${id}`, name: currentGame?.gameName ?? "unknown"},
                            ]}/>

                            {isCurrentUserHost ?
                                <div
                                    className="flex items-center justify-between mt-3 w-full mx-auto max-w-[1440px] pb-0 p-4">
                                    <Badge>You are the creator of the room</Badge>
                                    <Button size="sm" className="h-8 ms-3 gap-1" onClick={startGame}>
                                        <CirclePlay className="h-3.5 w-3.5"/>
                                        Start Game
                                    </Button>
                                </div>
                                : <></>
                            }
                            <div
                                className="flex flex-col-reverse lg:flex-row gap-4 w-full mb-[59px] mx-auto items-center max-w-[1440px] p-4">
                                <div className="w-full flex flex-col gap-4 lg:order-2">
                                    <div className="flex gap-4 flex-col sm:flex-row">
                                        <Card className="w-full">
                                            <CardHeader
                                                className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">
                                                    Maximum players
                                                </CardTitle>
                                                <Users className="h-4 w-4 text-muted-foreground"/>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">{currentGame.maxPlayers} player(s)
                                                </div>
                                                <p className="text-xs text-muted-foreground">No more than this number of
                                                    players</p>
                                            </CardContent>
                                        </Card>
                                        <Card className="w-full">
                                            <CardHeader
                                                className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Game status</CardTitle>
                                                <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">{currentGame.gameStatus.name}</div>
                                                <p className="text-xs text-muted-foreground">The game will start
                                                    soon</p>
                                            </CardContent>
                                        </Card>
                                        <Card className="w-full">
                                            <CardHeader
                                                className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Game room type</CardTitle>
                                                <FileType className="h-4 w-4 text-muted-foreground"/>
                                            </CardHeader>
                                            <CardContent>
                                                <div
                                                    className="text-2xl font-bold">{currentGame.isPrivate ? "Private" : "Public"}</div>
                                                <p className="text-xs text-muted-foreground">The game will start
                                                    soon</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                    <div className="flex gap-4 flex-col lg:flex-row w-full">
                                        <Card className="w-full lg:w-1/2">
                                            {isCurrentUserHost ?
                                                <>
                                                    <CardHeader>
                                                        <CardTitle>Questions</CardTitle>
                                                        <CardDescription>
                                                            Here you can select a list of questions that will
                                                            participate in the game
                                                        </CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <ScrollArea className="h-[220px] p-4 border rounded-md">
                                                            {currentGame.questions.length == 0 ?
                                                                <div
                                                                    className="h-[170px] flex items-center justify-center">
                                                                    <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                                                                        There are no questions yet... 😪
                                                                    </h1>
                                                                </div>
                                                                : <>
                                                                    {currentGame.questions.map((item, index) => (
                                                                        <div key={index} className="mb-2">
                                                                            <GameQuestionItem
                                                                                id={item.id}
                                                                                index={index + 1}
                                                                                dropItem={dropQuestion}
                                                                                question={item.text}
                                                                                answers={item.answerOptions}/>
                                                                        </div>
                                                                    ))}
                                                                </>
                                                            }
                                                        </ScrollArea>
                                                    </CardContent>
                                                    <CardFooter>
                                                        {id ? <DialogCreateQuestion
                                                            currentGameId={id.toString()}
                                                            setIsQuestionCreated={setIsQuestionCreated}
                                                            isQuestionCreated={isQuestionCreated}
                                                        /> : <></>}
                                                    </CardFooter>
                                                </>
                                                :
                                                <CardContent>
                                                    <ScrollArea className="mt-5 h-[370px] p-4  rounded-md">
                                                        <h2 className="text-xl font-bold mb-4">Welcome to the Game
                                                            Room!</h2>
                                                        <p className="mb-4">Before we begin, here's a quick guide to
                                                            help you understand how to play:</p>

                                                        <h3 className="text-lg font-semibold mb-2">Objective</h3>
                                                        <p className="mb-4">Answer questions correctly to earn points.
                                                            The player or team with the highest score at the end
                                                            wins!</p>

                                                        <h3 className="text-lg font-semibold mb-2">Question Format</h3>
                                                        <ul className="list-disc ml-6 mb-4">
                                                            <li>Each question has 4 answer options.</li>
                                                            <li>Only one answer is correct.</li>
                                                            <li>You have a limited time to answer each question, so
                                                                think fast!
                                                            </li>
                                                        </ul>

                                                        <h3 className="text-lg font-semibold mb-2">Scoring</h3>
                                                        <ul className="list-disc ml-6 mb-4">
                                                            <li>Correct answers earn points.</li>
                                                            <li>The faster you answer, the more points you score.</li>
                                                            <li>No points are awarded for incorrect answers.</li>
                                                        </ul>

                                                        <h3 className="text-lg font-semibold mb-2">Hints & Lifelines (if
                                                            available)</h3>
                                                        <ul className="list-disc ml-6 mb-4">
                                                            <li><strong>50/50:</strong> Two incorrect answers will be
                                                                removed.
                                                            </li>
                                                            <li><strong>Skip:</strong> Skip the question without losing
                                                                points (limited usage).
                                                            </li>
                                                        </ul>

                                                        <h3 className="text-lg font-semibold mb-2">Team Play (if
                                                            applicable)</h3>
                                                        <ul className="list-disc ml-6 mb-4">
                                                            <li>Discuss answers with your team.</li>
                                                            <li>Only one person needs to submit the answer on behalf of
                                                                the team.
                                                            </li>
                                                            <li>Team coordination is key!</li>
                                                        </ul>

                                                        <h3 className="text-lg font-semibold mb-2">Rules</h3>
                                                        <ul className="list-disc ml-6 mb-4">
                                                            <li>No cheating! Use only your knowledge and reasoning.</li>
                                                            <li>Be respectful to other players and enjoy the game.</li>
                                                        </ul>

                                                        <p className="text-lg font-semibold">Ready to start? Good luck,
                                                            and may the best player win!</p>
                                                    </ScrollArea>
                                                </CardContent>
                                            }
                                        </Card>
                                        <Card className="w-full lg:w-1/2">
                                            <CardHeader>
                                                <CardTitle>Connected Users</CardTitle>
                                                <CardDescription>Players connected to this game room</CardDescription>
                                            </CardHeader>
                                            <CardContent className="grid gap-8">
                                                <ScrollArea
                                                    className={`h-[220px] w-full rounded-md border p-4 ${players && players.length >= currentGame.maxPlayers ? "bg-muted" : ""}`}>
                                                    {players ?
                                                        <>
                                                            {players.length == 0 ?
                                                                <div
                                                                    className="h-[170px] flex items-center justify-center">
                                                                    <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">There
                                                                        are no connected users yet... 😪</h1>
                                                                </div>
                                                                : <>
                                                                    {players.map((player) => (
                                                                        <div key={player.userId}
                                                                             className="flex items-center gap-4 mt-2">
                                                                            <Avatar className="hidden h-9 w-9 sm:flex">
                                                                                <AvatarImage
                                                                                    src={player.profileImageUrl}
                                                                                    alt={`${player.username}'s profile`}
                                                                                />
                                                                                <AvatarFallback>
                                                                                    {(player.username.charAt(0) + player.email.charAt(0)).toUpperCase()}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                            <div className="grid">
                                                                                <p className="text-sm font-medium leading-none">{player.username}</p>
                                                                                <p className="text-sm text-muted-foreground">{player.email}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </>
                                                            }
                                                        </>
                                                        :
                                                        <div className="h-[170px] flex items-center justify-center">
                                                            <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">There
                                                                are no connected users yet... 😪</h1>
                                                        </div>
                                                    }

                                                </ScrollArea>
                                            </CardContent>
                                            {isCurrentUserHost ? <></> :
                                                <CardFooter>
                                                    {!isUserJoined ? (
                                                        <Button
                                                            onClick={connect}
                                                            disabled={players && players.length >= currentGame.maxPlayers}
                                                        >Connect</Button>
                                                    ) : (
                                                        <Button variant="destructive"
                                                                onClick={disconnect}>Disconnect</Button>
                                                    )}
                                                </CardFooter>
                                            }
                                        </Card>
                                    </div>
                                    <Card className="block lg:hidden">
                                        <CardHeader>
                                            <CardTitle>Share</CardTitle>
                                            <CardDescription>You can share the link to the game with other
                                                users</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <DialogShareButton link={window.location.href}/>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="flex gap-4 flex-col w-full lg:w-[20rem] order-1 lg:order-2 ">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>{currentGame.gameName}</CardTitle>
                                            <CardDescription>Lipsum dolor sit amet, consectetur adipiscing
                                                elit</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid gap-2">
                                                <img
                                                    alt="Product image"
                                                    className="hidden lg:block aspect-square w-full rounded-md object-cover"
                                                    height="300" width="300" src={currentGame.gameCoverImageUrl}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="hidden lg:block">
                                        <CardHeader>
                                            <CardTitle>Share</CardTitle>
                                            <CardDescription>You can share the link to the game with other
                                                users</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <DialogShareButton link={window.location.href}/>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </> : <GameRoomSkeleton/>
                    }
                </>
            }
        </>
    );
};