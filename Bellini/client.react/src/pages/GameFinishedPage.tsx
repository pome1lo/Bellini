import React, {useEffect, useState} from "react";
import {FinishedGame} from "@/utils/interfaces/FinishedGame.ts";
import {Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis} from "recharts";
import {ChartConfig, ChartContainer, ChartTooltipContent} from "@/components/ui/chart.tsx";
import {Breadcrumbs} from "@/components/breadcrumbs.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {DialogShareButton} from "@/components/dialogs/dialogShareButton.tsx";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx"
import {FileType, TrendingUp, Users} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {useAuth} from "@/utils/context/authContext.tsx";
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";
import {toast} from "@/components/ui/use-toast.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {Comment} from "@/utils/interfaces/Comment.ts";
import {formatDate} from "@/utils/functions/formatDate.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {
    TooltipCustom,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip.tsx"
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {authFetch} from "@/utils/fetchs/authFetch.ts";

interface GameFinishedPageProps {
    currentGame?: FinishedGame;
}

interface GameRating {
    accuracy: number;
    correctAnswers: number;
    profileImageUrl: string;
    rank: number;
    username: string;
}

interface CommentForm {
    content: string;
}

const commentSchema = z.object({
    content: z
        .string()
        .max(255, "Длина комментария не должна превышать 255 символов")
        .nonempty("Комментарий не может быть пустым"),
});

const getRatingChartData = (rating: GameRating[]) => {
    return rating.map((item) => ({
        name: item.username,
        correctAnswers: item.correctAnswers,
        accuracy: item.accuracy,
    }));
};

