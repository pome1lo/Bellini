import {Breadcrumbs} from "@/components/breadcrumbs.tsx";
import {useEffect, useState} from "react";
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table.tsx";
import {Button} from "@/components/ui/button.tsx";
import {RefreshCcw} from "lucide-react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {useAuth} from "@/utils/context/authContext.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {QuizzesListTabContent} from "@/components/quizzesListTabContent.tsx";

const breadcrumbItems = [
    {path: '/', name: 'Домой'},
    {path: '/quizzes', name: 'Викторины'},
];

interface RatingItem {
    rank: number;
    username: string;
    email: string;
    correctAnswers: number;
    totalQuestions: number;
    accuracy: number;
    endTime: Date;
}

export const QuizzesListPage = () => {
    const [isUpdated, setIsUpdated] = useState<boolean>(false);
    const {tabName} = useParams();
    const {isAuthenticated, user} = useAuth();
    const navigate = useNavigate();
    const [rating, setRating] = useState<RatingItem[]>([]); 

    const validTabs = ["all", "new", "completed"];

    useEffect(() => {
        if (tabName) {
            if (!validTabs.includes(tabName)) {
                navigate('/404');
            }
        }
    }, [tabName, navigate]);

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const response = await serverFetch(`/quizzes/rating`);
                const data = await response.json();
                console.log(data);
                if (response.status === 204 || !Array.isArray(data)) {
                    setRating([]);
                } else {
                    setRating(data);
                }
            } catch (error: unknown) {
                console.error('Error fetching players rating:', (error as Error).message);
                setRating([]);
            }
        };

        fetchRating();
    }, [isUpdated]);

    return (
        <div className="">
            <Breadcrumbs items={breadcrumbItems}/>

            <div className="flex gap-4 flex-col lg:flex-row w-full max-w-[1440px] mx-auto">
                <Card className="w-full lg:w-1/2">
                    <CardHeader>
                        <CardTitle>Викторины</CardTitle>
                        <CardDescription>
                            Здесь вы увидите доступные тесты для выбранной вами категории
                        </CardDescription>
                    </CardHeader>
                    <CardContent>


                        <Tabs defaultValue={tabName && validTabs.includes(tabName) ? tabName : "all"}>
                            <div className="flex items-center">
                                <TabsList>
                                    <TabsTrigger value="all">Все</TabsTrigger>
                                    {!isAuthenticated || !user ? <></> :
                                        <>
                                            <TabsTrigger value="new">Новое</TabsTrigger>
                                            <TabsTrigger value="completed">Завершенные</TabsTrigger>
                                        </>
                                    }
                                </TabsList>
                                <div className="ml-auto flex items-center gap-2">
                                    <Button size="sm" variant="outline" className="h-8 gap-1"
                                            onClick={() => setIsUpdated(!isUpdated)}>
                                        <RefreshCcw className="h-3.5 w-3.5"/>
                                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Обновить</span>
                                    </Button>
                                </div>
                            </div>
                            <TabsContent value="all">
                                <QuizzesListTabContent tabContentName="all" isUpdated={isUpdated}/>
                            </TabsContent>
                            <TabsContent value="new">
                                <QuizzesListTabContent tabContentName="new" isUpdated={isUpdated}/>
                            </TabsContent>
                            <TabsContent value="completed">
                                <QuizzesListTabContent tabContentName="completed" isUpdated={isUpdated}/>
                            </TabsContent>
                        </Tabs>


                    </CardContent>
                    <CardFooter>

                    </CardFooter>
                </Card>
                <Card className="w-full lg:w-1/2">
                    <CardHeader>
                        <CardTitle>Рейтинги игроков</CardTitle>
                        <CardDescription>
                            Вот рейтинг 10 лучших игроков
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-8">
                        {rating.length == 0 ?
                            <div className="h-[170px] flex items-center justify-center">
                                <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">Там
                                    пока нет пользователей с рейтингом... 😪</h1>
                            </div>
                            :
                            <Table>
                                <TableCaption>Вот рейтинг 10 лучших игроков.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ранг</TableHead>
                                        <TableHead>Имя пользователя</TableHead>
                                        <TableHead>Правильные ответы</TableHead>
                                        <TableHead>Всего вопросов</TableHead>
                                        <TableHead className="text-right">Точность</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rating.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-bold">{item.rank}</TableCell>
                                            <TableCell>{item.username}</TableCell>
                                            <TableCell>{item.correctAnswers}</TableCell>
                                            <TableCell>{item.totalQuestions}</TableCell>
                                            <TableCell className="font-bold text-right">{item.accuracy} %</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                        }


                    </CardContent>
                    <CardFooter>

                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}