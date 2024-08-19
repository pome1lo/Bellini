import {Button} from "@/components/ui/button";
import {CircleUser, Menu as MenuIcon} from 'lucide-react';
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import React, {useState} from "react";
import {ModeToggle} from "@/components/ui/mode-toggle.tsx";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {IoNotificationsOutline} from "react-icons/io5";
import {useNavigate} from "react-router-dom";

export const Header = () => {
    const [open, setOpen] = useState(false);
    const email= useState(sessionStorage.getItem('__email'));
    const username = useState(sessionStorage.getItem('__username'));


    const navigate = useNavigate();
    return (
        <>
            <header className="sticky top-0 z-50 w-full shadow-md backdrop-blur">
                <div className="flex items-center justify-between p-4">
                    <div className="text-xl font-bold">My Logo</div>
                    <NavigationMenu className="hidden md:flex ">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <NavigationMenuLink>Link</NavigationMenuLink>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <NavigationMenuLink>Link</NavigationMenuLink>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="p-2">
                                        <p>asdassadasd</p>
                                        <NavigationMenuLink>asdas</NavigationMenuLink>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" onClick={() => navigate("profile/notifications")}>
                            <IoNotificationsOutline className="text-xl"/>
                        </Button>
                        <ModeToggle/>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="rounded-full">
                                    <CircleUser className="h-5 w-5"/>
                                    <span className="sr-only">Toggle user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                    <p className="text-sm font-medium leading-none">{username}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{email}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuItem>Support</DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <div className="md:hidden">
                            <Sheet open={open} onOpenChange={setOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MenuIcon/>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left">
                                    <div className="flex flex-col space-y-4 p-4">
                                        <Button variant="link" onClick={() => setOpen(false)}>Home</Button>
                                        <Button variant="link" onClick={() => setOpen(false)}>About</Button>
                                        <Button variant="link" onClick={() => setOpen(false)}>Contact</Button>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}