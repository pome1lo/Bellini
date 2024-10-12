import { Table, TableBody, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import { Card,  CardContent,  CardDescription,  CardFooter,  CardHeader,  CardTitle,} from "@/components/ui/card"
import React, {useEffect, useState} from "react";
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {GameListItem} from "@/views/partials/GameListItem.tsx";

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

    useEffect(() => {
        serverFetch(`/game/${tabContentName}`)
            .then(response => {
                if (response.status === 204) {
                    return [];
                }
                return response.json();
            })
            .then(data => {
                const gamesList = Array.isArray(data) ? data : [];
                console.log(tabContentName + ": games list:", gamesList);
                setGames(gamesList);
            })
            .catch(error => {
                console.error('Error fetching games:', error.message);
                setGames([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [isUpdated, isCreated, tabContentName]);

    if (isLoading) {
        return (
            <>
                ЗАГРУЗОЧКА
                <Skeleton/>
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
            <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                    <CardTitle>Games</CardTitle>
                    <CardDescription>
                     description description description
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden w-[100px] sm:table-cell">
                                    <span className="sr-only">Image</span>
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="hidden md:table-cell">Price</TableHead>
                                <TableHead className="hidden md:table-cell">Number of players</TableHead>
                                <TableHead className="hidden md:table-cell">Created at</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
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
                    <div className="text-xs text-muted-foreground">
                        Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                        products
                    </div>
                </CardFooter>
            </Card>
        </>
    )
}