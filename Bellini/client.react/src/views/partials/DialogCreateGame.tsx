import {PlusCircle} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

export const DialogCreateGame = () => {
    return (
        <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5"/>
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Create game</span>
        </Button>
    )
}