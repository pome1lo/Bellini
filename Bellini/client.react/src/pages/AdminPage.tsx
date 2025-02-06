import {useEffect, useState} from "react";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
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

    const [isUpdated, setIsUpdated] = useState<boolean>(false);
    const [isCreated, setIsCreated] = useState<boolean>(false);

    const [users, setUsers] = useState<UserProfile[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [games, setGames] = useState<Game[]>([]);


    useEffect(() => {
        serverFetch(`/profile/all-data`)
            .then(response => response.json())
            .then(data => {
                setUsers(data);
                console.log(data)
            });
    }, [isUpdated]);

    useEffect(() => {
        serverFetch(`/quizzes/all-data`)
            .then(response => response.json())
            .then(data => {
                setQuizzes(data);
                console.log(data)
            });
    }, [isUpdated]);

    useEffect(() => {
        serverFetch(`/game/all-data`)
            .then(response => response.json())
            .then(data => {
                setGames(data);
                console.log(data)
            });
    }, [isUpdated]);

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
                                </TabsList>
                                <Button size="sm" variant="outline" className="h-8 gap-1"
                                        onClick={() => setIsUpdated(!isUpdated)}>
                                    <RefreshCcw className="h-3.5 w-3.5"/>
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Update</span>
                                </Button>
                            </div>
                            <TabsContent value="users">
                                <Card>
                                    <CardHeader className="flex flex-row justify-between">
                                        <CardTitle>Users</CardTitle>
                                        <DialogCreateGame
                                            setIsCreated={setIsCreated}
                                            isCreated={isCreated}
                                        />
                                    </CardHeader>
                                    <CardContent>
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
                                                {users && users.length != 0 ?
                                                    <>
                                                        {users.map((item, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell>
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
                                                                <TableCell>{item.username}</TableCell>
                                                                <TableCell>{item.email}</TableCell>
                                                                <TableCell>{item.firstName}</TableCell>
                                                                <TableCell>{item.lastName}</TableCell>
                                                                <TableCell>
                                                                    {item.isAdmin ? <PiCrownSimpleBold/> : <MdOutlineDoNotDisturbAlt/>}
                                                                </TableCell>
                                                                <TableCell className="bg-secondary flex justify-end">

                                                                    <Button variant="outline" size="sm">Изменить</Button>
                                                                    <Button variant="destructive" className="ms-3" size="sm">Удалить</Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </>
                                                    :
                                                    <>
                                                        users not found
                                                    </>
                                                }
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                    <CardFooter>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                            <TabsContent value="games">
                                <Card>
                                    <CardHeader className="flex flex-row justify-between">
                                        <CardTitle>Games</CardTitle>
                                        <DialogCreateGame
                                            setIsCreated={setIsCreated}
                                            isCreated={isCreated}
                                        />
                                    </CardHeader>
                                    <CardContent>
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
                                                {games && games.length != 0 ?
                                                    <>
                                                        {games.map((item, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell>
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
                                                                <TableCell>{item.gameName}</TableCell>
                                                                <TableCell>{item.status.name}</TableCell>
                                                                <TableCell>{item.startTime.toString()}</TableCell>
                                                                <TableCell>{item.createTime.toString()}</TableCell>
                                                                <TableCell>{item.maxPlayers}</TableCell>
                                                                <TableCell>{item.isPrivate ? "True" : "False"}</TableCell>
                                                                <TableCell className="bg-secondary flex justify-end">
                                                                    <Button variant="outline" size="sm">Изменить</Button>
                                                                    <Button variant="destructive" className="ms-3" size="sm">Удалить</Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </>
                                                    :
                                                    <>
                                                        игОр нет
                                                    </>
                                                }
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                    <CardFooter>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                            <TabsContent value="quizzes">
                                <Card>
                                    <CardHeader className="flex flex-row justify-between">
                                        <CardTitle>Quizzes</CardTitle>
                                        <DialogCreateGame
                                            setIsCreated={setIsCreated}
                                            isCreated={isCreated}
                                        />
                                    </CardHeader>
                                    <CardContent>
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
                                                {quizzes && quizzes.length != 0 ?
                                                    <>
                                                        {quizzes.map((item, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell>
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
                                                                <TableCell>{item.gameName}</TableCell>
                                                                <TableCell>{item.questions.length}</TableCell>
                                                                <TableCell className="bg-secondary flex justify-end">
                                                                    <Button variant="outline" size="sm">Изменить</Button>
                                                                    <Button variant="destructive" className="ms-3" size="sm">Удалить</Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </>
                                                    :
                                                    <>
                                                        quizzes not found
                                                    </>
                                                }
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                    <CardFooter>
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