import {TableCell, TableRow} from "@/components/ui/table.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {MoreHorizontal} from "lucide-react";
import {useAuth} from "@/utils/context/authContext.tsx";
import {useNavigate} from "react-router-dom";
import {toast} from "@/components/ui/use-toast.tsx";
import React from "react";
import {ActiveGame} from "@/utils/interfaces/ActiveGame.ts";


export const GameListItem: React.FC<ActiveGame> = ({
                                                       id,
                                                       gameName,
                                                       startTime,
                                                       maxPlayers,
                                                       gameCoverImageUrl,
                                                       isPrivate,
                                                       status
                                                   }) => {
    const {user, isAuthenticated} = useAuth();
    const navigate = useNavigate();

    async function joinGame() {
        try {
            if (!isAuthenticated || !user) {
                navigate('/login');
            } else {
                navigate(`/games/room/${id}`);
            }
        } catch (error) {
            console.error('Connection failed: ', error);
            toast({title: "Connection failed!", description: "Please try again.", variant: "destructive"});
        }
    }

    return (
        <>
            {/*<div key={id} className={"mb-10 flex"}>*/}
            {/*    <p>Game name: {gameName || 'NO NAME'}</p>*/}
            {/*    <p>Start time: {new Date(startTime).toLocaleString()}</p>*/}
            {/*    <JoinGameButton gameId={id}/>*/}
            {/*</div>*/}


            <TableRow onClick={joinGame}>
                <TableCell className="hidden sm:table-cell">
                    <img
                        alt={gameName + " image"}
                        className="aspect-square border rounded-md object-cover"
                        height="100"
                        src={gameCoverImageUrl}
                        width="100"
                    />
                </TableCell>
                <TableCell className="font-medium text-lg">
                    {gameName}
                </TableCell>
                <TableCell>
                    <Badge variant="outline" className="text-md">{isPrivate ? "Private" : "Public"}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-md">
                    <Badge variant="outline">{status}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-lg">
                    {maxPlayers}
                </TableCell>
                <TableCell className="hidden md:table-cell text-lg">
                    {new Date(startTime).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })}
                </TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                            >
                                <MoreHorizontal className="h-5 w-5"/>
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Действия</DropdownMenuLabel>
                            <DropdownMenuItem>Посетить</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
        </>
    )
}