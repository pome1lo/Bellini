import React, {useEffect, useState} from "react";
import {Quiz} from "@/utils/interfaces/Quiz.ts";
import {RadialBarChart, RadialBar, PolarGrid, PolarRadiusAxis, Label} from "recharts";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {ChartConfig, ChartContainer} from "@/components/ui/chart.tsx";
import {TrendingUp} from "lucide-react";
import {DialogShareButton} from "@/components/dialogs/dialogShareButton.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {formatDate} from "@/utils/functions/formatDate.ts";
import {Button} from "@/components/ui/button.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Comment} from "@/utils/interfaces/Comment.ts";
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";
import {toast} from "@/components/ui/use-toast.tsx";
import {useAuth} from "@/utils/context/authContext.tsx";
import {useNavigate} from "react-router-dom";
import {Breadcrumbs} from "@/components/breadcrumbs.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {authFetch} from "@/utils/fetchs/authFetch.ts";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import {Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {TooltipContent, TooltipCustom, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";

interface QuizFinishedPageProps {
    currentQuiz: Quiz;
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

export const QuizFinishedPage: React.FC<QuizFinishedPageProps> = ({currentQuiz}) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const {user, getAccessToken, logout, isAuthenticated} = useAuth();
    const [isUpdated, setIsUpdated] = useState(false);
    const navigate = useNavigate();
    const {register, handleSubmit, reset, formState: {errors}} = useForm<CommentForm>({
        resolver: zodResolver(commentSchema),
    });

    const totalQuestions = currentQuiz.questions.length;

