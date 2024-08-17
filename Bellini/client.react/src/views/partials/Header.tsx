import {Button} from "@/components/ui/button";
import { Menu as MenuIcon } from 'lucide-react';
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {useState} from "react";
import {ModeToggle} from "@/components/ui/mode-toggle.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";

export const Header = () => {
    const [open, setOpen] = useState(false);
    return (
        <> 
            <header className="sticky top-0 w-full shadow-md">
                <div className="flex items-center justify-between p-4">
                    <div className="text-xl font-bold">My Logo</div>
                    <div className="hidden md:flex space-x-4">
                        <Button variant="link">Home</Button>
                        <Button variant="link">About</Button>
                        <Button variant="link">Contact</Button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ModeToggle/>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
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