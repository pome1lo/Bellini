import React, { useState, useEffect } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination";
import { serverFetch } from "@/utils/fetchs/serverFetch";
import { Skeleton } from "@/components/ui/skeleton";
import { GameListItem } from "@/views/partials/GameListItem";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table.tsx";

export interface ActiveGame {
    id: number;
    gameName: string;
    hostId: number;
    startTime: Date;
    maxPlayers: number;
    isActive: boolean;
    difficultyLevel: string;
    gameCoverImageUrl: string;
}

interface GamesListTabContentProps {
    tabContentName: string;
    isUpdated: boolean;
    isCreated: boolean;
}

export const GamesListTabContent: React.FC<GamesListTabContentProps> = ({ tabContentName, isUpdated, isCreated }) => {
    const [games, setGames] = useState<ActiveGame[]>([]);
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
                    setTotalPages(Math.ceil(data.total / itemsPerPage));
                }
            } catch (error) {
                console.error('Error fetching games:', error.message);
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
        return (
            <>
                ЗАГРУЗОЧКА
                <Skeleton />
            </>
        );
    }

    if (games.length === 0) {
        return (
            <>
                We didn't find anything
                <span>😪</span>
            </>
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Games</CardTitle>
                    <CardDescription>
                        description description description
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        {/* Table header */}
                        <TableBody>
                            {games.map((item) => (
                                <GameListItem
                                    key={item.id}
                                    id={item.id}
                                    hostId={item.hostId}
                                    isActive={item.isActive}
                                    difficultyLevel={item.difficultyLevel}
                                    maxPlayers={item.maxPlayers}
                                    gameName={item.gameName}
                                    startTime={item.startTime}
                                    gameCoverImageUrl={item.gameCoverImageUrl}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter>
                    <div className="flex justify-between w-full items-center">
                        <div className="text-xs text-muted-foreground">
                            Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> - <strong>{Math.min(currentPage * itemsPerPage, games.length)}</strong> of <strong>{totalPages * itemsPerPage}</strong> games
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
                                    {currentPage > 3 && <PaginationEllipsis />}
                                    {currentPage > 1 && (
                                        <PaginationItem>
                                            <PaginationLink onClick={() => handlePageChange(currentPage - 1)}>{currentPage - 1}</PaginationLink>
                                        </PaginationItem>
                                    )}
                                    <PaginationItem>
                                        <PaginationLink isActive>{currentPage}</PaginationLink>
                                    </PaginationItem>
                                    {currentPage < totalPages && (
                                        <PaginationItem>
                                            <PaginationLink onClick={() => handlePageChange(currentPage + 1)}>{currentPage + 1}</PaginationLink>
                                        </PaginationItem>
                                    )}
                                    {currentPage < totalPages - 2 && <PaginationEllipsis />}
                                    {currentPage < totalPages - 1 && (
                                        <PaginationItem>
                                            <PaginationLink onClick={() => handlePageChange(totalPages)}>{totalPages}</PaginationLink>
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
