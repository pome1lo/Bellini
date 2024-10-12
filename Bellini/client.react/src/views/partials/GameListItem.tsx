import {JoinGameButton} from "@/views/partials/JoinGameButton.tsx";
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
import {toast} from "@/components/ui/use-toast.ts";
import {ActiveGame} from "@/views/partials/GamesListTabContent.tsx";
import React from "react";


export const GameListItem: React.FC<ActiveGame> = ({
                                                       id,
                                                       gameName,
                                                       hostId,
                                                       startTime,
                                                       maxPlayers,
                                                       isActive,
                                                       difficultyLevel,
                                                       gameCoverImageUrl
                                                   }) => {
    const {user, isAuthenticated} = useAuth();
    const navigate = useNavigate();

    async function joinGame() {
        try {
            if (!isAuthenticated || !user) {
                navigate('/login');
            } else {
                navigate(`/games/rooms/${id}`);
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
                        height="64"
                        src={gameCoverImageUrl}
                        width="64"
                    />
                </TableCell>
                <TableCell className="font-medium">
                    {gameName}
                </TableCell>
                <TableCell>
                    <Badge variant="outline">Draft</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    $499.99
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    {maxPlayers}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    {new Date(startTime).toLocaleString()}
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
        </>
    )
}