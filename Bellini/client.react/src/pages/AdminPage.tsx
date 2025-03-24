import {useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {PiCrownSimpleBold} from "react-icons/pi";
import {MdOutlineDoNotDisturbAlt, MdQuiz} from "react-icons/md";
import {Breadcrumbs} from "@/components/breadcrumbs.tsx";
import {FaUserFriends} from "react-icons/fa";
import {IoGameController} from "react-icons/io5";
import {RefreshCcw} from "lucide-react";
import {DialogCreateGame} from "@/components/dialogs/dialogCreateGame.tsx";
import {Game} from "@/utils/interfaces/Game.ts";
import {Quiz} from "@/utils/interfaces/Quiz.ts";
import {CustomPagination} from "@/components/customPagination.tsx";
import {DialogCreateUser} from "@/components/dialogs/dialogCreateUser.tsx";
import {useNavigate} from "react-router-dom";
import {authFetch} from "@/utils/fetchs/authFetch.ts";
import {toast} from "@/components/ui/use-toast.tsx";
import {useAuth} from "@/utils/context/authContext.tsx";
import {DialogEditUser} from "@/components/dialogs/dialogEditUser.tsx";
import {DialogCreateQuizSimple} from "@/components/dialogs/dialogCreateQuiz.tsx";
import {GiBlackball} from "react-icons/gi";
import {GameListTabContentRowSkeleton} from "@/components/skeletons/gameListTabContentRowSkeleton.tsx";

interface UserProfile {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    isAdmin: boolean;
}

const breadcrumbItems = [
    {path: '/', name: 'Home'},
    {path: '/admin', name: 'Admin panel'},
];


export const AdminPage = () => {
    const [activeTab, setActiveTab] = useState("users");
    const navigate = useNavigate();
    const {user, isAuthenticated, getAccessToken, logout} = useAuth();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isUpdated, setIsUpdated] = useState<boolean>(false);
    const [isCreated, setIsCreated] = useState<boolean>(false);

    const [users, setUsers] = useState<UserProfile[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [drafts, setDrafts] = useState<Quiz[]>([]);
    const [games, setGames] = useState<Game[]>([]);

    const [currentQuizPage, setCurrentQuizPage] = useState(1);
    const [totalQuizPages, setTotalQuizPages] = useState(1);
    const [currentGamePage, setCurrentGamePage] = useState(1);
    const [totalGamePages, setTotalGamePages] = useState(1);
    const [currentUserPage, setCurrentUserPage] = useState(1);
    const [totalUserPages, setTotalUserPages] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (!user?.isAdmin) {
            navigate("404");
        }
    }, []);

    useEffect(() => {
        try {
            setIsLoading(true);
            serverFetch(`/profile/all-data?limit=${itemsPerPage}&offset=${(currentUserPage - 1) * itemsPerPage}`)
                .then(response => response.json())
                .then(data => {
                    setUsers(data.users);
                    setTotalUserPages(Math.ceil(data.total / itemsPerPage));
                });

            serverFetch(`/quizzes?limit=${itemsPerPage}&offset=${(currentQuizPage - 1) * itemsPerPage}${!isAuthenticated || !user ? "" : "&userId=" + user.id}`)
                .then(response => response.json())
                .then(data => {
                    setQuizzes(data.quizzes);
                    console.log(data.quizzes)
                    setTotalQuizPages(Math.ceil(data.total / itemsPerPage));
                });

            serverFetch(`/quizzes/all-drafts?limit=${itemsPerPage}&offset=${(currentQuizPage - 1) * itemsPerPage}${!isAuthenticated || !user ? "" : "&userId=" + user.id}`)
                .then(response => response.json())
                .then(data => {
                    setDrafts(data.quizzes);
                    setTotalQuizPages(Math.ceil(data.total / itemsPerPage));
                });

            serverFetch(`/game/all-data?limit=${itemsPerPage}&offset=${(currentGamePage - 1) * itemsPerPage}`)
                .then(response => response.json())
                .then(data => {
                    setGames(data.games);
                    setTotalGamePages(Math.ceil(data.total / itemsPerPage));
                });
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [isUpdated, currentUserPage, isCreated]);


    const onDeleteUser = async (id: number) => {
        try {
            const response = await authFetch(`/admin/user/${id}`, getAccessToken, logout, {
                method: 'DELETE'
            });
            if (response.status == 204) {
                setIsUpdated(!isUpdated);
                toast({title: "User Deleted", description: "The user was successfully deleted."});
            } else {
                const responseData = await response.json();
                toast({
                    title: "Error",
                    description: responseData.message || "An error occurred.",
                    variant: "destructive"
                });
            }
        } catch (ex: unknown) {
            alert((ex as Error).message || 'An unexpected error occurred');
        }
    };

    const onDeleteQuiz = async (id: number) => {
        try {
            const response = await authFetch(`/admin/quiz/${id}`, getAccessToken, logout, {
                method: 'DELETE'
            });
            if (response.status == 204) {
                setIsUpdated(!isUpdated);
                toast({title: "Quiz Deleted", description: "The quiz was successfully deleted."});
            } else {
                const responseData = await response.json();
                toast({
                    title: "Error",
                    description: responseData.message || "An error occurred.",
                    variant: "destructive"
                });
            }
        } catch (ex: unknown) {
            alert((ex as Error).message || 'An unexpected error occurred');
        }
    };

    const onDeleteGame = async (id: number) => {
        try {
            const response = await authFetch(`/admin/game/${id}`, getAccessToken, logout, {
                method: 'DELETE'
            });
            if (response.status == 204) {
                setIsUpdated(!isUpdated);
                toast({title: "Game Deleted", description: "The game was successfully deleted."});
            } else {
                const responseData = await response.json();
                toast({
                    title: "Error",
                    description: responseData.message || "An error occurred.",
                    variant: "destructive"
                });
            }
        } catch (ex: unknown) {
            alert((ex as Error).message || 'An unexpected error occurred');
        }
    };
    if (isLoading) {
        return <GameListTabContentRowSkeleton
            title="Admin"
            items={[ ]}
            description="Here you will see the available games for your chosen category">
        </GameListTabContentRowSkeleton>;
    }
    return (
        <>
            <Breadcrumbs items={breadcrumbItems}/>
            <div className="max-w-[1440px] w-full mx-auto sm:px-0 px-2">
                <Card className="">
                    <CardHeader>
                        <CardTitle>Admin panel</CardTitle>
                    </CardHeader>
                    <CardContent className="">
                        <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
                            <div className="flex justify-between">
                                <TabsList className="items-start ">
                                    <TabsTrigger value="users">
                                        <div className="flex items-center">
                                            <FaUserFriends className="me-2"/>
                                            <p>Пользователи</p>
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger value="games">
                                        <div className="flex items-center">
                                            <IoGameController className="me-2"/>
                                            <p>Игры</p>
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger value="quizzes">
                                        <div className="flex items-center">
                                            <MdQuiz className="me-2"/>
                                            <p>Викторины</p>
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger value="drafts">
                                        <div className="flex items-center">
                                            <GiBlackball className="me-2"/>
                                            <p>Черновики</p>
                                        </div>
                                    </TabsTrigger>
                                </TabsList>
                                <Button size="sm" variant="outline" className="h-8 gap-1"
                                        onClick={() => setIsUpdated(!isUpdated)}>
                                    <RefreshCcw className="h-3.5 w-3.5"/>
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Update</span>
                                </Button>
                            </div>
                            <TabsContent value="users">
                                <Card>
                                    <CardHeader>
                                        <div className="flex flex-row justify-between">
                                            <CardTitle>Users</CardTitle>
                                            <DialogCreateUser
                                                setIsCreated={setIsCreated}
                                                isCreated={isCreated}
                                            />
                                        </div>
                                        <CardDescription>List of all available users</CardDescription>
                                    </CardHeader>
                                    <CardContent  className="min-h-[500px]">
                                        {users && users.length != 0 ?
                                            <Table className="">
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>№</TableHead>
                                                        <TableHead>Image</TableHead>
                                                        <TableHead>Username</TableHead>
                                                        <TableHead>Email</TableHead>
                                                        <TableHead>FirstName</TableHead>
                                                        <TableHead>LastName</TableHead>
                                                        <TableHead>Is Admin</TableHead>
                                                        <TableHead className="text-right ">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>

                                                <TableBody>
                                                    {users.map((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell className="cursor-pointer" onClick={() => navigate("/profile/" + item.id)}>{index + 1}</TableCell>
                                                            <TableCell className="cursor-pointer" onClick={() => navigate("/profile/" + item.id)}>
                                                                <Avatar className="hidden h-9 w-9 sm:flex">
                                                                    <AvatarImage
                                                                        src={item.profileImageUrl}
                                                                        alt={`${item.username}'s profile`}
                                                                    />
                                                                    <AvatarFallback>
                                                                        {(item.username.charAt(0) + item.username.charAt(1)).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            </TableCell>
                                                            <TableCell className="cursor-pointer" onClick={() => navigate("/profile/" + item.id)}>{item.username}</TableCell>
                                                            <TableCell className="cursor-pointer" onClick={() => navigate("/profile/" + item.id)}>{item.email}</TableCell>
                                                            <TableCell className="cursor-pointer" onClick={() => navigate("/profile/" + item.id)}>{item.firstName}</TableCell>
                                                            <TableCell className="cursor-pointer" onClick={() => navigate("/profile/" + item.id)}>{item.lastName}</TableCell>
                                                            <TableCell>
                                                                {item.isAdmin ? <PiCrownSimpleBold className="fill-green-600"/> : <MdOutlineDoNotDisturbAlt className="fill-red-700"/>}
                                                            </TableCell>
                                                            <TableCell className="bg-secondary flex justify-end">
                                                                <DialogEditUser setIsEdited={setIsUpdated} isEdited={isUpdated} currentUserEdit={item}/>
                                                                {
                                                                    user && user.id == item.id.toString() ?
                                                                        <Button variant="default" className="ms-3" size="sm" onClick={() => navigate("/settings")}>Вы</Button>
                                                                        :
                                                                        <Button variant="destructive" className="ms-3" size="sm" onClick={() => onDeleteUser(item.id)}>Удалить</Button>
                                                                }
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                            :
                                            <GameListTabContentRowSkeleton
                                                title=""
                                                items={[ ]}
                                                description=""
                                            />
                                        }
                                    </CardContent>
                                    <CardFooter>
                                        <div className="flex justify-between w-full items-center">
                                            <div className="text-xs text-muted-foreground">
                                                Showing <strong>{(currentUserPage - 1) * itemsPerPage + 1}</strong> - <strong>{Math.min(currentUserPage * itemsPerPage, users.length)}</strong> of <strong>{totalUserPages * itemsPerPage}</strong> users
                                            </div>
                                            <CustomPagination
                                                currentPage={currentUserPage}
                                                totalPages={totalUserPages}
                                                onPageChange={setCurrentUserPage}
                                            />
                                        </div>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                            <TabsContent value="games">
                                <Card>
                                    <CardHeader>
                                        <div className="flex flex-row justify-between">
                                            <CardTitle>Games</CardTitle>
                                            <DialogCreateGame
                                                setIsCreated={setIsCreated}
                                                isCreated={isCreated}
                                                isAdminPage={true}
                                            />
                                        </div>
                                        <CardDescription>List of all available games</CardDescription>
                                    </CardHeader>
                                    <CardContent  className="min-h-[500px]">
                                        {games && games.length != 0 ?
                                            <Table className="">
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>№</TableHead>
                                                        <TableHead>Image</TableHead>
                                                        <TableHead>Game Name</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead>Create Time</TableHead>
                                                        <TableHead>Started Time</TableHead>
                                                        <TableHead>Max Players</TableHead>
                                                        <TableHead>Is Private</TableHead>
                                                        <TableHead className="text-right ">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>

                                                <TableBody>
                                                    {games.map((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell className="cursor-pointer" onClick={() => navigate("/games/room/" + item.id)}>{index + 1}</TableCell>
                                                            <TableCell className="cursor-pointer" onClick={() => navigate("/games/room/" + item.id)}>
                                                                <Avatar className="hidden h-9 w-9 sm:flex">
                                                                    <AvatarImage
                                                                        src={item.gameCoverImageUrl}
                                                                        alt={`${item.gameName}'s profile`}
                                                                    />
                                                                    <AvatarFallback>
                                                                        {(item.gameName.charAt(0) + item.gameName.charAt(1)).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            </TableCell>
                                                            <TableCell className="cursor-pointer" onClick={() => navigate("/games/room/" + item.id)}>{item.gameName}</TableCell>
                                                            <TableCell className="cursor-pointer" onClick={() => navigate("/games/room/" + item.id)}>{item.status.name}</TableCell>
                                                            <TableCell className="cursor-pointer" onClick={() => navigate("/games/room/" + item.id)}>{new Date(item.createTime).toDateString()}</TableCell>
                                                            <TableCell className="cursor-pointer" onClick={() => navigate("/games/room/" + item.id)}>{new Date(item.startTime).toDateString()}</TableCell>
                                                            <TableCell className="cursor-pointer" onClick={() => navigate("/games/room/" + item.id)}>{item.maxPlayers}</TableCell>
                                                            <TableCell className="cursor-pointer" onClick={() => navigate("/games/room/" + item.id)}>{item.isPrivate ? "True" : "False"}</TableCell>
                                                            <TableCell className="bg-secondary flex justify-end">
                                                                <Button variant="outline" size="sm" onClick={() => navigate("/games/room/" + item.id)}>Изменить</Button>
                                                                <Button variant="destructive" className="ms-3" size="sm" onClick={() => onDeleteGame(item.id)}>Удалить</Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                            :

                                            <GameListTabContentRowSkeleton
                                                title=""
                                                items={[ ]}
                                                description=""
                                            />
                                        }
                                    </CardContent>
                                    <CardFooter>
                                        <div className="flex justify-between w-full items-center">
                                            <div className="text-xs text-muted-foreground">
                                                Showing <strong>{(currentGamePage - 1) * itemsPerPage + 1}</strong> - <strong>{Math.min(currentGamePage * itemsPerPage, games.length)}</strong> of <strong>{totalGamePages * itemsPerPage}</strong> games
                                            </div>
                                            <CustomPagination
                                                currentPage={currentGamePage}
                                                totalPages={totalGamePages}
                                                onPageChange={setCurrentGamePage}
                                            />
                                        </div>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                            <TabsContent value="quizzes">
                                <Card>
                                    <CardHeader>
                                        <div className="flex flex-row justify-between">
                                            <CardTitle>Quizzes</CardTitle>
                                            <DialogCreateQuizSimple/>
                                        </div>
                                        <CardDescription>List of all available quizzes</CardDescription>
                                    </CardHeader>
                                    <CardContent className="min-h-[500px]">
                                        {quizzes && quizzes.length != 0 ?
                                            <Table className="">
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>№</TableHead>
                                                        <TableHead>Image</TableHead>
                                                        <TableHead>Quiz Name</TableHead>
                                                        <TableHead>Number of questions</TableHead>
                                                        <TableHead className="text-right ">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {quizzes.map((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell className="cursor-pointer" onClick={() => navigate("/quizzes/room/" + item.id)}>{index + 1}</TableCell>
                                                            <TableCell className="cursor-pointer" onClick={() => navigate("/quizzes/room/" + item.id)}>
                                                                <Avatar className="hidden h-9 w-9 sm:flex">
                                                                    <AvatarImage
                                                                        src={item.gameCoverImageUrl}
                                                                        alt={`${item.gameName}'s profile`}
                                                                    />
                                                                    <AvatarFallback>
                                                                        {(item.gameName.charAt(0) + item.gameName.charAt(1)).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            </TableCell>
                                                            <TableCell className="cursor-pointer" onClick={() => navigate("/quizzes/room/" + item.id)}>{item.gameName}</TableCell>
                                                            <TableCell className="cursor-pointer" onClick={() => navigate("/quizzes/room/" + item.id)}>{item.numberOfQuestions}</TableCell>
                                                            <TableCell className="bg-secondary flex justify-end" >
                                                                <Button variant="outline" size="sm">Изменить</Button>
                                                                <Button variant="destructive" className="ms-3" size="sm" onClick={() => onDeleteQuiz(item.id)}>Удалить</Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                            :
                                            <GameListTabContentRowSkeleton
                                                title=""
                                                items={[ ]}
                                                description=""
                                            />
                                        }
                                    </CardContent>
                                    <CardFooter>
                                        <div className="flex justify-between w-full items-center">
                                            <div className="text-xs text-muted-foreground">
                                                Showing <strong>{(currentQuizPage - 1) * itemsPerPage + 1}</strong> - <strong>{Math.min(currentQuizPage * itemsPerPage, quizzes.length)}</strong> of <strong>{totalQuizPages * itemsPerPage}</strong> quizzes
                                            </div>
                                            <CustomPagination
                                                currentPage={currentQuizPage}
                                                totalPages={totalQuizPages}
                                                onPageChange={setCurrentQuizPage}
                                            />
                                        </div>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                            <TabsContent value="drafts">
                                <Card>
                                    <CardHeader>
                                        <div className="flex flex-row justify-between">
                                            <CardTitle>Drafts</CardTitle>
                                            <DialogCreateQuizSimple/>
                                        </div>
                                        <CardDescription>List of all available quizzes</CardDescription>
                                    </CardHeader>
                                    <CardContent  className="min-h-[500px]">
                                        {drafts && drafts.length != 0 ?
                                            <Table className="">
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>№</TableHead>
                                                        <TableHead>Image</TableHead>
                                                        <TableHead>Quiz Name</TableHead>
                                                        <TableHead>Number of questions</TableHead>
                                                        <TableHead className="text-right ">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {drafts.map((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell className="cursor-pointer" onClick={() => navigate("/admin/drafts/" + item.id)}>{index + 1}</TableCell>
                                                            <TableCell className="cursor-pointer" onClick={() => navigate("/admin/drafts/" + item.id)}>
                                                                <Avatar className="hidden h-9 w-9 sm:flex">
                                                                    <AvatarImage
                                                                        src={item.gameCoverImageUrl}
                                                                        alt={`${item.gameName}'s profile`}
                                                                    />
                                                                    <AvatarFallback>
                                                                        {(item.gameName.charAt(0) + item.gameName.charAt(1)).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            </TableCell>
                                                            <TableCell className="cursor-pointer" onClick={() => navigate("/admin/drafts/" + item.id)}>{item.gameName}</TableCell>
                                                            <TableCell className="cursor-pointer" onClick={() => navigate("/admin/drafts/" + item.id)}>{item.numberOfQuestions}</TableCell>
                                                            <TableCell className="bg-secondary flex justify-end" >
                                                                <Button variant="outline" size="sm">Изменить</Button>
                                                                <Button variant="destructive" className="ms-3" size="sm" onClick={() => onDeleteQuiz(item.id)}>Удалить</Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                            :
                                            <GameListTabContentRowSkeleton
                                                title=""
                                                items={[ ]}
                                                description=""
                                            />
                                        }
                                    </CardContent>
                                    <CardFooter>
                                        <div className="flex justify-between w-full items-center">
                                            <div className="text-xs text-muted-foreground">
                                                Showing <strong>{(currentQuizPage - 1) * itemsPerPage + 1}</strong> - <strong>{Math.min(currentQuizPage * itemsPerPage, quizzes.length)}</strong> of <strong>{totalQuizPages * itemsPerPage}</strong> quizzes
                                            </div>
                                            <CustomPagination
                                                currentPage={currentQuizPage}
                                                totalPages={totalQuizPages}
                                                onPageChange={setCurrentQuizPage}
                                            />
                                        </div>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

