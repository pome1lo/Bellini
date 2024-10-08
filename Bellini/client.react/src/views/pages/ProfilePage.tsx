import {Breadcrumbs} from "@/views/partials/Breadcrumbs.tsx";
import {useEffect, useState} from "react";
import {CircleUser} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {useParams} from "react-router-dom";
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";
// import { toast } from "sonner"
import {DialogEditProfile} from "@/views/partials/DialogEditProfile.tsx";
import {useAuth} from "@/utils/context/authContext.tsx";

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
            <h1 className="text-3xl text-center mb-16 mt-16">Profile page</h1>
            <Breadcrumbs items={breadcrumbItems}/>

            {currentUser ? (
                <div className="flex items-center space-x-4">
                    <Button variant="secondary" size="icon" className="rounded-full h-12 w-12">
                        <CircleUser className="h-15 w-15"/>
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                    <div className="space-y-2">
                        <h3>{currentUser.email}</h3>
                        <p>{currentUser.username}</p>
                    </div>
                    <DialogEditProfile
                        contextId={currentUser.id}
                        isProfileUpdated={isProfileUpdated}
                        setIsProfileUpdated={setIsProfileUpdated}
                    />

                    {currentUser.profileImageUrl ?
                        <img src={currentUser.profileImageUrl} alt="" className="rounded-full h-12 w-12"/>
                        :
                        <CircleUser className="h-15 w-15"/>
                    }

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