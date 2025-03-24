import {CirclePlay, Copy} from "lucide-react"

import {Button} from "@/components/ui/button.tsx"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx"
import {Input} from "@/components/ui/input.tsx"
import {Label} from "@/components/ui/label.tsx"
import React, {useEffect, useState} from "react";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Card} from "@/components/ui/card.tsx";
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";
import {useAuth} from "@/utils/context/authContext.tsx";
import {useNavigate} from "react-router-dom";
import {User} from "@/utils/interfaces/User.ts";
import {toast} from "@/components/ui/use-toast.tsx";
import {authFetch} from "@/utils/fetchs/authFetch.ts";
import confetti from "canvas-confetti";

interface DialogInviteUserProps {
    link: string;
    gameName: string;
    isPrivate: boolean;
    password: string;
}

export const DialogInviteUser: React.FC<DialogInviteUserProps> = ({link, gameName, isPrivate, password}) => {
    const [users, setUsers] = useState<User[]>([]);
    const {user, isAuthenticated, getAccessToken, logout} = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || !user) {
            navigate('/login');
            return;
        }
        serverFetch(`/profile/all-data`)
            .then(response => response.json())
            .then(data => {
                setUsers(data.users);
                console.error(data);
            })
            .catch(error => {
                console.error('Error fetching users:', error.message);
            });
    }, [isAuthenticated, isDialogOpen, user, navigate]);

    const handleDialogOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
    };


    const launchConfetti = () => {
        confetti({
            particleCount: 200,
            spread: 150,
        });
    };

    async function sendInvite(userToId: string, userToEmail: string) {
        try {
            if (!isAuthenticated || !user) {
                navigate('/login');
                return;
            }

            const response = await authFetch(`/notifications/${user.id}/invite`, getAccessToken, logout, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    ToUserId: parseInt(userToId),
                    Email: userToEmail,
                    GameName: gameName,
                    Link: link,
                    IsPrivateRoom: isPrivate,
                    RoomPassword: password,
                }),
            });

            if (response.ok) {
                launchConfetti();
                setIsDialogOpen(false);
            } else {
                const responseData = await response.json();
                toast({
                    title: "Ошибка",
                    description: responseData.Message || "Возникла ошибка.",
                    variant: "destructive"
                });
            }
        } catch (error: unknown) {
            toast({
                title: "Ошибка",
                description: (error as Error).message || "Возникла ошибка.",
                variant: "destructive"
            });
        }
    }

return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogTrigger asChild>
            <Button variant="outline">Пригласить</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Поделиться ссылкой</DialogTitle>
                <DialogDescription>
                    Любой, у кого есть эта ссылка, сможет ее просмотреть.
                </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center">
                <div className="flex w-full items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Ссылка
                        </Label>
                        <Input
                            id="link"
                            defaultValue={link}
                            readOnly
                        />
                    </div>
                    <Button type="submit" size="sm" className="px-3">
                        <span className="sr-only">Копировать</span>
                        <Copy className="h-4 w-4"/>
                    </Button>
                </div>
                <div className="mt-4 w-full">
                    {users && users.length > 0 ?
                        <ScrollArea className="h-[450px]  border rounded-md">

                            {users.map((item, index) => (
                                <div key={index} className={`flex hover:bg-secondary flex-row pe-4 items-center justify-between w-full ${item.id == user!.id ? " hidden" : ""}`}>
                                    <div className={`flex cursor-pointer w-full p-2`} onClick={() => navigate("/profile/" + item.id)}>
                                        <Avatar className="h-9 w-9 flex mx-2">
                                            <AvatarImage
                                                src={item.profileImageUrl}
                                                alt={`${item.username}'s profile`}
                                            />
                                            <AvatarFallback>
                                                {(item.username.charAt(0) + item.username.charAt(1)).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h1 className="text-[102%] font-medium">{item.username}</h1>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" className="h-8 ms-3 gap-1" onClick={() => sendInvite(item.id, item.email)}>
                                        <CirclePlay className="h-3.5 w-3.5"/>
                                       Отправить приглашение
                                    </Button>
                                </div>
                            ))}

                        </ScrollArea>
                        :
                        <Card className="h-[450px] p-4 border rounded-md flex justify-center items-center">
                            <h1 className="text-muted-foreground">
                                Здесь пока нет пользователей
                            </h1>
                        </Card>
                    }

                </div>
            </div>
            <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Закрыть
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)
}
