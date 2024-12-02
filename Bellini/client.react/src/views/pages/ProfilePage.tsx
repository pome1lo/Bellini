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
    dateOfBirth: string;
    profileImageUrl?: string;
}


export const ProfilePage = () => {
    const [currentUser, setCurrentUser] = useState<UserProfile>();
    const [isProfileUpdated, setIsProfileUpdated] = useState(false);
    const {user, isAuthenticated, update} = useAuth();
    const {id} = useParams();

    useEffect(() => {
        serverFetch(`/profile/${id}`)
            .then(response => response.json())
            .then(data => {
                setCurrentUser(data);
                if(isAuthenticated || user || user.id === id) {
                    update(data);
                }
            });
    }, [id, isProfileUpdated]);


    return (
        <>
            <Breadcrumbs items={breadcrumbItems}/>

            {currentUser ? (
                <div className="flex items-center space-x-4 max-w-[1440px] w-full mx-auto">
                    <div className="">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center mb-5">
                                    <div>
                                        {currentUser.profileImageUrl ?
                                            <img
                                                src={currentUser.profileImageUrl}
                                                alt=""
                                                className="rounded-md h-20 w-20"
                                            />
                                            :
                                            <CircleUser className="h-20 w-20"/>
                                        }
                                    </div>
                                    <div className="ms-4">
                                        <h3 className="font-bold text-xl">{currentUser.username}</h3>
                                        <h3 className="leading-none text-muted-foreground">{currentUser.email}</h3>
                                    </div>
                                </div>
                                <DialogEditProfile
                                    className={"w-full"}
                                    contextId={currentUser.id}
                                    isProfileUpdated={isProfileUpdated}
                                    setIsProfileUpdated={setIsProfileUpdated}
                                />
                            </CardHeader>
                            <CardContent>
                                <Separator />
                            </CardContent>
                            <CardFooter>

                            </CardFooter>
                        </Card>
                        <Card className="mt-4">
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

                    <Button variant="secondary" size="icon" className="rounded-full h-12 w-12">
                        <CircleUser className="h-15 w-15"/>
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                    <div className="space-y-2">
                        <h3>{currentUser.email}</h3>
                        <p>{currentUser.username}</p>
                    </div>


                </div>
            ) : (
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full"/>
                    <div className="space-y-2">
                        <Skeleton className="h-4"/>
                        <Skeleton className="h-4"/>
                    </div>
                </div>
            )}
        </>
    )
}