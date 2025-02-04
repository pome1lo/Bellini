import React, {useEffect, useState} from "react";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
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
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.tsx";
import {Quiz} from "@/utils/interfaces/Quiz.ts";
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";
import {useAuth} from "@/utils/context/authContext.tsx";
import {useNavigate} from "react-router-dom";
import {toast} from "@/components/ui/use-toast.tsx";
import {QuizListSkeleton} from "@/components/skeletons/quizListSkeleton.tsx";

interface QuizzesListTabContentProps {
    tabContentName: string;
    isUpdated: boolean;
}

export const QuizzesListTabContent: React.FC<QuizzesListTabContentProps> = ({tabContentName, isUpdated}) => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchGames = async () => {
            setIsLoading(true);
            try {
                const response = await serverFetch(`/quizzes?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}${!isAuthenticated || !user ? "" : "&userId=" + user.id}`);
                const data = await response.json();
                if (response.status === 204 || !Array.isArray(data.quizzes)) {
                    setQuizzes([]);
                    console.error('# Status:', response.status);
                    console.error('# Message:', data.message);
                    console.error('# data:', data);
                } else {
                    setQuizzes(data.quizzes);
                    setTotalPages(Math.ceil(data.total / itemsPerPage));
                }
            } catch (error: unknown) {
                console.error('Error fetching games:', (error as Error).message);
                setQuizzes([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGames();
    }, [tabContentName, currentPage, isUpdated]);

    useEffect(() => {
        // Логика фильтрации квизов в зависимости от выбранной вкладки
        let filtered: Quiz[] = [];
        switch (tabContentName) {
            case 'completed': filtered = quizzes.filter((quiz) => quiz.hasUserCompleted);  break;
            case 'new':       filtered = quizzes.filter((quiz) => !quiz.hasUserCompleted); break;
            case 'all':
            default:
                filtered = quizzes;
                break;
        }
        setFilteredQuizzes(filtered);
    }, [tabContentName, quizzes]);

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
                navigate(`/quizzes/room/${id}`);
            }
        } catch (error) {
            console.error('Connection failed: ', error);
            toast({title: "Connection failed!", description: "Please try again.", variant: "destructive"});
        }
    }


    if (isLoading) {
        return  <>
            <QuizListSkeleton/>
            <QuizListSkeleton/>
            <QuizListSkeleton/>
            <QuizListSkeleton/>
            <QuizListSkeleton/>
            <QuizListSkeleton/>
        </>;
    }

    return (
        <>
            <ScrollArea className="h-auto rounded-md">
                <Table>
                    <TableBody>
                        {filteredQuizzes.length == 0 ?
                            <div className="h-[170px] flex items-center justify-center">
                                <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">There
                                    are no quizzes yet... 😪</h1>
                            </div>
                            :
                            <>
                                {filteredQuizzes.map((item) => (
                                    <TableRow>
                                        <TableCell onClick={() => handleNavigateToQuiz(item.id)} key={item.id} className="cursor-pointer">
                                            <img
                                                alt={item.gameName + " image"}
                                                className="min-w-[50px] aspect-square border rounded-md object-cover"
                                                height="64"
                                                src={item.gameCoverImageUrl}
                                                width="64"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium cursor-pointer" onClick={() => handleNavigateToQuiz(item.id)} key={item.id}>
                                            {item.gameName}
                                        </TableCell>
                                        <TableCell className="font-medium text-center">
                                            {!isAuthenticated || !user ? <></>
                                                : <>
                                                    {item.hasUserCompleted ?
                                                        <Badge variant="secondary">Completed</Badge>
                                                        :
                                                        <Badge>New</Badge>
                                                    }
                                                </>
                                            }
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
                                                    <DropdownMenuItem onClick={() => handleNavigateToQuiz(item.id)} key={item.id} className="cursor-pointer">Visit</DropdownMenuItem>
                                                    {user?.isAdmin ? 
                                                        <>
                                                            <DropdownMenuItem onClick={() => alert("adsasd")}>Edit</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => alert("adsasd")}>Delete</DropdownMenuItem>    
                                                        </>
                                                    : <></>}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        }

                    </TableBody>
                </Table>
            </ScrollArea>
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
        </>
    )
}