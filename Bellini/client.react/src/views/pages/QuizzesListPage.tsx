import {Breadcrumbs} from "@/views/partials/Breadcrumbs.tsx";
import React, {useEffect, useState} from "react";
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";
import {GameListTabContentRowSkeleton} from "@/views/partials/skeletons/GameListTabContentRowSkeleton.tsx";
import {ActiveGame} from "@/views/partials/GamesListTabContent.tsx";
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {MoreHorizontal} from "lucide-react";
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
import {useNavigate} from "react-router-dom";
import {toast} from "@/components/ui/use-toast.ts";

const breadcrumbItems = [
    {path: '/', name: 'Home'},
    {path: '/quizzes', name: 'Quizzes'},
];

interface QuizzesListPageProps {
    tabContentName: string;
}


export const QuizzesListPage: React.FC<QuizzesListPageProps> = ({tabContentName}) => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchGames = async () => {
            setIsLoading(true);
            try {
                const response = await serverFetch(`/quizzes?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`);
                const data = await response.json();
                if (response.status === 204 || !Array.isArray(data.quizzes)) {
                    setQuizzes([]);
                } else {
                    setQuizzes(data.quizzes);
                    setTotalPages(Math.ceil(data.total / itemsPerPage));
                }
            } catch (error) {
                console.error('Error fetching games:', error.message);
                setQuizzes([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGames();
    }, [tabContentName, currentPage]);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };


    const {user, isAuthenticated} = useAuth();
    const navigate = useNavigate();

    async function handleNavigateToQuiz(id: number) {
        try {
            if (!isAuthenticated || !user) {
                navigate('/login');
            } else {
                navigate(`/quizzes/${id}`);
            }
        } catch (error) {
            console.error('Connection failed: ', error);
            toast({title: "Connection failed!", description: "Please try again.", variant: "destructive"});
        }
    }

    // if (isLoading) {
    //     return (
    //         <GameListTabContentRowSkeleton/>
    //     );
    // }
    //
    // if (quizzes.length === 0) {
    //     return (
    //         <>
    //             We didn't find anything
    //             <span>😪</span>
    //         </>
    //     );
    // }

    return (
        <div className="h-[77vh]">
            <Breadcrumbs items={breadcrumbItems}/>

            <div className="flex gap-4 flex-col lg:flex-row w-full">
                <Card className="w-full lg:w-1/2">
                    <CardHeader>
                        <CardTitle>Quizzes</CardTitle>
                        <CardDescription>
                            description description description
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-auto rounded-md">
                            <Table>
                                <TableBody>
                                    {quizzes.map((item) => (
                                        <TableRow onClick={() => handleNavigateToQuiz(item.id)} key={item.id}>
                                            <TableCell>
                                                <img
                                                    alt={item.gameName + " image"}
                                                    className="aspect-square border rounded-md object-cover"
                                                    height="64"
                                                    src={item.gameCoverImageUrl}
                                                    width="64"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {item.gameName}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <Badge variant="secondary">прошел</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            aria-haspopup="true"
                                                            size="icon"
                                                            variant="ghost"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4"/>
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter>
                        <div className="flex justify-between w-full items-center">
                            <div className="text-xs text-muted-foreground">
                                Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> - <strong>{Math.min(currentPage * itemsPerPage, quizzes.length)}</strong> of <strong>{totalPages * itemsPerPage}</strong> quizzes
                            </div>
                            <div>
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationPrevious
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        />
                                        {currentPage > 2 && (
                                            <PaginationItem>
                                                <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
                                            </PaginationItem>
                                        )}
                                        {currentPage > 3 && <PaginationEllipsis/>}
                                        {currentPage > 1 && (
                                            <PaginationItem>
                                                <PaginationLink
                                                    onClick={() => handlePageChange(currentPage - 1)}>{currentPage - 1}</PaginationLink>
                                            </PaginationItem>
                                        )}
                                        <PaginationItem>
                                            <PaginationLink isActive>{currentPage}</PaginationLink>
                                        </PaginationItem>
                                        {currentPage < totalPages && (
                                            <PaginationItem>
                                                <PaginationLink
                                                    onClick={() => handlePageChange(currentPage + 1)}>{currentPage + 1}</PaginationLink>
                                            </PaginationItem>
                                        )}
                                        {currentPage < totalPages - 2 && <PaginationEllipsis/>}
                                        {currentPage < totalPages - 1 && (
                                            <PaginationItem>
                                                <PaginationLink
                                                    onClick={() => handlePageChange(totalPages)}>{totalPages}</PaginationLink>
                                            </PaginationItem>
                                        )}
                                        <PaginationNext
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        />
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </div>
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