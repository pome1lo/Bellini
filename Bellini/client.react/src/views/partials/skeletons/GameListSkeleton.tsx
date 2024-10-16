import {TableCell, TableRow} from "@/components/ui/table.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";

export const GameListTabContentTableRow = () => {
  return (
      <TableRow>
          <TableCell className="hidden sm:table-cell"><Skeleton className="rounded-md h-16 w-16"/></TableCell>
          <TableCell><Skeleton className="w-20 h-3"/></TableCell>
          <TableCell><Skeleton className="w-16 h-3"/></TableCell>
          <TableCell className="hidden md:table-cell"><Skeleton className="w-16 h-3"/></TableCell>
          <TableCell className="hidden md:table-cell"><Skeleton className="w-10 h-3"/></TableCell>
          <TableCell className="hidden md:table-cell"><Skeleton className="w-32 h-3"/></TableCell>
          <TableCell><Skeleton className="w-10 h-3"/></TableCell>
      </TableRow>
  )
}