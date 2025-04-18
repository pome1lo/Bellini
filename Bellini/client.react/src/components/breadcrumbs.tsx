import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu.tsx"
import React from "react";

interface BreadcrumbsProps {
    items: { path: string, name: string }[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({items}) => {
    const maxItems = 4;

    return (
        <div className="max-w-[1440px] w-full mx-auto mb-5 lg:px-1 pt-3 px-4">
            <Breadcrumb>
                <BreadcrumbList>
                    {items.length > maxItems ? (
                        <>
                            <BreadcrumbItem>
                                <BreadcrumbLink href={items[0].path}>{items[0].name}</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-1">
                                        <BreadcrumbEllipsis className="h-4 w-4"/>
                                        <span className="sr-only">Переключение меню</span>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        {items.slice(1, items.length - maxItems + 1).map((item, index) => (
                                            <DropdownMenuItem key={index}>
                                                <BreadcrumbLink href={item.path}>{item.name}</BreadcrumbLink>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator/>
                            {items.slice(items.length - maxItems + 1).map((item, index) => (
                                <React.Fragment key={index}>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href={item.path}>{item.name}</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    {index < maxItems - 2 && <BreadcrumbSeparator/>}
                                </React.Fragment>
                            ))}
                        </>
                    ) : (
                        items.map((item, index) => (
                            <React.Fragment key={index}>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={item.path}>{item.name}</BreadcrumbLink>
                                </BreadcrumbItem>
                                {index < items.length - 1 && <BreadcrumbSeparator/>}
                            </React.Fragment>
                        ))
                    )}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
};