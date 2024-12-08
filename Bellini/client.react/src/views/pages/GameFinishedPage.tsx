import React, {useEffect, useState} from "react";
import {FinishedGame} from "@/utils/interfaces/FinishedGame";
import {Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis} from "recharts";
import {ChartConfig, ChartContainer, ChartTooltipContent} from "@/components/ui/chart";
import {Breadcrumbs} from "@/views/partials/Breadcrumbs.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {DialogShareButton} from "@/views/partials/dialogs/DialogShareButton.tsx";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {FileType, TrendingUp, Users} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {useAuth} from "@/utils/context/authContext.tsx";
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";
import {toast} from "@/components/ui/use-toast.ts";
import {useNavigate} from "react-router-dom";
import {Comment} from "@/utils/interfaces/Comment.ts";
import {formatDate} from "@/utils/functions/formatDate";
import {Badge} from "@/components/ui/badge.tsx";
import {
    TooltipCustom,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

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
        .max(255, "The comment cannot exceed 255 characters")
        .nonempty("The comment cannot be empty"),
});

const getCorrectAnswersData = (currentGame: FinishedGame | undefined) => {
    if (!currentGame) return [];

    console.log("current game");
    console.log(currentGame);

    console.log("host id");
    console.log(currentGame.hostId);

    console.log("players");
    console.log(currentGame.players);

    return currentGame.players
        .filter(player => player.userId !== currentGame.hostId)
        .map(player => ({
            name: player.name,
            correctAnswers: currentGame.completedAnswers.filter(
                answer => answer.playerId === player.id && answer.isCorrect
            ).length
        }));
};

