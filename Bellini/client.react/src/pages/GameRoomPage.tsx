import {useNavigate, useParams} from "react-router-dom";
import {HubConnectionBuilder} from "@microsoft/signalr";
import {useAuth} from "@/utils/context/authContext.tsx";
import React, {useEffect, useState} from "react";
import * as signalR from "@microsoft/signalr";
import {toast} from "@/components/ui/use-toast.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Button} from "@/components/ui/button.tsx";
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";
import {Breadcrumbs} from "@/components/breadcrumbs.tsx";
import {DialogCreateGameQuestion} from "@/components/dialogs/dialogCreateGameQuestion.tsx";
import {CirclePlay, FileType, TrendingUp, Users} from "lucide-react";
import {Badge} from "@/components/ui/badge.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {GameQuestionItem} from "@/components/gameQuestionItem.tsx";
import {StartedGame} from "@/utils/interfaces/StartedGame.ts";
import {FinishedGame} from "@/utils/interfaces/FinishedGame.ts";
import {GameRoomSkeleton} from "@/components/skeletons/gameRoomSkeleton.tsx";
import {DialogGamePassword} from "@/components/dialogs/dialogGamePassword.tsx";
import {CurrentGame} from "@/utils/interfaces/CurrentGame.ts";
import {formatDate} from "@/utils/functions/formatDate.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {DialogUpdateGameImage} from "@/components/dialogs/dialogUpdateGameImage.tsx";
import {DialogInviteUser} from "@/components/dialogs/dialogInviteUser.tsx";

interface Player {
    userId: string;
    username: string;
    email: string;
    profileImageUrl: string;
}