export const GameFinishedPage: React.FC<GameFinishedPageProps> = ({currentGame}) => {
    const {id} = useParams();
    const [comments, setComments] = useState<Comment[]>([]);
    const [rating, setRating] = useState<GameRating[]>([]);
    const [isUpdated, setIsUpdated] = useState(false);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [chartData, setChartData] = useState<{
        name: string;
        correctAnswers: number;
        accuracy: number;
    }[]>([]);
    const [isCurrentUserPlayer, setIsCurrentUserPlayer] = useState(false);
    const {user, getAccessToken, logout, isAuthenticated} = useAuth();
    const navigate = useNavigate();

    const {register, handleSubmit, reset, formState: {errors}} = useForm<CommentForm>({
        resolver: zodResolver(commentSchema),
    });

    useEffect(() => {
        if (isAuthenticated && user && currentGame?.players) {
            const isPlayer = currentGame.players.some(player => player.userId.toString() == user.id || currentGame?.hostId.toString() == user.id);
            setIsCurrentUserPlayer(isPlayer);
            setTotalQuestions(currentGame?.questions.length || 0);
        }
    }, [currentGame, isAuthenticated, user]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await serverFetch(`/comments/game/${id}`);
                const data = await response.json();

                if (response.status === 204 || !Array.isArray(data)) {
                    setComments([]);
                } else {
                    setComments(data);
                }
            } catch (ex: unknown) {
                console.error('Error fetching games:', (ex as Error).message);
                setComments([]);
            }
        };

        fetchComments();
    }, [currentGame, isUpdated]);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await serverFetch(`/game/${id}/statistics`);
                const data = await response.json();
                if (response.status === 204 || !Array.isArray(data)) {
                    setRating([]);
                } else {
                    setRating(data);
                }
            } catch (ex: unknown) {
                console.error('Error fetching games:', (ex as Error).message);
                setRating([]);
            }
        };

        fetchStatistics();
    }, [currentGame, isUpdated]);

    const OnSubmitCreateComment = async (data: CommentForm) => {
        if (!isAuthenticated || !user) {
            navigate('/login');
            return;
        }
        try {

            const response = await authFetch(`/comments/game/${currentGame?.id}`, getAccessToken, logout, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    gameId: currentGame?.id,
                    userId: user.id,
                    content: data.content,
                    username: user.username,
                    profileImageUrl: user.profileImageUrl ?? ""
                }),
            });


            if (response.ok) {
                setIsUpdated(!isUpdated);
                reset();
                toast({title: "Созданный комментарий", description: "Комментарий был успешно создан."});
            } else {
                const responseData = await response.json();
                toast({
                    title: "Ошибка",
                    description: responseData.message || "Произошла ошибка.",
                    variant: "destructive"
                });
            }
        } catch (ex: unknown) {
            const errorMessage = (ex as Error).message || "Произошла ошибка.";
            toast({
                title: "Ошибка",
                description: errorMessage,
                variant: "destructive"
            });
        }
    };

    useEffect(() => {
        setChartData(getRatingChartData(rating));
    }, [rating]);

    const chartConfig: ChartConfig = {
        correctAnswers: {
            label: "Correct Answers ",
            color: "hsl(var(--foreground))",
        }
    };

    async function deleteComment(id: number) {
        try {
            if (!isAuthenticated || !user) {
                navigate('/login');
                return;
            }

            const response = await serverFetch(`/comments/${id}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
            });

            const responseData = await response.json();

            if (response.ok) {
                setIsUpdated(!isUpdated);
                toast({title: "Комментарий удален", description: "Комментарий был успешно удален."});
            } else {
                toast({
                    title: "Ошибка",
                    description: responseData.message || "Произошла ошибка.",
                    variant: "destructive"
                });
            }
        } catch (ex: unknown) {
            const errorMessage = (ex as Error).message || "Произошла ошибка.";
            toast({
                title: "Ошибка",
                description: errorMessage,
                variant: "destructive"
            });
        }
    }

    return (
        <div className="p-4 max-w-[1440px] mx-auto">
            <Breadcrumbs items={[
                {path: '/', name: 'Главная'},
                {path: '/games', name: 'Игры'},
                {path: `/games/${currentGame?.id}`, name: currentGame?.gameName ?? "Неизвестно"},
            ]}/>

            <div className="flex flex-col xl:flex-row gap-4 mt-5">
                <div className="flex flex-wrap gap-4 xl:order-2 order-1">
                    <div className="flex sm:flex-row flex-col w-full gap-4">
                        <Card className="w-full">
                            <CardHeader
                                className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Максимальное количество игроков
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground"/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{currentGame?.maxPlayers} игрок(ы)</div>
                                <p className="text-xs text-muted-foreground">
                                    Не более этого количества игроков
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="w-full">
                            <CardHeader
                                className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Статус игры
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">Completed</div>
                                <p className="text-xs text-muted-foreground">
                                    Игра скоро начнется
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="w-full">
                            <CardHeader
                                className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Тип игровой комнаты
                                </CardTitle>
                                <FileType className="h-4 w-4 text-muted-foreground"/>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="text-2xl font-bold">{currentGame?.isPrivate ? "Private" : "Public"}</div>
                                <p className="text-xs text-muted-foreground">
                                    Игра скоро начнется
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="flex lg:flex-row flex-col gap-4 w-full">
                        <Card className="lg:w-1/2 w-full">
                            <CardHeader>
                                <CardTitle>
                                    <h1 className="text-2xl font-bold">Рейтинг </h1>
                                </CardTitle>
                                <CardDescription>,
                                    Вы можете поделиться ссылкой на игру с другими пользователями
                                </CardDescription>
                            </CardHeader>
                            <CardContent>

                                <Table>
                                    <TableCaption>Список ваших последних счетов-фактур.</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Ранг</TableHead>
                                            <TableHead>Пользователь</TableHead>
                                            <TableHead>
                                                <TooltipProvider>
                                                    <TooltipCustom>
                                                        <TooltipTrigger>C/О</TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Правильные ответы</p>
                                                        </TooltipContent>
                                                    </TooltipCustom>
                                                </TooltipProvider>

                                            </TableHead>
                                            <TableHead className="text-right">Точность</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rating.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{item.rank}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <Avatar className="hidden h-9 w-9 sm:flex me-2">
                                                            <AvatarImage
                                                                src={item.profileImageUrl}
                                                                alt={`${item.username}'s profile`}
                                                            />
                                                            <AvatarFallback>
                                                                {(item.username.charAt(0) + item.username.charAt(1)).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <p>{item.username}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{item.correctAnswers}</TableCell>
                                                <TableCell
                                                    className="font-bold text-right">{item.accuracy.toFixed(2)} %</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter/>
                                </Table>
                            </CardContent>
                        </Card>
                        <Card className="w-full ">
                            <CardHeader>
                                <CardTitle>
                                    <h1 className="text-2xl font-bold">Результаты игры</h1>
                                </CardTitle>
                                <CardDescription>
                                    Вы можете поделиться ссылкой на игру с другими пользователями
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {currentGame ?
                                    <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
                                        <BarChart
                                            width={500}
                                            height={300}
                                            data={chartData}
                                        >
                                            <CartesianGrid strokeDasharray="3 3"/>
                                            <XAxis dataKey="name"/>
                                            <YAxis
                                                domain={[0, totalQuestions]}
                                                interval={0}
                                                tickCount={totalQuestions + 1}
                                            />
                                            <Tooltip content={<ChartTooltipContent/>}/>
                                            <Bar dataKey="correctAnswers" fill="hsl(var(--foreground))"/>
                                        </BarChart>
                                    </ChartContainer>
                                    : <></>}
                            </CardContent>
                        </Card>
                        <Card className="xl:hidden block ">
                            <CardHeader>
                                <CardTitle>Делиться</CardTitle>
                                <CardDescription>Вы можете поделиться ссылкой на игру с другими пользователями
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DialogShareButton link={window.location.href}/>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <Card className="xl:max-w-[340px] w-full">
                        <CardHeader>
                            <CardTitle>{currentGame?.gameName}</CardTitle>
                            <CardDescription>Морковь, морковно-томатный суп
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-2">
                                <img
                                    alt="Product image"
                                    className="aspect-square w-full rounded-md object-cover xl:block hidden"
                                    height="300"
                                    src={currentGame?.gameCoverImageUrl}
                                    width="300"
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="xl:block hidden">
                        <CardHeader>
                            <CardTitle>Делиться</CardTitle>
                            <CardDescription>Вы можете поделиться ссылкой на игру с другими пользователями
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DialogShareButton link={window.location.href}/>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Card className="w-full mt-4">
                <CardHeader>
                    <CardTitle>
                        <h1 className="text-2xl font-bold">Комментарии</h1>
                    </CardTitle>
                    <CardDescription>Здесь вы можете просмотреть комментарии других пользователей и оставить свое собственное мнение об игре
                    </CardDescription>
                </CardHeader>
                <CardContent>

                    <ScrollArea className="h-[300px]   border rounded-md">
                        {comments.length == 0 ?
                            <>
                                <div className="h-full w-full flex items-center justify-center">
                                    <h1 className="scroll-m-20 text-center text-2xl p- font-semibold tracking-tight">Там

                                        комментариев пока нет. Будьте первыми!</h1>
                                </div>
                            </>
                            :
                            <>
                                {comments.map((comment, index) => (
                                    <div key={index}
                                         className="flex ps-4 pt-3 pb-2 pe-4 justify-between gap-4 hover:bg-secondary ">
                                        <a className="flex gap-4" href={`/profile/${comment.userId}`}>
                                            <Avatar className="hidden h-9 w-9 sm:flex">
                                                <AvatarImage
                                                    src={comment.profileImageUrl}
                                                    alt={`${comment.username}'s profile`}
                                                />
                                                <AvatarFallback>
                                                    {(comment.username.charAt(0) + comment.username.charAt(1)).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="flex w-full items-">
                                                    <p className="font-medium">{comment.username}</p>
                                                    {currentGame?.hostId != comment.userId ? <></> :
                                                        <Badge variant="default" className="ms-3 text-sm">Host</Badge>
                                                    }
                                                    <p className="ms-3 text-sm opacity-45">{formatDate(new Date(comment.commentDate))}</p>
                                                </div>
                                                <p>{comment.content}</p>
                                            </div>
                                        </a>
                                        {currentGame?.hostId.toString() != user?.id ? <></> :
                                            <div className="">
                                                <Button variant="destructive"
                                                        onClick={() => deleteComment(comment.id)}>Удалить</Button>
                                            </div>
                                        }
                                    </div>
                                ))}
                            </>
                        }
                    </ScrollArea>
                    {!isCurrentUserPlayer ? <></> :
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
                </CardContent>
            </Card>
        </div>
    );
};
