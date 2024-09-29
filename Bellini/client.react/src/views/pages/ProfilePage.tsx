import {Breadcrumbs} from "@/views/partials/Breadcrumbs.tsx";
import React, {useEffect, useState} from "react";
import {authFetch} from "@/utils/fetch's/authFetch.ts";
import {CircleUser} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";

const breadcrumbItems = [
    { path: '/', name: 'Home' },
    { path: '/profile', name: 'Profile' },
];

interface UserDTO {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    profileImageUrl?: string;
}

export const ProfilePage = () => {
    const [user, setUser] = useState();
    const [currentUserId] = useState(sessionStorage.getItem('__user-id'));

    useEffect(() => {
        authFetch('/profile/' + currentUserId)
            .then(response => response.json())
            .then(data => {
                setUser(data as UserDTO);
            });
    }, []);

    return (
        <>
            <h1 className="text-3xl text-center mb-16 mt-16">Profile page</h1>
            <Breadcrumbs items={breadcrumbItems} />

            {user ? (
                <div className="flex items-center space-x-4">
                    <Button variant="secondary" size="icon" className="rounded-full h-12 w-12">
                        <CircleUser className="h-15 w-15"/>
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                    <div className="space-y-2">
                        <h3>{user.email}</h3>
                        <p>{user.username}</p>
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