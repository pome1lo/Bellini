import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Table, TableBody} from "@/components/ui/table.tsx";
import {GameListTabContentTableRow} from "@/components/skeletons/gameListSkeleton.tsx";
import {Breadcrumbs} from "@/components/breadcrumbs.tsx";
import React from "react";

interface GameListTabContentRowSkeletonProps {
    title: string;
    description: string;
    items: { path: string, name: string }[];
}

export const GameListTabContentRowSkeleton:React.FC<GameListTabContentRowSkeletonProps> = ({title, description, items}) => {
    return (
        <>
            {items.length > 0 ? <Breadcrumbs items={items}/> : <></>}
            <Card className="max-w-[1440px] w-full mx-auto">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableBody>
                            <GameListTabContentTableRow/>
                            <GameListTabContentTableRow/>
                            <GameListTabContentTableRow/>
                            <GameListTabContentTableRow/>
                            <GameListTabContentTableRow/>
                            <GameListTabContentTableRow/>
                            <GameListTabContentTableRow/>
                            <GameListTabContentTableRow/>
                            <GameListTabContentTableRow/>
                            <GameListTabContentTableRow/>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    )
}