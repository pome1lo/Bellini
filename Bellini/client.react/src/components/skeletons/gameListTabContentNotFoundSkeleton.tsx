import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious} from "@/components/ui/pagination.tsx";

export const GameListTabContentNotFoundSkeleton = () => {
    return (
        <Card className="border-2">
            <CardHeader>
                <CardTitle>Игры</CardTitle>
                <CardDescription>
                    Здесь вы увидите доступные игры для выбранной вами категории
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[53vh] flex justify-center items-center">
                <div className="flex">
                    <h1 className="text-3xl font-bold">Мы ничего не нашли</h1>
                    <h1 className="text-4xl font-bold animate-bounce">😪</h1>
                </div>
            </CardContent>
            <CardFooter>
                <div className="flex justify-between w-full items-center">
                    <div className="text-xs text-muted-foreground">
                        Показаны игры 1:1
                    </div>
                    <Pagination className="justify-end">
                        <PaginationContent>
                            <PaginationPrevious/>
                            <PaginationItem>
                                <PaginationLink>1</PaginationLink>
                            </PaginationItem>
                            <PaginationNext/>
                        </PaginationContent>
                    </Pagination>
                </div>
            </CardFooter>
        </Card>
    )
}