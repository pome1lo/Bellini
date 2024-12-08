import { Breadcrumbs } from "@/views/partials/Breadcrumbs.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListFilter, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import { DialogCreateGame } from "@/views/partials/dialogs/DialogCreateGame.tsx";
import { GamesListTabContent } from "@/views/partials/GamesListTabContent.tsx";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const breadcrumbItems = [
    { path: '/', name: 'Home' },
    { path: '/games', name: 'Games' },
];

export const GameListPage = () => {
    const [isUpdated, setIsUpdated] = useState<boolean>(false);
    const [isCreated, setIsCreated] = useState<boolean>(false);
    const { tabName } = useParams();
    const navigate = useNavigate();

    const validTabs = ["all", "public", "private", "completed"];

    useEffect(() => {
        if (tabName) {
            if (!validTabs.includes(tabName)) {
                navigate('/404');
            }
        }
    }, [tabName, navigate]);

    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />
            <main className="grid mt-2 flex-1 items-start gap-4 sm:py-0 md:gap-8 max-w-[1440px] w-full mx-auto">
                <Tabs defaultValue={tabName && validTabs.includes(tabName) ? tabName : "all"}>
                    <div className="flex items-center">
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="public">Public</TabsTrigger>
                            <TabsTrigger value="private">Private</TabsTrigger>
                            <TabsTrigger value="completed" className="hidden sm:flex">Completed</TabsTrigger>
                        </TabsList>
                        <div className="ml-auto flex items-center gap-2">
                            <Button size="sm" variant="outline" className="h-8 gap-1"
                                    onClick={() => setIsUpdated(!isUpdated)}>
                                <RefreshCcw className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Update</span>
                            </Button>
                            <DialogCreateGame
                                setIsCreated={setIsCreated}
                                isCreated={isCreated}
                            />
                        </div>
                    </div>
                    <TabsContent value="all">
                        <GamesListTabContent tabContentName="all" isUpdated={isUpdated} isCreated={isCreated} />
                    </TabsContent>
                    <TabsContent value="public">
                        <GamesListTabContent tabContentName="public" isUpdated={isUpdated} isCreated={isCreated} />
                    </TabsContent>
                    <TabsContent value="private">
                        <GamesListTabContent tabContentName="private" isUpdated={isUpdated} isCreated={isCreated} />
                    </TabsContent>
                    <TabsContent value="completed">
                        <GamesListTabContent tabContentName="completed" isUpdated={isUpdated} isCreated={isCreated} />
                    </TabsContent>
                </Tabs>
            </main>
        </>
    );
};
