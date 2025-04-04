import React, {useState, useEffect} from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis
} from "@/components/ui/pagination.tsx";
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";
import {GameListItem} from "@/components/gameListItem.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Table, TableBody} from "@/components/ui/table.tsx";
import {GameListTabContentRowSkeleton} from "@/components/skeletons/gameListTabContentRowSkeleton.tsx";
import {GameListTabContentNotFoundSkeleton} from "@/components/skeletons/gameListTabContentNotFoundSkeleton.tsx";
import {Game} from "@/utils/interfaces/Game.ts";


interface GamesListTabContentProps {
    tabContentName: string;
    isUpdated: boolean;
    isCreated: boolean;
}

export const GamesListTabContent: React.FC<GamesListTabContentProps> = ({tabContentName, isUpdated, isCreated}) => {
    const [games, setGames] = useState<Game[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchGames = async () => {
            setIsLoading(true);
            try {
                const response = await serverFetch(`/game/${tabContentName}?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`);
                const data = await response.json();
                if (response.status === 204 || !Array.isArray(data.games)) {
                    setGames([]);
                } else {
                    setGames(data.games);
                    console.log(data)
                    setTotalPages(Math.ceil(data.total / itemsPerPage));
                }
            } catch (error: unknown) {
                console.error('Error fetching games:', (error as Error).message);
                setGames([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGames();
    }, [isUpdated, isCreated, tabContentName, currentPage]);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (isLoading) {
        return <GameListTabContentRowSkeleton
            title="Игры"
            items={[ ]}
            description="Здесь вы увидите доступные игры для выбранной вами категории">
        </GameListTabContentRowSkeleton>;
    }

    if (games.length === 0) {
        return <GameListTabContentNotFoundSkeleton/>;
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Игры</CardTitle>
                    <CardDescription>
                        Здесь вы увидите доступные игры для выбранной вами категории
                    </CardDescription>
                </CardHeader>
                <CardContent  className="min-h-[500px]">
                    <Table>
                        <TableBody >
                            {games.map((item) => (
                                <GameListItem
                                    key={item.id}
                                    id={item.id}
                                    hostId={item.hostId}
                                    maxPlayers={item.maxPlayers}
                                    gameName={item.gameName}
                                    isPrivate={item.isPrivate}
                                    startTime={item.createTime}
                                    status={item.gameStatus.name}
                                    gameCoverImageUrl={item.gameCoverImageUrl}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter>
                    <div className="flex justify-between w-full items-center">
                        <div className="text-xs text-muted-foreground">
                            Показать <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> - <strong>{Math.min(currentPage * itemsPerPage, games.length)}</strong> из <strong>{totalPages * itemsPerPage}</strong> игр
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
        </>
    );
};
