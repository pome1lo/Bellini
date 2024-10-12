import {Breadcrumbs} from "@/views/partials/Breadcrumbs.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "@/components/ui/tabs"
import {File, ListFilter, RefreshCcw} from "lucide-react"
import {Button} from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {DialogCreateGame} from "@/views/partials/DialogCreateGame.tsx";
import {GamesListTabContent} from "@/views/partials/GamesListTabContent.tsx";
import {useState} from "react";

const breadcrumbItems = [
    {path: '/', name: 'Home'},
    {path: '/games', name: 'Games'},
];

export const GameListPage = () => {
    const [isUpdated, setIsUpdated] = useState<boolean>(false);
    const [isCreated, setIsCreated] = useState<boolean>(false);
    return (
        <>
            <Breadcrumbs items={breadcrumbItems}/>
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <Tabs defaultValue="all">
                    <div className="flex items-center">
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="public">Public</TabsTrigger>
                            <TabsTrigger value="private">Private</TabsTrigger>
                            <TabsTrigger value="archived" className="hidden sm:flex">Archived</TabsTrigger>
                        </TabsList>
                        <div className="ml-auto flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 gap-1">
                                        <ListFilter className="h-3.5 w-3.5"/>
                                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuCheckboxItem checked>Public</DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem>Private</DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button size="sm" variant="outline" className="h-8 gap-1">
                                <File className="h-3.5 w-3.5"/>
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 gap-1"
                                    onClick={() => setIsUpdated(!isUpdated)}>
                                <RefreshCcw className="h-3.5 w-3.5"/>
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Update</span>
                            </Button>
                            <DialogCreateGame
                                setIsCreated={setIsCreated}
                                isCreated={isCreated}
                            />
                        </div>
                    </div>
                    <TabsContent value="all">
                        <GamesListTabContent tabContentName="all" isUpdated={isUpdated} isCreated={isCreated}/>
                    </TabsContent>
                    <TabsContent value="public">
                        <GamesListTabContent tabContentName="public" isUpdated={isUpdated} isCreated={isCreated}/>
                    </TabsContent>
                    <TabsContent value="private">
                        <GamesListTabContent tabContentName="private" isUpdated={isUpdated} isCreated={isCreated}/>
                    </TabsContent>
                    <TabsContent value="archived">
                        <GamesListTabContent tabContentName="archived" isUpdated={isUpdated} isCreated={isCreated}/>
                    </TabsContent>
                </Tabs>
            </main>
        </>
    )
}