export const GameFinishedPage: React.FC<GameFinishedPageProps> = ({currentGame}) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [rating, setRating] = useState<GameRating[]>([]);
    const [isUpdated, setIsUpdated] = useState(false);
    const [isCurrentUserPlayer, setIsCurrentUserPlayer] = useState(false);
    const {isAuthenticated, user} = useAuth();
    const navigate = useNavigate();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentForm>({
        resolver: zodResolver(commentSchema),
    });

    useEffect(() => {
        if (isAuthenticated && user && currentGame?.players) {
            const isPlayer = currentGame.players.some(player => player.userId.toString() == user.id);
            setIsCurrentUserPlayer(isPlayer);
        }
    }, [currentGame, isAuthenticated, user]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await serverFetch(`/comments/game/${currentGame?.id}`);
                const data = await response.json();
                console.log(data);

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
                const response = await serverFetch(`/game/${currentGame?.id}/statistics`);
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

            const response = await serverFetch(`/comments/game/${currentGame?.id}`, {
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
                toast({title: "Comment Created", description: "The comment was successfully created."});
            } else {
                const responseData = await response.json();
                toast({
                    title: "Error",
                    description: responseData.message || "An error occurred.",
                    variant: "destructive"
                });
            }
        } catch (ex: unknown) {
            const errorMessage = (ex as Error).message || "An unexpected error occurred.";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            });
        }
    };

    const chartData = getCorrectAnswersData(currentGame);

    const chartConfig: ChartConfig = {
        correctAnswers: {
            label: "Correct Answers ",
            color: "hsl(var(--foreground))",
        }
    };

    const totalQuestions = currentGame?.questions.length || 0;


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
                toast({title: "Comment Deleted", description: "The comment was successfully deleted."});
            } else {
                toast({
                    title: "Error",
                    description: responseData.message || "An error occurred.",
                    variant: "destructive"
                });
            }
        } catch (ex: unknown) {
            const errorMessage = (ex as Error).message || "An unexpected error occurred.";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            });
        }
    }

    return (
        <div className="p-4 max-w-[1440px] mx-auto">
            <Breadcrumbs items={[
                {path: '/', name: 'Home'},
                {path: '/games', name: 'Games'},
                {path: `/games/${currentGame?.id}`, name: currentGame?.gameName ?? "unknown"},
            ]}/>

            <div className="flex flex-col xl:flex-row gap-4 mt-5">
                <div className="flex flex-wrap gap-4 xl:order-2 order-1">
                    <div className="flex sm:flex-row flex-col w-full gap-4">
                        <Card className="w-full">
                            <CardHeader
                                className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Maximum players
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground"/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{currentGame?.maxPlayers} player(s)</div>
                                <p className="text-xs text-muted-foreground">
                                    No more than this number of players
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="w-full">
                            <CardHeader
                                className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Game status
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">Completed</div>
                                <p className="text-xs text-muted-foreground">
                                    The game will start soon
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="w-full">
                            <CardHeader
                                className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Game room type
                                </CardTitle>
                                <FileType className="h-4 w-4 text-muted-foreground"/>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="text-2xl font-bold">{currentGame?.isPrivate ? "Private" : "Public"}</div>
                                <p className="text-xs text-muted-foreground">
                                    The game will start soon
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="flex lg:flex-row flex-col gap-4 w-full">
                        <Card className="lg:w-1/2 w-full">
                            <CardHeader>
                                <CardTitle>
                                    <h1 className="text-2xl font-bold">Rating </h1>
                                </CardTitle>
                                <CardDescription>
                                    You can share the link to the game with other users
                                </CardDescription>
                            </CardHeader>
                            <CardContent>

                                <Table>
                                    <TableCaption>A list of your recent invoices.</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Rank</TableHead>
                                            <TableHead>User</TableHead>
                                            <TableHead>
                                                <TooltipProvider>
                                                    <TooltipCustom>
                                                        <TooltipTrigger>C/A</TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Correct Answers</p>
                                                        </TooltipContent>
                                                    </TooltipCustom>
                                                </TooltipProvider>

                                            </TableHead>
                                            <TableHead className="text-right">Accuracy</TableHead>
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
                                    <h1 className="text-2xl font-bold">Game Results</h1>
                                </CardTitle>
                                <CardDescription>
                                    You can share the link to the game with other users
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
                                    <BarChart
                                        width={500}
                                        height={300}
                                        data={chartData}
                                    >
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="name"/>
                                        <YAxis domain={[0, totalQuestions]}/>
                                        <Tooltip content={<ChartTooltipContent/>}/>
                                        <Bar dataKey="correctAnswers" fill={chartConfig.correctAnswers.color}/>
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                        <Card className="xl:hidden block ">
                            <CardHeader>
                                <CardTitle>Share</CardTitle>
                                <CardDescription>
                                    You can share the link to the game with other users
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
                            <CardDescription>
                                Lipsum dolor sit amet, consectetur adipiscing elit
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
                            <CardTitle>Share</CardTitle>
                            <CardDescription>
                                You can share the link to the game with other users
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
                        <h1 className="text-2xl font-bold">Comments</h1>
                    </CardTitle>
                    <CardDescription>
                        Here you can view comments from other users and leave your own opinion about the game
                    </CardDescription>
                </CardHeader>
                <CardContent>

                    <ScrollArea className="h-[300px]   border rounded-md">
                        {comments.length == 0 ?
                            <>
                                <div className="h-full w-full flex items-center justify-center">
                                    <h1 className="scroll-m-20 text-center text-2xl p- font-semibold tracking-tight">There
                                        are no
                                        comments here yet. Be the first!</h1>
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
                                                        onClick={() => deleteComment(comment.id)}>Delete</Button>
                                            </div>
                                        }
                                    </div>
                                ))}
                            </>
                        }
                    </ScrollArea>
                    {!isCurrentUserPlayer ? <></> :
                        <form onSubmit={handleSubmit(OnSubmitCreateComment)} className="flex justify-end flex-wrap mt-4 gap-4">
                            <Textarea
                                {...register("content")}
                                placeholder="Type your message here."
                                className={`w-full ${errors.content ? "border-red-500" : ""}`}
                            />
                            {errors.content && <p className="text-red-500">{errors.content.message}</p>}
                            <Button type="submit">Send</Button>
                        </form>
                    }
                </CardContent>
            </Card>
        </div>
    );
};
