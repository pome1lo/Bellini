import {Menu, Package2, Search} from "lucide-react"
import {Button} from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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
} from "@/components/ui/alert-dialog"
import {Input} from "@/components/ui/input"
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet"
import {Link, useNavigate} from "react-router-dom";
import {Breadcrumbs} from "@/views/partials/Breadcrumbs.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useEffect, useState} from 'react';
import {format} from "date-fns";
import {cn} from "@/lib/utils";
import {useForm, Controller} from 'react-hook-form';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {CalendarIcon} from "@radix-ui/react-icons";
import {Calendar} from "@/components/ui/calendar.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";
import {authFetch} from "@/utils/fetchs/authFetch.ts";
import {useAuth} from "@/utils/context/authContext.tsx";

const breadcrumbItems = [
    {path: '/', name: 'Home'},
    {path: '/settings', name: 'Setting'},
];

export const SettingsPage = () => {
    const {user, isAuthenticated, getAccessToken, logout} = useAuth();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
                setErrorMessage(data.Message || 'An error occurred');
            }
        } catch (ex) {
            setErrorMessage(ex.Message || 'An unexpected error occurred');
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

            <div className="grid gap-6 max-w-[1440px] w-full mx-auto sm:px-0 px-2">

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