    useEffect(() => {
        console.error(currentQuiz);

        const fetchComments = async () => {
            try {
                const response = await serverFetch(`/comments/quiz/${currentQuiz?.id}`);
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
    }, [currentQuiz, isUpdated]);

    const replayQuiz = async () => {
        try {
            const response = await authFetch(`/quizzes/${currentQuiz?.id}/replay`, getAccessToken, logout, {method: "POST"})

            if (response.status === 204) {
                window.location.reload();
            } else {
                window.location.reload();
            }
        } catch (ex: unknown) {
            console.error('Error fetching replay quiz:', (ex as Error).message);
        }
    }

    const onSubmit = async (data: CommentForm) => {
        if (!isAuthenticated || !user) {
            navigate('/login');
            return;
        }

        try {
            const response = await authFetch(`/comments/quiz/${currentQuiz.id}`, getAccessToken, logout, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    gameId: currentQuiz.id,
                    userId: user.id,
                    content: data.content,
                    username: user.username,
                    profileImageUrl: user.profileImageUrl ?? "",
                }),
            });

            if (response.ok) {
                toast({title: "Comment Created", description: "The comment was successfully created."});
                reset();
                setIsUpdated(!isUpdated);
            } else {
                const responseData = await response.json();
                toast({
                    title: "Error",
                    description: responseData.message || "An error occurred.",
                    variant: "destructive"
                });
            }
        } catch (error: unknown) {
            const errorMessage = (error as Error).message || "An unexpected error occurred.";
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
        <div className="grid mt-2 flex-1 items-start gap-4 sm:py-0 md:gap-8 max-w-[1440px] w-full mx-auto">
            <Breadcrumbs items={breadcrumbItems}/>
            <div className="mt-4 w-full mx-auto max-w-[1440px]">
                <div className="flex flex-col gap-y-4 w-full">
                    <div className="flex">
                        <div className="flex gap-4 hidden lg:block flex-col w-full lg:w-[20rem] me-4">
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
                                    <Button className="mt-4 w-full" onClick={replayQuiz}>Replay the quiz</Button>
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
                        <div className="flex flex-col h-full gap-4 w-full lg:justify-between">
                            <div className="flex-col space-x-0 lg:space-x-4 lg:space-y-0 space-y-4 lg:flex-row flex">
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
                                            You have already passed this
                                        </p>
                                        <Button className="mt-4 w-full lg:hidden block" onClick={replayQuiz}>Replay the quiz</Button>
                                    </CardContent>
                                </Card>
                            </div>
                            <Card className="flex flex-col min-w-[400px] h-fit">
                                <CardHeader className="pb-0">
                                    <CardTitle>Quiz results</CardTitle>
                                    <CardDescription>adasdasdasdasad as dasdas da sdasdas</CardDescription>
                                </CardHeader>
                                <CardContent className="flex lg:flex-row flex-col pb-0">
                                    <Carousel className="ms-[40px] w-full max-h-[600px] max-w-[90%] lg:max-w-[400px] me-[65px]">
                                        <CarouselContent>
                                            {currentQuiz.quizResults.map((result, index) => {
                                                const correctAnswers = result.numberOfCorrectAnswers || 0;
                                                const chartData = [{browser: "safari", visitors: correctAnswers, fill: "hsl(var(--foreground))"}];
                                                const chartConfig: ChartConfig = {visitors: {label: "Correct",}};

                                                return (
                                                    <CarouselItem key={index} className="border-0 ">
                                                        <Card className="border-0 shadow-none p-0">
                                                            <CardContent className="flex flex-col p-0 w-full lg:aspect-square items-center justify-center">
                                                                <ChartContainer config={chartConfig} className="mx-auto w-full h-full  max-h-[250px]">
                                                                    <RadialBarChart
                                                                        width={200}
                                                                        height={200}
                                                                        data={chartData}
                                                                        startAngle={0}
                                                                        endAngle={(correctAnswers * 360) / totalQuestions}
                                                                        innerRadius={80}
                                                                        outerRadius={120}
                                                                    >
                                                                        <PolarGrid gridType="circle" radialLines={false} stroke="none" polarRadius={[86, 74]}/>
                                                                        <RadialBar dataKey="visitors" background cornerRadius={10}/>
                                                                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                                                                            <Label
                                                                                content={({viewBox}) => {
                                                                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                                                        return (
                                                                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                                                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-4xl font-bold">
                                                                                                    {correctAnswers}
                                                                                                </tspan>
                                                                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                                                                                    Correct
                                                                                                </tspan>
                                                                                            </text>
                                                                                        );
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </PolarRadiusAxis>
                                                                    </RadialBarChart>
                                                                </ChartContainer>
                                                            </CardContent>
                                                            <CardFooter className="flex flex-col justify-center">
                                                                <h1 className="text-center text-lg font-bold">Correct answers: {correctAnswers} / {totalQuestions} </h1>
                                                                <p>Showing total results</p>
                                                            </CardFooter>
                                                        </Card>
                                                    </CarouselItem>
                                                );
                                            })}


                                        </CarouselContent>
                                        <CarouselPrevious/>
                                        <CarouselNext/>
                                    </Carousel>
                                    <Table>
                                        <TableCaption>The table with the attempt to complete the quiz</TableCaption>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>№</TableHead>
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
                                                <TableHead>Questions</TableHead>
                                                <TableHead className="text-right">Accuracy</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {currentQuiz.quizResults.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                                    <TableCell className="font-medium">{item.numberOfCorrectAnswers}</TableCell>
                                                    <TableCell className="font-medium">{item.numberOfQuestions}</TableCell>
                                                    <TableCell className="font-medium text-right">{(item.numberOfCorrectAnswers * 100 / item.numberOfQuestions)} %</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        <TableFooter/>
                                    </Table>
                                </CardContent>

                            </Card>

                        </div>
                    </div>
                    <div>
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
                                            <div className="h-[280px] w-full flex items-center justify-center">
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
                                                            <p className="max-w-[418px]">{comment.content}</p>
                                                        </div>
                                                    </a>
                                                </div>
                                            ))}
                                        </>
                                    }
                                </ScrollArea>
                                <form onSubmit={handleSubmit(onSubmit)} className="flex justify-end flex-wrap mt-4 gap-4">
                                    <Textarea
                                        {...register("content")}
                                        placeholder="Type your message here."
                                        className={`w-full ${errors.content ? "border-red-500" : ""}`}
                                    />
                                    {errors.content && <p className="text-red-500">{errors.content.message}</p>}
                                    <Button type="submit">Отправить</Button>
                                </form>
                            </CardContent>
                        </Card>

                    </div>

                </div>
            </div>
        </div>
    );
};
