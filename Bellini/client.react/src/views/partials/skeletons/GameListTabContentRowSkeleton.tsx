import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Table, TableBody} from "@/components/ui/table.tsx";
import {GameListTabContentTableRow} from "@/views/partials/skeletons/GameListSkeleton.tsx";

export const GameListTabContentRowSkeleton = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Games</CardTitle>
                <CardDescription>
                    description description description
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
    )
}