interface GameRoomPageProps {
    onStart: (game: StartedGame, id: string) => void;
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

const messageSchema = z.object({
    content: z
        .string()
        .max(255, "Длина сообщения не должна превышать 255 символов")
        .nonempty("Сообщение не может быть пустым"),
});

interface MessageForm {
    content: string;
}

interface Message {
    UserId: string;
    Username: string;
    Message: string;
    ProfileImageUrl: string;
    Timestamp: Date;
}

export const GameRoomPage: React.FC<GameRoomPageProps> = ({onStart, isFinished, onFinish}) => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {isAuthenticated, user} = useAuth();
    const [isCurrentUserHost, setIsCurrentUserHost] = useState(false);
    const [currentGame, setCurrentGame] = useState<CurrentGame>();
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isUserJoined, setIsUserJoined] = useState(false);
    const [isQuestionCreated, setIsQuestionCreated] = useState(false);
    const [isQuestionDeleted, setIsQuestionDeleted] = useState(false);
    const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean>(false);

    const {register, handleSubmit, formState: {errors}} = useForm<MessageForm>({
        resolver: zodResolver(messageSchema),
    });

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
        if (!currentGame) {
            return;
        }

        if (currentGame && currentGame.isPrivate && !isPasswordCorrect) {
            return;
        }

        //const newConnection = new HubConnectionBuilder()
        //    .withUrl((import.meta.env.VITE_APP_SERVER_URL || "/signalr") + "/gameHub")
        //    .withAutomaticReconnect()
        //    .build();
        //newConnection.serverTimeoutInMilliseconds = 60000; // Увеличить таймаут (1 минута)
        //newConnection.keepAliveIntervalInMilliseconds = 15000; // Интервал пингов

        const newConnection = new HubConnectionBuilder()
            .withUrl((import.meta.env.VITE_APP_GAME_ROOM_PAGE_SERVER_URL || "/signalr") + "/gameHub")
            .withAutomaticReconnect()
            // .withAutomaticReconnect({
            //     nextRetryDelayInMilliseconds: retryContext => Math.min(retryContext.elapsedMilliseconds * 2, 10000)
            // })
            .configureLogging(signalR.LogLevel.Information)
            .build();

        // newConnection.serverTimeoutInMilliseconds = 100000; // Таймаут соединения
        // newConnection.keepAliveIntervalInMilliseconds = 30000; // Период Keep-Alive

        newConnection.on('PlayerJoined', (updatedPlayerList: Player[], joinGameDto: JoinGameDto) => {
            setPlayers(updatedPlayerList);
            console.warn("PlayerJoined" + updatedPlayerList.length);
            toast({
                title: 'Присоединился игрок',
                description: `Пользователь ${joinGameDto.username} присоединяется к игре!`
            });
        });

        newConnection.on('PlayerLeft', (updatedPlayerList: Player[]) => {
            setPlayers(updatedPlayerList);
            //console.warn("PlayerLeft" + updatedPlayerList.length);
        });

        newConnection.on("GetPlayers", (gameId: string, playerList: Player[]) => {
            if (gameId === id) {
                setPlayers(playerList);
                //console.warn("Updated players list for game", gameId, playerList.length);
            }
        });

        newConnection.on("ReceiveMessage", (gameId: string) => {
            if (gameId == id) {
                newConnection.invoke("GetChatHistory", id.toString())
            }
        });

        newConnection.on("ChatHistory", (gameId: string, history: Message[]) => {
            if (gameId == id) {
                console.warn(history);
                setMessages(history);
            }
        });


        newConnection.on('GameStarted', (gameStarted: StartedGame) => {
            console.log(currentGame?.hostId + "=" + gameStarted.hostId);
            console.error(gameStarted);
            if (currentGame?.hostId == gameStarted.hostId) {
                onStart(gameStarted, user?.id);
            }
        });

        newConnection.start()
            .then(() => {
                console.log('Connected to SignalR');
                newConnection.invoke("GetPlayers", id.toString())
                    .then((playerList: Player[]) => {
                        setPlayers(playerList);
                    });
                newConnection.invoke("GetChatHistory", id.toString())
            })
            .catch(error => console.error('Connection failed: ', error));

        setConnection(newConnection);


        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = "Вы уверены, что хотите выйти из игры?";
            return "Вы уверены, что хотите выйти из игры?";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            if (connection) {
                disconnect();
                connection.stop();
            }
        };
    }, [id, currentGame, isPasswordCorrect, isAuthenticated, user, navigate]);

    useEffect(() => {
        return () => {
            if (connection) {
                disconnect();
            }
        };
    }, [connection]);

    useEffect(() => {

        console.log("CURRENT");
        console.log(messages);
    }, [messages]);

    async function connect() {
        if (!connection || isUserJoined) return;

        if (currentGame && currentGame?.maxPlayers > (players ? players.length : 0)) {
            try {
                await connection.invoke("JoinGame", {
                    GameId: id?.toString(),
                    UserId: user?.id.toString(),
                    Username: user?.username,
                    Email: user?.email,
                    ProfileImageUrl: user?.profileImageUrl
                });
                setIsUserJoined(true);
                toast({title: "Вы успешно присоединились к игре!"});
            } catch (error) {
                console.error('Error joining game:', error);
            }
        } else {
            toast({
                title: "Что-то пошло не так", variant: "destructive",
                description: "Зал переполнен. Попробуйте подключиться позже.",
            });
        }
    }

    async function disconnect() {
        if (connection) {
            try {
                if (connection.state === signalR.HubConnectionState.Connected) {
                    await connection.invoke("LeaveGame", id?.toString(), user?.id.toString());
                    setIsUserJoined(false);
                    //toast({title: "You have left the game."});

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
                        hostId: currentGame?.hostId,
                    }),
                });
                const responseData: StartedGame = await response.json();
                if (response.ok) {
                    onStart(responseData, user?.id);
                } else if (responseData.ErrorCode == "NotFoundGameQuestionsException") {
                    toast({
                        title: "Ошибка",
                        description: responseData.Message || "Произошла непредвиденная ошибка.",
                        variant: "destructive"
                    });
                } else {
                    toast({
                        title: "Ошибка",
                        description: responseData.Message || "Произошла непредвиденная ошибка.",
                        variant: "destructive"
                    });
                }
            } catch (error: unknown) {
                console.error('Error while disconnecting:', error);
                toast({
                    title: "Ошибка",
                    description: (error as Error).message || "Произошла непредвиденная ошибка.",
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
            const response = await serverFetch(`/questions/game/${questionId}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: currentGame?.id.toString(),
            });

            if (response.ok) {
                setIsQuestionDeleted(!isQuestionDeleted);
                toast({title: "Вопрос удален", description: "Вопрос был успешно удалён."});
            } else {
                const responseData = await response.json();
                toast({
                    title: "Ошибка",
                    description: responseData.message || "Произошла непредвиденная ошибка.",
                    variant: "destructive",
                });
            }
        } catch (ex: unknown) {
            toast({
                title: "Ошибка",
                description: (ex as Error).message || "Произошла непредвиденная ошибка.",
                variant: "destructive"
            });
        }
    }

    const OnSubmitCreateComment = async (data: MessageForm) => {
        if (!isAuthenticated || !user) {
            navigate('/login');
            return;
        }
        if (!connection) {
            console.error("SignalR connection is not established.");
            return;
        }

        try {
            await connection.invoke("SendMessage", id?.toString(), user.id.toString(), data.content, currentGame?.hostId.toString());
        } catch (error) {
            console.error("Error sending message:", error);
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
                                {path: '/', name: 'Главная'},
                                {path: '/games', name: 'Игры'},
                                {path: `/games/${id}`, name: currentGame?.gameName ?? "неизвестно"},
                            ]}/>

                            {isCurrentUserHost ?
                                <div
                                    className="flex items-center justify-between mt-3 w-full mx-auto max-w-[1440px] pb-0 p-4">
                                    <Badge>Вы - создатель этой комнаты</Badge>
                                    <Button size="sm" className="h-8 ms-3 gap-1" onClick={startGame}>
                                        <CirclePlay className="h-3.5 w-3.5"/>
                                        Начать игру
                                    </Button>
                                </div>
                                : <></>
                            }
                            <div className="flex flex-col mx-auto items-center max-w-[1440px] p-4">
                                <div className="flex flex-col-reverse lg:flex-row gap-4 w-full lg:mb-0 mb-[59px] mx-auto items-center max-w-[1440px] p-4">
                                    <div className="w-full flex flex-col gap-4 lg:order-2">
                                        <div className="flex gap-4 flex-col sm:flex-row">
                                            <Card className="w-full">
                                                <CardHeader
                                                    className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                    <CardTitle className="text-sm font-medium">
                                                        Максимальное количество игроков
                                                    </CardTitle>
                                                    <Users className="h-4 w-4 text-muted-foreground"/>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-2xl font-bold">{currentGame.maxPlayers} игрок(ы)</div>
                                                    <p className="text-xs text-muted-foreground">Не более этого количества игроков</p>
                                                </CardContent>
                                            </Card>
                                            <Card className="w-full">
                                                <CardHeader
                                                    className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                    <CardTitle className="text-sm font-medium">Статус игры</CardTitle>
                                                    <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-2xl font-bold">{currentGame.gameStatus.name}</div>
                                                    <p className="text-xs text-muted-foreground">Игра скоро начнется</p>
                                                </CardContent>
                                            </Card>
                                            <Card className="w-full">
                                                <CardHeader
                                                    className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                    <CardTitle className="text-sm font-medium">Тип игровой комнаты</CardTitle>
                                                    <FileType className="h-4 w-4 text-muted-foreground"/>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-2xl font-bold">{currentGame.isPrivate ? "Private" : "Public"}</div>
                                                    <p className="text-xs text-muted-foreground">The game will start soon</p>
                                                </CardContent>
                                            </Card>
                                        </div>
                                        <div className="flex gap-4 flex-col lg:flex-row w-full">
                                            <Card className="w-full lg:w-1/2">
                                                {isCurrentUserHost ?
                                                    <>
                                                        <CardHeader>
                                                            <CardTitle>Вопросы</CardTitle>
                                                            <CardDescription>
                                                                Здесь вы можете выбрать перечень вопросов, которые будут
                                                                участвовать в игре
                                                            </CardDescription>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <ScrollArea className="h-[220px] p-4 border rounded-md">
                                                                {currentGame.questions.length == 0 ?
                                                                    <div
                                                                        className="h-[170px] flex items-center justify-center">
                                                                        <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                                                                            Пока нет никаких вопросов... 😪
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
                                                                                    questionImageUrl={item.questionImageUrl}
                                                                                    answers={item.answerOptions}/>
                                                                            </div>
                                                                        ))}
                                                                    </>
                                                                }
                                                            </ScrollArea>
                                                        </CardContent>
                                                        <CardFooter>
                                                            {id ? <DialogCreateGameQuestion
                                                                currentGameId={id.toString()}
                                                                setIsQuestionCreated={setIsQuestionCreated}
                                                                isQuestionCreated={isQuestionCreated}
                                                            /> : <></>}
                                                        </CardFooter>
                                                    </>
                                                    :
                                                    <CardContent>
                                                        <ScrollArea className="mt-5 h-[370px] p-4  rounded-md">
                                                            <h2 className="text-xl font-bold mb-4">Добро пожаловать в игровую комнату!</h2>
                                                            <p className="mb-4">Прежде чем мы начнем, вот краткое руководство
                                                                , которое поможет вам понять, как играть:</p>

                                                            <h3 className="text-lg font-semibold mb-2">Цель</h3>
                                                            <p className="mb-4">Правильно отвечайте на вопросы, чтобы заработать очки.
                                                                Игрок или команда, набравшие наибольшее количество очков в конце
                                                                , выигрывают!</p>

                                                            <h3 className="text-lg font-semibold mb-2">Формат вопроса</h3>
                                                            <ul className="list-disc ml-6 mb-4">
                                                                <li>На каждый вопрос есть 4 варианта ответа.</li>
                                                                <li>Правильным является только один ответ.</li>
                                                                <li>у вас есть ограниченное время, чтобы ответить на каждый вопрос, так
                                                                    что думайте быстро!
                                                                </li>
                                                            </ul>

                                                            <h3 className="text-lg font-semibold mb-2">Счет</h3>
                                                            <ul className="list-disc ml-6 mb-4">
                                                                <li>Правильные ответы приносят очки.</li>
                                                                <li>Чем быстрее вы ответите, тем больше очков наберете.</li>
                                                                <li>За неправильные ответы баллы не начисляются.</li>
                                                            </ul>

                                                            <h3 className="text-lg font-semibold mb-2">Подсказки и жизненные пути (если
                                                                таковые имеются)</h3>
                                                            <ul className="list-disc ml-6 mb-4">
                                                                <li><strong>50/50:</strong> Два неправильных ответа будут
                                                                    удалены.
                                                                </li>
                                                                <li><strong>Пропустите:</strong> Пропустите вопрос, не потеряв при этом ни одного балла
                                                                    (количество баллов ограничено).
                                                                </li>
                                                            </ul>

                                                            <h3 className="text-lg font-semibold mb-2">Командная игра (если
                                                                применимо)</h3>
                                                            <ul className="list-disc ml-6 mb-4">
                                                                <li>Обсудите ответы со своей командой.</li>
                                                                <li>Только один человек должен отправить ответ от имени
                                                                    команды.
                                                                </li>
                                                                <li>Координация команды - это ключ к успеху!</li>
                                                            </ul>

                                                            <h3 className="text-lg font-semibold mb-2">Правила</h3>
                                                            <ul className="list-disc ml-6 mb-4">
                                                                <li>Никакого обмана! Используйте только свои знания и рассуждения.</li>
                                                                <li>Относитесь с уважением к другим игрокам и получайте удовольствие от игры.</li>
                                                            </ul>

                                                            <p className="text-lg font-semibold">Готовы начать? Удачи,
                                                                и пусть победит лучший игрок!</p>
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
                                                                        <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight"> Там
                                                                            подключенных пользователей пока нет... 😪</h1>
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
                                                                <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">Там
                                                                    подключенных пользователей пока нет...... 😪</h1>
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
                                                            >Подключиться</Button>
                                                        ) : (
                                                            <Button variant="destructive"
                                                                    onClick={disconnect}>Отключиться</Button>
                                                        )}
                                                    </CardFooter>
                                                }
                                            </Card>
                                        </div>
                                        <Card className="block lg:hidden">
                                            <CardHeader>
                                                <CardTitle>Делиться</CardTitle>
                                                <CardDescription>Вы можете поделиться ссылкой на игру с другими пользователями.
                                                    пользователи</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <DialogInviteUser
                                                    link={window.location.href}
                                                    isPrivate={currentGame.isPrivate}
                                                    password={currentGame.roomPassword}
                                                    gameName={currentGame.gameName}/>
                                            </CardContent>
                                        </Card>
                                    </div>
                                    <div className="flex gap-4 flex-col w-full lg:w-[20rem] order-1 lg:order-2 ">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>{currentGame.gameName}</CardTitle>
                                                <CardDescription>Морковь, ящики для помидоров
                                                    элита</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                {currentGame && user && currentGame.hostId.toString() == user!.id! ?
                                                    <DialogUpdateGameImage
                                                        currentGameId={currentGame.id.toString()}
                                                        gameName={currentGame.gameName}
                                                        gameCoverImageUrl={currentGame.gameCoverImageUrl}
                                                    />
                                                    :
                                                    <div className="grid gap-2">
                                                        <img
                                                            alt="Product image"
                                                            className="aspect-square w-full rounded-md object-cover border-0"
                                                            height="300" width="300" src={currentGame.gameCoverImageUrl}
                                                        />
                                                    </div>
                                                }
                                            </CardContent>
                                        </Card>
                                        <Card className="hidden lg:block">
                                            <CardHeader>
                                                <CardTitle>Делиться</CardTitle>
                                                <CardDescription>Вы можете поделиться ссылкой на игру с другими пользователями.
                                                    пользователи</CardDescription>
                                            </CardHeader>
                                            <CardContent>

                                                <DialogInviteUser
                                                    link={window.location.href}
                                                    isPrivate={currentGame.isPrivate}
                                                    password={currentGame.roomPassword}
                                                    gameName={currentGame.gameName}/>
                                            </CardContent>
                                        </Card>
                                    </div>

                                </div>
                                <div className="flex flex-col lg:flex-row justify-between gap-4 w-full p-4">
                                    <Card className="w-full min-w-[450px] lg:w-1/2">
                                        <CardHeader>
                                            <CardTitle>Игровой чат</CardTitle>
                                            <CardDescription>
                                                Здесь игроки могут заранее пообщаться перед началом игры.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {messages && messages.length > 0 ?
                                                <ScrollArea className="h-[450px] p-4 border rounded-md">

                                                    {messages.map((item, index) => (
                                                        <div key={index}>
                                                            <div className={`flex w-full ${user?.id == item.UserId ? "flex-row-reverse" : ""} p-2`}> {/* FLEX REVERSE IS YOUR MESSEGE  */}
                                                                <Avatar className="hidden h-9 w-9 sm:flex mx-2">
                                                                    <AvatarImage
                                                                        src={item.ProfileImageUrl}
                                                                        alt={`${item.Username}'s profile`}
                                                                    />
                                                                    <AvatarFallback>
                                                                        {(item.Username.charAt(0) + item.Username.charAt(1)).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div
                                                                    className={"flex max-w-[50%]  mt-[-10px]"}>
                                                                    <div className="border-[1px] rounded-xl py-2 px-6 flex-row">
                                                                        <div className={`flex items-center  ${user?.id == item.UserId ? "justify-end" : ""}`}>
                                                                            <h1 className="text-[102%] font-medium">{item.Username}</h1>
                                                                        </div>
                                                                        <p className="text-wrap text-[98%] mt-2 leading-[96%]">{item.Message}</p>

                                                                        <div className={`flex items-center "justify-end" : ""}`}>
                                                                            <p className="text-sm text-muted-foreground mt-3">{formatDate(new Date(item.Timestamp))}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}

                                                </ScrollArea>

                                                :
                                                <Card className="h-[450px] p-4 border rounded-md flex justify-center items-center">
                                                    <h1 className="text-muted-foreground">
                                                        Здесь пока нет сообщений
                                                    </h1>
                                                </Card>
                                            }
                                            <div>
                                                {!(isUserJoined || isCurrentUserHost) ? <></> :
                                                    <form onSubmit={handleSubmit(OnSubmitCreateComment)}
                                                          className="flex justify-end flex-wrap mt-4 gap-4">
                                                        <Textarea
                                                            {...register("content")}
                                                            placeholder="Type your message here."
                                                            className={`w-full ${errors.content ? "border-red-500" : ""}`}
                                                        />
                                                        {errors.content && <p className="text-red-500">{errors.content.message}</p>}
                                                        <Button type="submit">Отправить</Button>
                                                    </form>
                                                }
                                            </div>

                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent>
                                            <ScrollArea className="mt-5 h-[650зч] p-4  rounded-md">
                                                <h2 className="text-xl font-bold mb-4">Добро пожаловать в игровую комнату!</h2>
                                                <p className="mb-4">Прежде чем мы начнем, вот краткое руководство
                                                    , которое поможет вам понять, как играть:</p>

                                                <h3 className="text-lg font-semibold mb-2">Цель</h3>
                                                <p className="mb-4">Правильно отвечайте на вопросы, чтобы заработать очки.
                                                    Игрок или команда, набравшие наибольшее количество очков в конце
                                                    , выигрывают!</p>

                                                <h3 className="text-lg font-semibold mb-2">Формат вопроса</h3>
                                                <ul className="list-disc ml-6 mb-4">
                                                    <li>На каждый вопрос есть 4 варианта ответа.</li>
                                                    <li>Правильным является только один ответ.</li>
                                                    <li>у вас есть ограниченное время, чтобы ответить на каждый вопрос, так
                                                        что думайте быстро!
                                                    </li>
                                                </ul>

                                                <h3 className="text-lg font-semibold mb-2">Счет</h3>
                                                <ul className="list-disc ml-6 mb-4">
                                                    <li>Правильные ответы приносят очки.</li>
                                                    <li>Чем быстрее вы ответите, тем больше очков наберете.</li>
                                                    <li>За неправильные ответы баллы не начисляются.</li>
                                                </ul>

                                                <h3 className="text-lg font-semibold mb-2">Подсказки и жизненные пути (если
                                                    таковые имеются)</h3>
                                                <ul className="list-disc ml-6 mb-4">
                                                    <li><strong>50/50:</strong> Два неправильных ответа будут
                                                        удалены.
                                                    </li>
                                                    <li><strong>Пропустите:</strong> Пропустите вопрос, не потеряв при этом ни одного балла
                                                        (количество баллов ограничено).
                                                    </li>
                                                </ul>

                                                <h3 className="text-lg font-semibold mb-2">Командная игра (если
                                                    применимо)</h3>
                                                <ul className="list-disc ml-6 mb-4">
                                                    <li>Обсудите ответы со своей командой.</li>
                                                    <li>Только один человек должен отправить ответ от имени
                                                        команды.
                                                    </li>
                                                    <li>Координация команды - это ключ к успеху!</li>
                                                </ul>

                                                <h3 className="text-lg font-semibold mb-2">Правила</h3>
                                                <ul className="list-disc ml-6 mb-4">
                                                    <li>Никакого обмана! Используйте только свои знания и рассуждения.</li>
                                                    <li>Относитесь с уважением к другим игрокам и получайте удовольствие от игры.</li>
                                                </ul>

                                                <p className="text-lg font-semibold">Готовы начать? Удачи,
                                                    и пусть победит лучший игрок!</p>
                                            </ScrollArea>
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