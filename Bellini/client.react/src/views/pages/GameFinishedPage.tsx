import React from "react";
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
import {GameRoomSkeleton} from "@/views/partials/skeletons/GameRoomSkeleton.tsx";

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
    // Данные для диаграммы
    const chartData = getCorrectAnswersData(currentGame);

    // Настройки диаграммы
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
        // <div className="bg-muted/40 p-4">
        //     <Breadcrumbs items={breadcrumbItems}/>
        //
        //     <div className="flex flex-col xl:flex-row gap-4 mt-5">
        //         <div className="flex flex-wrap gap-4 xl:order-2 order-1">
        //             <div className="flex sm:flex-row flex-col w-full gap-4">
        //                 <Card className="w-full">
        //                     <CardHeader
        //                         className="flex flex-row items-center justify-between space-y-0 pb-2">
        //                         <CardTitle className="text-sm font-medium">
        //                             Maximum players
        //                         </CardTitle>
        //                         <Users className="h-4 w-4 text-muted-foreground"/>
        //                     </CardHeader>
        //                     <CardContent>
        //                         <div className="text-2xl font-bold">{currentGame?.maxPlayers} player(s)</div>
        //                         <p className="text-xs text-muted-foreground">
        //                             No more than this number of players
        //                         </p>
        //                     </CardContent>
        //                 </Card>
        //                 <Card className="w-full">
        //                     <CardHeader
        //                         className="flex flex-row items-center justify-between space-y-0 pb-2">
        //                         <CardTitle className="text-sm font-medium">
        //                             Game status
        //                         </CardTitle>
        //                         <TrendingUp className="h-4 w-4 text-muted-foreground"/>
        //                     </CardHeader>
        //                     <CardContent>
        //                         <div className="text-2xl font-bold">Completed</div>
        //                         <p className="text-xs text-muted-foreground">
        //                             The game will start soon
        //                         </p>
        //                     </CardContent>
        //                 </Card>
        //                 <Card className="w-full">
        //                     <CardHeader
        //                         className="flex flex-row items-center justify-between space-y-0 pb-2">
        //                         <CardTitle className="text-sm font-medium">
        //                             Game room type
        //                         </CardTitle>
        //                         <FileType className="h-4 w-4 text-muted-foreground"/>
        //                     </CardHeader>
        //                     <CardContent>
        //                         <div
        //                             className="text-2xl font-bold">{currentGame?.isPrivate ? "Private" : "Public"}</div>
        //                         <p className="text-xs text-muted-foreground">
        //                             The game will start soon
        //                         </p>
        //                     </CardContent>
        //                 </Card>
        //             </div>
        //             <div className="flex lg:flex-row flex-col gap-4 w-full">
        //                 <Card className="lg:w-1/2 w-full">
        //                     <CardHeader>
        //                         <CardTitle>
        //                             <h1 className="text-2xl font-bold mb-4">Players</h1>
        //                         </CardTitle>
        //                         <CardDescription>
        //                             You can share the link to the game with other users
        //                         </CardDescription>
        //                     </CardHeader>
        //                     <CardContent>
        //
        //                         <Table>
        //                             <TableCaption>A list of your recent invoices.</TableCaption>
        //                             <TableHeader>
        //                                 <TableRow>
        //                                     <TableHead className="w-[100px]">Name</TableHead>
        //                                     <TableHead>Status</TableHead>
        //                                     <TableHead>Method</TableHead>
        //                                     <TableHead className="text-right">Amount</TableHead>
        //                                 </TableRow>
        //                             </TableHeader>
        //                             <TableBody>
        //                                 {currentGame?.players.map((player, index) => (
        //                                     <TableRow key={index}>
        //                                         <TableCell className="font-medium">{player.name}</TableCell>
        //                                         <TableCell>{player.score}</TableCell>
        //                                         {/*<TableCell>{invoice.paymentMethod}</TableCell>*/}
        //                                         {/*<TableCell className="text-right">{invoice.totalAmount}</TableCell>*/}
        //                                     </TableRow>
        //                                 ))}
        //                             </TableBody>
        //                             <TableFooter>
        //                                 <TableRow>
        //                                     <TableCell colSpan={3}>Total</TableCell>
        //                                     <TableCell className="text-right">$2,500.00</TableCell>
        //                                 </TableRow>
        //                             </TableFooter>
        //                         </Table>
        //                     </CardContent>
        //                 </Card>
        //                 <Card className="w-full ">
        //                     <CardHeader>
        //                         <CardTitle>
        //                             <h1 className="text-2xl font-bold mb-4">Game Results</h1>
        //                         </CardTitle>
        //                         <CardDescription>
        //                             You can share the link to the game with other users
        //                         </CardDescription>
        //                     </CardHeader>
        //                     <CardContent>
        //                         <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
        //                             <BarChart
        //                                 width={500}
        //                                 height={300}
        //                                 data={chartData}
        //                             >
        //                                 <CartesianGrid strokeDasharray="3 3"/>
        //                                 <XAxis dataKey="name"/>
        //                                 <YAxis domain={[0, totalQuestions]}/>
        //                                 <Tooltip content={<ChartTooltipContent/>}/>
        //                                 <Bar dataKey="correctAnswers" fill={chartConfig.correctAnswers.color}/>
        //                             </BarChart>
        //                         </ChartContainer>
        //                     </CardContent>
        //                 </Card>
        //                 <Card className="xl:hidden block ">
        //                     <CardHeader>
        //                         <CardTitle>Share</CardTitle>
        //                         <CardDescription>
        //                             You can share the link to the game with other users
        //                         </CardDescription>
        //                     </CardHeader>
        //                     <CardContent>
        //                         <DialogShareButton link={window.location.href}/>
        //                     </CardContent>
        //                 </Card>
        //             </div>
        //         </div>
        //         <div className="flex flex-col gap-4">
        //             <Card className="xl:max-w-[340px] w-full">
        //                 <CardHeader>
        //                     <CardTitle>{currentGame?.gameName}</CardTitle>
        //                     <CardDescription>
        //                         Lipsum dolor sit amet, consectetur adipiscing elit
        //                     </CardDescription>
        //                 </CardHeader>
        //                 <CardContent>
        //                     <div className="grid gap-2">
        //                         <img
        //                             alt="Product image"
        //                             className="aspect-square w-full rounded-md object-cover xl:block hidden"
        //                             height="300"
        //                             src={currentGame?.gameCoverImageUrl}
        //                             width="300"
        //                         />
        //                     </div>
        //                 </CardContent>
        //             </Card>
        //             <Card className="xl:block hidden">
        //                 <CardHeader>
        //                     <CardTitle>Share</CardTitle>
        //                     <CardDescription>
        //                         You can share the link to the game with other users
        //                     </CardDescription>
        //                 </CardHeader>
        //                 <CardContent>
        //                     <DialogShareButton link={window.location.href}/>
        //                 </CardContent>
        //             </Card>
        //         </div>
        //     </div>
        // </div>
        <GameRoomSkeleton/>
    );
};
