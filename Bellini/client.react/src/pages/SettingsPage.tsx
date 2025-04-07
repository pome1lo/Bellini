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
    {path: '/', name: 'Главная'},
    {path: '/settings', name: 'Настройки'},
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
                        <CardTitle>Выход из системы</CardTitle>
                        <CardDescription>
                            Выйдите из своей учетной записи.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="border-t px-6 py-4">
                        <Button onClick={logoutAccount}>Выход из системы</Button>
                    </CardFooter>
                </Card>

                <Card x-chunk="dashboard-04-chunk-1">
                    <CardHeader>
                        <CardTitle>Удалить учетную запись</CardTitle>
                        <CardDescription>
                            Если вы удалите свою учетную запись, вы больше не сможете получить к ней доступ. Если вы все же решите удалить свою учетную запись, мы просим вас указать причину.
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
                                <Button variant="destructive">Удалить учетную запись</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Вы абсолютно уверены?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Это действие невозможно отменить. Это приведет к необратимому удалению вашей учетной записи
                                        и удалению ваших данных с наших серверов.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                                    <AlertDialogAction onClick={onDeleteSubmit}>Удалить</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}