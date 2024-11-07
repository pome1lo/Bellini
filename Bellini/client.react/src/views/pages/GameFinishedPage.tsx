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

interface GameFinishedPageProps {
    currentGame?: FinishedGame;
}

// Функция для подсчета количества правильных ответов каждого игрока
const getCorrectAnswersData = (currentGame: FinishedGame | undefined) => {
    if (!currentGame) return [];

    return currentGame.players.map(player => ({
        name: player.name,
        correctAnswers: currentGame.completedAnswers.filter(
            answer => answer.playerId === player.id && answer.isCorrect
        ).length
    }));
};

export const GameFinishedPage: React.FC<GameFinishedPageProps> = ({currentGame}) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [content, setContent] = useState("");
    const [isUpdated, setIsUpdated] = useState(false);
    const [isCurrentUserPlayer, setIsCurrentUserPlayer] = useState(false);
    const {isAuthenticated, user} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && user && currentGame?.players) {
            const isPlayer = currentGame.players.some(player => player.userId == user.id);
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

    const OnSubmitCreateComment = async (event) => {
        event.preventDefault()
        try {
            if (!isAuthenticated || !user) {
                navigate('/login');
                return;
            }

            const response = await serverFetch(`/comments/${currentGame?.id}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    gameId: currentGame?.id,
                    userId: user.id,
                    content: content,
                    username: user.username,
                    profileImageUrl: user.profileImageUrl
                }),
            });

            const responseData = await response.json();

            if (response.ok) {
                setIsUpdated(!isUpdated);
                setContent("");
                toast({title: "Comment Created", description: "The comment was successfully created."});
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
    };

    const chartData = getCorrectAnswersData(currentGame);

    const chartConfig: ChartConfig = {
        correctAnswers: {
            label: "Correct Answers ",
            color: "hsl(var(--foreground))",
        }
    };

    const totalQuestions = currentGame?.questions.length || 0;

    const breadcrumbItems = [
        {path: '/', name: 'Home'},
        {path: '/games', name: 'Games'},
        {path: `/games/${currentGame?.id}`, name: currentGame?.gameName},
    ];


    return (
        <div className="bg-muted/40 p-4">
            <Breadcrumbs items={breadcrumbItems}/>

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
                                    <h1 className="text-2xl font-bold">Players</h1>
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
                                            <TableHead className="w-[100px]">Name</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Method</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentGame?.players.map((player, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{player.name}</TableCell>
                                                <TableCell>{player.score}</TableCell>
                                                {/*<TableCell>{invoice.paymentMethod}</TableCell>*/}
                                                {/*<TableCell className="text-right">{invoice.totalAmount}</TableCell>*/}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={3}>Total</TableCell>
                                            <TableCell className="text-right">$2,500.00</TableCell>
                                        </TableRow>
                                    </TableFooter>
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
                                <div className="h-[170px] flex items-center justify-center">
                                    <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">There are no
                                        comments here yet. Be the first!</h1>
                                </div>
                            </>
                            :
                            <>
                                {comments.map((comment, index) => (
                                    <a href={`/profile/${comment.userId}`} key={index} className="flex ps-4 pt-3 pb-2 pe-4 justify-between gap-4 hover:bg-neutral-900 ">
                                        <div className="flex gap-4">
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
                                                    <p className="ms-3 text-sm opacity-45">{formatDate(new Date(comment.commentDate))}</p>
                                                </div>
                                                <p>{comment.content}</p>
                                            </div>
                                        </div>
                                        <Button variant="destructive">Delete</Button>
                                    </a>
                                ))}
                            </>
                        }
                    </ScrollArea>
                    {!isCurrentUserPlayer ? <></> :
                        <form className="flex justify-end flex-wrap mt-4 gap-4" onSubmit={OnSubmitCreateComment}>
                            <Textarea
                                placeholder="Type your message here."
                                className="w-full" required
                                onChange={(e) => {
                                    setContent(e.target.value)
                                }}
                            />
                            <Button type="submit">Send</Button>
                        </form>
                    }
                </CardContent>
            </Card>
        </div>
    );
};
