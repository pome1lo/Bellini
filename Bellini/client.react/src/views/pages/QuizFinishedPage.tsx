import React, {useState} from "react";
import {Quiz} from "@/utils/interfaces/Quiz";
import {RadialBarChart, RadialBar, PolarGrid, PolarRadiusAxis, Label} from "recharts";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {ChartConfig, ChartContainer} from "@/components/ui/chart.tsx";
import {TrendingUp} from "lucide-react";
import {DialogShareButton} from "@/views/partials/dialogs/DialogShareButton.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {formatDate} from "@/utils/functions/formatDate.ts";
import {Button} from "@/components/ui/button.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Comment} from "@/utils/interfaces/Comment.ts";
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";
import {toast} from "@/components/ui/use-toast.ts";
import {useAuth} from "@/utils/context/authContext.tsx";
import {useNavigate} from "react-router-dom";
import {Breadcrumbs} from "@/views/partials/Breadcrumbs.tsx";

interface QuizFinishedPageProps {
    currentQuiz: Quiz;
}

export const QuizFinishedPage: React.FC<QuizFinishedPageProps> = ({currentQuiz}) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [content, setContent] = useState("");
    const {isAuthenticated, user} = useAuth();
    const [isUpdated, setIsUpdated] = useState(false);
    const navigate = useNavigate();


    const totalQuestions = currentQuiz.questions.length;
    const correctAnswers = currentQuiz.quizResults?.[0]?.numberOfCorrectAnswers || 0;

    const chartData = [
        {browser: "safari", visitors: correctAnswers, fill: "var(--color-safari)"},
    ]
    const chartConfig = {
        visitors: {
            label: "Correct",
        },
        safari: {
            label: "Safari",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig

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
                    profileImageUrl: user.profileImageUrl ?? ""
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


    const breadcrumbItems = [
        {path: '/', name: 'Home'},
        {path: '/quizzes', name: 'Quizzes'},
        {path: `/quizzes/${currentQuiz?.id}`, name: currentQuiz?.gameName},
    ];

    return (
        <div className="p-4">
            <Breadcrumbs items={breadcrumbItems}/>
            <div className="h-auto lg:h-[78vh] mt-4   w-full mx-auto max-w-[1440px]">
                <div className=" lg:max-h-[660px] flex flex-col lg:flex-row gap-4 w-full">
                    <div className="flex gap-4 flex-col w-full lg:w-[20rem] ">
                        <Card className="min-w-[300px] hidden lg:block">
                            <CardHeader>
                                <CardTitle>{currentQuiz.gameName}</CardTitle>
                                <CardDescription>
                                    Lipsum dolor sit amet, consectetur adipiscing elit
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-2">
                                    <img
                                        alt="Product image"
                                        className=" aspect-square w-full rounded-md object-cover"
                                        height="300"
                                        src={currentQuiz.gameCoverImageUrl}
                                        width="300"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="hidden lg:block">
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
                    <div className="flex flex-col h-full gap-4 w-full justify-between">
                        <Card className="w-full">
                            <CardHeader
                                className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Quiz
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{currentQuiz.gameName}</div>
                                <p className="text-xs text-muted-foreground">
                                    The game finished
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="flex flex-col min-w-[400px] h-fit">
                            <CardHeader className="items-center pb-0">
                                <CardTitle>Quiz results</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 pb-0">
                                <ChartContainer
                                    config={chartConfig}
                                    className="mx-auto aspect-square max-h-[250px]"
                                >
                                    <RadialBarChart
                                        data={chartData}
                                        startAngle={0}
                                        endAngle={correctAnswers * 360 / totalQuestions}
                                        innerRadius={80}
                                        outerRadius={120}
                                    >
                                        <PolarGrid
                                            gridType="circle"
                                            radialLines={false}
                                            stroke="none"
                                            className="first:fill-muted last:fill-background"
                                            polarRadius={[86, 74]}
                                        />
                                        <RadialBar dataKey="visitors" background cornerRadius={10}/>
                                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                                            <Label
                                                content={({viewBox}) => {
                                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                        return (
                                                            <text
                                                                x={viewBox.cx}
                                                                y={viewBox.cy}
                                                                textAnchor="middle"
                                                                dominantBaseline="middle"
                                                            >
                                                                <tspan
                                                                    x={viewBox.cx}
                                                                    y={viewBox.cy}
                                                                    className="fill-foreground text-4xl font-bold"
                                                                >
                                                                    {chartData[0].visitors.toLocaleString()}
                                                                </tspan>
                                                                <tspan
                                                                    x={viewBox.cx}
                                                                    y={(viewBox.cy || 0) + 24}
                                                                    className="fill-muted-foreground"
                                                                >
                                                                    Correct
                                                                </tspan>
                                                            </text>
                                                        )
                                                    }
                                                }}
                                            />
                                        </PolarRadiusAxis>
                                    </RadialBarChart>
                                </ChartContainer>
                            </CardContent>
                            <CardFooter className="flex flex-col justify-center">
                                <h1 className="text-center text-lg font-bold">Correct
                                    answers: {correctAnswers} / {totalQuestions} </h1>
                                <p>Showing total results</p>
                            </CardFooter>
                        </Card>
                        <Card className="w-full">
                            <CardHeader
                                className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Quiz info
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">Finished</div>
                                <p className="text-xs text-muted-foreground">
                                    You have already passed this йгшя
                                </p>
                            </CardContent>
                        </Card>
                    </div>


                    <Card className="w-full h-full">
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
                                            <h1 className="scroll-m-20 text-center text-2xl w-full font-semibold tracking-tight">
                                                There are no comments<br></br> here yet. Be the first!
                                            </h1>
                                        </div>
                                    </>
                                    :
                                    <>
                                        {comments.map((comment, index) => (
                                            <div key={index}
                                                 className="flex ps-4 pt-3 pb-2 pe-4 justify-between gap-4 hover:bg-neutral-900 ">
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
                                                            <p className="ms-3 text-sm opacity-45">{formatDate(new Date(comment.commentDate))}</p>
                                                        </div>
                                                        <p>{comment.content}</p>
                                                    </div>
                                                </a>
                                            </div>
                                        ))}
                                    </>
                                }
                            </ScrollArea>
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
                        </CardContent>
                    </Card>


                </div>
            </div>
        </div>
    );
};
