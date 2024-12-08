import {Breadcrumbs} from "@/views/partials/Breadcrumbs.tsx";
import React, {useEffect, useState} from "react";
import {CircleUser, Divide} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {useParams} from "react-router-dom";
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";
// import { toast } from "sonner"
import {DialogEditProfile} from "@/views/partials/dialogs/DialogEditProfile.tsx";
import {useAuth} from "@/utils/context/authContext.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {DialogShareButton} from "@/views/partials/dialogs/DialogShareButton.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {ProfileSkeleton} from "@/views/partials/skeletons/ProfileSkeleton.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";

const breadcrumbItems = [
    {path: '/', name: 'Home'},
    {path: '/profile', name: 'Profile'},
];

interface UserProfile {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
}

interface UserInfo {
    totalQuizzesCompleted: number;
    totalGamesCompleted: number;
    averageQuizAccuracy: number;
    averageGameAccuracy: number;
    lastCompletedQuiz: string;
    lastCompletedGame: string;
    bestQuiz: string;
    bestGame: string;
}

export const ProfilePage = () => {
    const [currentUser, setCurrentUser] = useState<UserProfile>();
    const [userInfo, setUserInfo] = useState<UserInfo>();
    const [isProfileUpdated, setIsProfileUpdated] = useState(false);
    const {user, isAuthenticated, update} = useAuth();
    const {id} = useParams();

    useEffect(() => {
        serverFetch(`/profile/${id}`)
            .then(response => response.json())
            .then(data => {
                setCurrentUser(data);
                if(isAuthenticated && user && user.id === id) {
                    update(data);
                }
            });

        serverFetch(`/profile/${id}/info`)
            .then(response => response.json())
            .then(data => {
                setUserInfo(data);
                console.log(data) 
            });

    }, [id, isProfileUpdated]);


    return (
        <>
            <Breadcrumbs items={breadcrumbItems}/>

            {currentUser ? (
                <div className="flex lg:flex-row lg:space-x-4 flex-col  max-w-[1440px] w-full mx-auto">
                    <div className="">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center mb-5">
                                    <div>

                                        <Avatar className="size-20 flex me-2">
                                            <AvatarImage
                                                src={currentUser.profileImageUrl}
                                                alt={`${currentUser.username}'s profile`}
                                            />
                                            <AvatarFallback className="text-3xl">
                                                {(currentUser.username.charAt(0) + currentUser.username.charAt(1)).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="ms-4">
                                        <h3 className="font-bold text-xl">{currentUser.username}</h3>
                                        <h3 className="leading-none text-muted-foreground">{currentUser.email}</h3>
                                    </div>
                                </div>
                                <Separator/>
                                <div className="mb-5">
                                    <h4><span className="font-bold">First name: </span>{currentUser.firstName ?? "unknown"}</h4>
                                    <h4><span className="font-bold">Last name:</span> {currentUser.lastName ?? "unknown"}</h4>
                                </div>
                                <Separator/>
                            </CardHeader>
                            <CardContent>
                                {id != user?.id ?
                                    <></>
                                    :
                                    <DialogEditProfile
                                        className={"w-full"}
                                        contextId={currentUser.id}
                                        isProfileUpdated={isProfileUpdated}
                                        setIsProfileUpdated={setIsProfileUpdated}
                                    />
                                }
                            </CardContent>
                        </Card>
                        <Card className="mt-4 mb-5">
                            <CardHeader>
                                <CardTitle>Share</CardTitle>
                                <CardDescription>
                                    You can share the link to the game with other users
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DialogShareButton link={window.location.href}/>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>
                                User Performance Overview
                            </CardTitle>
                            <CardDescription>
                                Detailed statistics of the user's performance in quizzes and games.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Statistic</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Value</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Quizzes Completed</TableCell>
                                        <TableCell>Total quizzes completed by the user</TableCell>
                                        <TableCell className="font-bold">{userInfo?.totalQuizzesCompleted}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Games Completed</TableCell>
                                        <TableCell>Total games completed by the user</TableCell>
                                        <TableCell className="font-bold">{userInfo?.totalGamesCompleted}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Average Quiz Accuracy</TableCell>
                                        <TableCell>Percentage of correct answers in quizzes</TableCell>
                                        <TableCell className="font-bold">{userInfo?.averageQuizAccuracy.toFixed(2)}%</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Average Game Accuracy</TableCell>
                                        <TableCell>Percentage of correct answers in games</TableCell>
                                        <TableCell className="font-bold">{userInfo?.averageGameAccuracy.toFixed(2)}%</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Last Completed Quiz</TableCell>
                                        <TableCell>The most recent quiz played by the user</TableCell>
                                        <TableCell className="font-bold">{userInfo?.lastCompletedQuiz ?? "-"}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Last Completed Game</TableCell>
                                        <TableCell>The most recent game played by the user</TableCell>
                                        <TableCell className="font-bold">{userInfo?.lastCompletedGame ?? "-"}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Best Quiz</TableCell>
                                        <TableCell>The quiz with the highest performance</TableCell>
                                        <TableCell className="font-bold">{userInfo?.bestQuiz ?? "-"}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Best Game</TableCell>
                                        <TableCell>The game with the highest performance</TableCell>
                                        <TableCell className="font-bold">{userInfo?.bestGame ?? "-"}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter className="text-center">
                            <p className="text-sm text-muted-foreground">Updated: {new Date().toLocaleDateString()}</p>
                        </CardFooter>
                    </Card>


                </div>
            ) : (
                <ProfileSkeleton/>
            )}
        </>
    )
}