import React from "react";
import { Quiz } from "@/utils/interfaces/Quiz";
import { RadialBarChart, RadialBar, PolarGrid, PolarRadiusAxis, Label } from "recharts";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {ChartConfig, ChartContainer} from "@/components/ui/chart.tsx";
import {TrendingUp} from "lucide-react";
import {DialogShareButton} from "@/views/partials/dialogs/DialogShareButton.tsx";

interface QuizFinishedPageProps {
    currentQuiz: Quiz;
}

export const QuizFinishedPage: React.FC<QuizFinishedPageProps> = ({ currentQuiz }) => {
    const totalQuestions = currentQuiz.questions.length;
    const correctAnswers = currentQuiz.quizResults?.[0]?.numberOfCorrectAnswers || 0;

    const chartData = [
        { browser: "safari", visitors: correctAnswers, fill: "var(--color-safari)" },
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

    return (
        <div className="h-[78vh] flex">
            <div className="flex gap-4 flex-col w-full lg:w-[20rem] ">
                <Card>
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
                                className="hidden lg:block aspect-square w-full rounded-md object-cover"
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

            <div>
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
                            You have already passed this йгшя
                        </p>
                    </CardContent>
                </Card>
                <Card className="w-full">
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Questions
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalQuestions}</div>
                        <p className="text-xs text-muted-foreground">
                            The number of questions in the quiz
                        </p>
                    </CardContent>
                </Card>
                <Card className="w-full">
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Correct Questions
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{correctAnswers}</div>
                        <p className="text-xs text-muted-foreground">
                            The number of correct questions
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
