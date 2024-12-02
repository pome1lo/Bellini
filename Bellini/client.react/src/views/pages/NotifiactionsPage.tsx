import {Breadcrumbs} from "@/views/partials/Breadcrumbs.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Table, TableBody} from "@/components/ui/table.tsx";
import {GameListItem} from "@/views/partials/GameListItem.tsx";
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.tsx";
import React, {useEffect, useState} from "react";
import {Game} from "@/utils/interfaces/Game.ts";
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";
import {GameListTabContentRowSkeleton} from "@/views/partials/skeletons/GameListTabContentRowSkeleton.tsx";
import {GameListTabContentNotFoundSkeleton} from "@/views/partials/skeletons/GameListTabContentNotFoundSkeleton.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {formatDate} from "@/utils/functions/formatDate.ts";
import {Button} from "@/components/ui/button.tsx";
import {authFetch} from "@/utils/fetchs/authFetch.ts";

const breadcrumbItems = [
    { path: '/', name: 'Home' },
    { path: '/notifications', name: 'Notifications' },
];
export const NotifiactionsPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchNotifications = async () => {
            setIsLoading(true);
            try {
                const response = await authFetch(`/notifications?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`);
                const data = await response.json();
                if (response.status === 204 || !Array.isArray(data.games)) {
                    setNotifications([]);
                } else {
                    setNotifications(data.comments);
                    console.log(data)
                    setTotalPages(Math.ceil(data.total / itemsPerPage));
                }
            } catch (error: unknown) {
                console.error('Error fetching games:', (error as Error).message);
                setNotifications([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (isLoading) {
        return <>LOADING</>
    }

    if (notifications.length === 0) {
        return <>0 ELEMENTOV</>
    }

    return (
        <>
            <Breadcrumbs items={breadcrumbItems}    />
            <Card>
                <CardHeader>
                    <CardTitle>Games</CardTitle>
                    <CardDescription>
                        Here you will see the available games for your chosen category
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[300px] border rounded-md">
                        {notifications.length == 0 ?
                            <>
                                <div className="h-[170px] flex items-center justify-center">
                                    <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">There are no
                                        notifications here yet 😪</h1>
                                </div>
                            </>
                            :
                            <>
                                {notifications.map((item, index) => (
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
                                                    {currentGame?.hostId != comment.userId ? <></> :
                                                        <Badge variant="default" className="ms-3 text-sm">Host</Badge>
                                                    }
                                                    <p className="ms-3 text-sm opacity-45">{formatDate(new Date(comment.commentDate))}</p>
                                                </div>
                                                <p>{comment.content}</p>
                                            </div>
                                        </a>
                                    </div>
                                ))}
                            </>
                        }
                    </ScrollArea>
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
    )
}