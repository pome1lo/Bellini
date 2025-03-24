import {Button} from "@/components/ui/button.tsx"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx"
import {Input} from "@/components/ui/input.tsx"
import {useNavigate} from "react-router-dom";
import {Breadcrumbs} from "@/components/breadcrumbs.tsx";
import {useEffect} from 'react';
import {authFetch} from "@/utils/fetchs/authFetch.ts";
import {useAuth} from "@/utils/context/authContext.tsx";

const breadcrumbItems = [
    {path: '/', name: 'Home'},
    {path: '/settings', name: 'Setting'},
];

export const SettingsPage = () => {
    const {user, isAuthenticated, getAccessToken, logout} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || !user) {
            navigate('/login');
            return;
        }
    }, [user, isAuthenticated]);

    const onDeleteSubmit = async () => {

        try {
            const response = await authFetch(`/profile/${user?.id}`, getAccessToken, logout, {
                method: 'DELETE'
            });
            if (response.status == 204) {
                sessionStorage.clear()
                navigate('/');
                window.location.reload();
            } else {
                const data = await response.json();
                alert(data.Message || 'An error occurred');
            }
        } catch (ex: unknown) {
            alert((ex as Error).message || 'An unexpected error occurred');
        }
    };

    function logoutAccount() {
        sessionStorage.clear()
        navigate('/');
        window.location.reload();
    }

    return (
        <>
            <Breadcrumbs items={breadcrumbItems}/>

            <div className="grid gap-6 max-w-[1440px] h-[80vh] w-full mx-auto sm:px-0 px-2">

                <Card x-chunk="dashboard-04-chunk-1">
                    <CardHeader>
                        <CardTitle>Logout</CardTitle>
                        <CardDescription>
                            Log out of your account.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="border-t px-6 py-4">
                        <Button onClick={logoutAccount}>Logout</Button>
                    </CardFooter>
                </Card>

                <Card x-chunk="dashboard-04-chunk-1">
                    <CardHeader>
                        <CardTitle>Delete an account</CardTitle>
                        <CardDescription>
                            If you delete your account, you will no longer be able to access it. If you do decide to
                            delete your account, then we ask you to leave a reason.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <Input placeholder="Reason"/>
                        </form>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <AlertDialog>
                            <AlertDialogTrigger>
                                <Button variant="destructive">Delete an account</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your account
                                        and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={onDeleteSubmit}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}