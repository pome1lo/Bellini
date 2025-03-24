import {Button} from "@/components/ui/button.tsx";
import {Menu as MenuIcon} from 'lucide-react';
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet.tsx";
import React, {useEffect, useState} from "react";
import {ModeToggle} from "@/components/ui/mode-toggle.tsx";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger, navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu.tsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {IoNotificationsOutline} from "react-icons/io5";
import {Link, useNavigate} from "react-router-dom";

import {cn} from "@/lib/utils.ts"
import {useAuth} from "@/utils/context/authContext.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {PiCrownSimpleFill} from "react-icons/pi";

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Все игры",
        href: "/games/all",
        description:
            "В этом разделе собраны все игры из частных и общедоступных категорий.",
    },
    {
        title: "Публичные игры",
        href: "/games/public",
        description:
            "В этом разделе собраны все игры из категории общедоступных.",
    },
    {
        title: "Приватные игры",
        href: "/games/private",
        description:
            "В этом разделе собраны все игры из категории Приватных.",
    },
    {
        title: "Завершенные игры",
        href: "/games/completed",
        description: "Все завершенные игры представлены в этом разделе.",
    },
]


export const Header = () => {
    const {user, isAuthenticated, logout} = useAuth();
    const [open, setOpen] = useState(false);
    const [userImage, setUserImage] = useState("");
    const navigate = useNavigate();

    function navigateTo(str: string): void {
        setOpen(false);
        navigate(str);
    }

    useEffect(() => {
        setUserImage(user ? user.profileImageUrl : "");
    }, [user]);

    return (
        <>
            <header className="sticky top-0 z-50 w-full shadow-md backdrop-blur">
                <div className="flex items-center justify-between p-2 max-w-[1440px] w-full mx-auto">
                    <Link to={"/"} className="text-3xl text-shrikhand">
                        Bellini
                    </Link>
                    <NavigationMenu className="hidden md:flex ">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Викторины</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                        <li className="row-span-3">
                                            <NavigationMenuLink asChild>
                                                <a
                                                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                    href="/quizzes"
                                                >
                                                    <div className="mb-2 mt-4 text-lg font-medium">
                                                        Bellini
                                                    </div>
                                                    <p className="text-sm leading-tight text-muted-foreground">
                                                        Веб-приложение, предназначенное для организации интеллектуальных игр и управления ими
                                                        игры с интегрированными элементами социальных сетей,
                                                    </p>
                                                </a>
                                            </NavigationMenuLink>
                                        </li>
                                        <ListItem href="/quizzes" title="Все">
                                            Все тесты будут представлены здесь.
                                        </ListItem>
                                        <ListItem href="/quizzes" title="Новые">
                                            Все новые тесты будут отображаться здесь.
                                        </ListItem>
                                        <ListItem href="/quizzes" title="Завершенные">
                                            Все тесты, которые вы выполнили, будут отображены здесь.
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Игры</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                        {components.map((component) => (
                                            <ListItem
                                                key={component.title}
                                                title={component.title}
                                                href={component.href}
                                            >
                                                {component.description}
                                            </ListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link to={"/about"}>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        О нас
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                    <div className="flex items-center space-x-4  ">
                        <Button variant="ghost" onClick={() => navigate("/notifications")}
                                className="relative animate-bounce">
                            <IoNotificationsOutline className="text-xl"/>
                            <span className="bg-red-700 p-1 absolute top-[10px] left-[28px] rounded-full"></span>
                        </Button>
                        <ModeToggle/>
                        {user && isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <>
                                            <Avatar className="h-9 w-9 flex">
                                                <AvatarImage
                                                    src={userImage}
                                                    alt={`${user.username}'s profile`}
                                                />
                                                <AvatarFallback>
                                                    {(user.username.charAt(0) + user.username.charAt(1)).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="sr-only">Toggle user menu</span>
                                        </>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                        <p className="flex items-center text-sm font-medium leading-none">
                                            <PiCrownSimpleFill className={`fill-yellow-500 me-1 mb-[-2px]
                                                ${user.isAdmin ? "block" : "hidden"}`} height={150} width={150}/>
                                            <span>{user.username}</span>
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem
                                        onClick={() => navigate(`/admin`)}
                                        className={user.isAdmin ? "block" : "hidden"}
                                    >
                                        Панель администратора
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate(`/profile/${user.id}`)}>Профиль</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate(`/settings`)}>Настройки</DropdownMenuItem>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem onClick={logout}>Выйти</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button variant="outline" onClick={() => navigate('/login')}>Войти</Button>
                        )}

                        <div className="md:hidden">
                            <Sheet open={open} onOpenChange={setOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MenuIcon/>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left">
                                    <div className="flex flex-col space-y-4 p-4">
                                        <Button variant="link" onClick={() => navigateTo("/")}>Домой</Button>
                                        <Button variant="link" onClick={() => navigateTo("/quizzes")}>Викторины</Button>
                                        <Button variant="link" onClick={() => navigateTo("/games")}>Игры</Button>
                                        <Button variant="link" onClick={() => navigateTo("/about")}>О нас</Button>
                                        <Button variant="link" onClick={() => navigateTo("/contact")}>Контакты</Button>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(({
                                                                                                   className,
                                                                                                   title,
                                                                                                   children,
                                                                                                   ...props
                                                                                               }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"