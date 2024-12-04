import {Breadcrumbs} from "@/views/partials/Breadcrumbs.tsx";
import React, {useEffect, useState} from "react";
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";
import {GameListTabContentRowSkeleton} from "@/views/partials/skeletons/GameListTabContentRowSkeleton.tsx";
import {ActiveGame, GamesListTabContent} from "@/views/partials/GamesListTabContent.tsx";
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {
    DropdownMenu, DropdownMenuCheckboxItem,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ListFilter, MoreHorizontal, RefreshCcw} from "lucide-react";
import {GameListItem} from "@/views/partials/GameListItem.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Quiz} from "@/utils/interfaces/Quiz.ts";
import {useAuth} from "@/utils/context/authContext.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "@/components/ui/use-toast.ts";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {DialogCreateGame} from "@/views/partials/dialogs/DialogCreateGame.tsx";
import {QuizzesListTabContent} from "@/views/partials/QuizzesListTabContent.tsx";

const breadcrumbItems = [
    {path: '/', name: 'Home'},
    {path: '/quizzes', name: 'Quizzes'},
];

export const QuizzesListPage = () =>{
    const [isUpdated, setIsUpdated] = useState<boolean>(false);
    const {tabName} = useParams();
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const validTabs = ["all", "new", "completed"];

    useEffect(() => {
        if (tabName) {
            if (!validTabs.includes(tabName)) {
                navigate('/404');
            }
        }
    }, [tabName, navigate]);

    useEffect(() => {
        const fetchGames = async () => {
            setIsLoading(true);
            try {
                const response = await serverFetch(`/quizzes?limit=100&offset=0`);
                const data = await response.json();
                console.log(data);
                if (response.status === 204 || !Array.isArray(data.quizzes)) {
                    setQuizzes([]);
                } else {
                    setQuizzes(data.quizzes);
                }
            } catch (error) {
                console.error('Error fetching games:', error.message);
                setQuizzes([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGames();
    }, [isUpdated]);

    return (
        <div className="h-[77vh]">
            <Breadcrumbs items={breadcrumbItems}/>

            <div className="flex gap-4 flex-col lg:flex-row w-full max-w-[1440px] mx-auto">
                <Card className="w-full lg:w-1/2">
                    <CardHeader>
                        <CardTitle>Quizzes</CardTitle>
                        <CardDescription>
                            Here you will see the available quizzes for your chosen category
                        </CardDescription>
                    </CardHeader>
                    <CardContent>


                        <Tabs defaultValue={tabName && validTabs.includes(tabName) ? tabName : "all"}>
                            <div className="flex items-center">
                                <TabsList>
                                    <TabsTrigger value="all">All</TabsTrigger>
                                    <TabsTrigger value="new">New</TabsTrigger>
                                    <TabsTrigger value="completed">Completed</TabsTrigger>
                                </TabsList>
                                <div className="ml-auto flex items-center gap-2">
                                    <Button size="sm" variant="outline" className="h-8 gap-1"
                                            onClick={() => setIsUpdated(!isUpdated)}>
                                        <RefreshCcw className="h-3.5 w-3.5"/>
                                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Update</span>
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
                        <CardTitle>Rating</CardTitle>
                        <CardDescription>
                            Players connected to this game room
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-8">
                        <ScrollArea className="h-[220px] w-full rounded-md border p-4">

                            <>
                                <div className="h-[170px] flex items-center justify-center">
                                    <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">There
                                        are no connected users yet... 😪</h1>
                                </div>
                            </>

                        </ScrollArea>
                    </CardContent>
                    <CardFooter>

                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}