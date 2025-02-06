import React from "react";
import {Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious} from "@/components/ui/pagination.tsx";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const CustomPagination: React.FC<PaginationProps> = ({
                                                         currentPage,
                                                         totalPages,
                                                         onPageChange
                                                     }) => {


    const handlePageChange = (page: number, totalPages: number, setCurrentPage: (arg: number) => void) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div>
            <Pagination>
                <PaginationContent>
                    <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1, totalPages, onPageChange)}
                        disabled={currentPage === 1}
                    />
                    {currentPage > 2 && (
                        <PaginationItem>
                            <PaginationLink onClick={() => handlePageChange(1, totalPages, onPageChange)}>1</PaginationLink>
                        </PaginationItem>
                    )}
                    {currentPage > 3 && <PaginationEllipsis/>}
                    {currentPage > 1 && (
                        <PaginationItem>
                            <PaginationLink onClick={() => handlePageChange(currentPage - 1, totalPages, onPageChange)}>
                                {currentPage - 1}
                            </PaginationLink>
                        </PaginationItem>
                    )}
                    <PaginationItem>
                        <PaginationLink isActive>{currentPage}</PaginationLink>
                    </PaginationItem>
                    {currentPage < totalPages && (
                        <PaginationItem>
                            <PaginationLink onClick={() => handlePageChange(currentPage + 1, totalPages, onPageChange)}>
                                {currentPage + 1}
                            </PaginationLink>
                        </PaginationItem>
                    )}
                    {currentPage < totalPages - 2 && <PaginationEllipsis/>}
                    {currentPage < totalPages - 1 && (
                        <PaginationItem>
                            <PaginationLink onClick={() => handlePageChange(totalPages, totalPages, onPageChange)}>
                                {totalPages}
                            </PaginationLink>
                        </PaginationItem>
                    )}
                    <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1, totalPages, onPageChange)}
                        disabled={currentPage === totalPages}
                    />
                </PaginationContent>
            </Pagination>
        </div>
    );
};
