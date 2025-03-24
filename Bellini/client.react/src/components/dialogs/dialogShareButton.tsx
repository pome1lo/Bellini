import {Copy} from "lucide-react"

import {Button} from "@/components/ui/button.tsx"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx"
import {Input} from "@/components/ui/input.tsx"
import {Label} from "@/components/ui/label.tsx"
import React from "react";

interface DialogShareButtonProps {
    link: string;
}

export const DialogShareButton: React.FC<DialogShareButtonProps> = ({link}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Поделиться</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Поделиться ссылкой</DialogTitle>
                    <DialogDescription>
                        Любой, у кого есть эта ссылка, сможет ее просмотреть.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Ссылка
                        </Label>
                        <Input
                            id="link"
                            defaultValue={link}
                            readOnly
                        />
                    </div>
                    <Button type="submit" size="sm" className="px-3">
                        <span className="sr-only">Копировать</span>
                        <Copy className="h-4 w-4"/>
                    </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Закрыть
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
