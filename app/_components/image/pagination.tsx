
import {
    Pagination as PaginationRoot,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

const Pagination = (props: { pageNumber: number, currentPage: number }) => {

    if (props.pageNumber === 1) return (<></>)

    return (
        <PaginationRoot>
            <PaginationContent>
                {props.currentPage > 1 &&
                    <>
                        <PaginationItem>
                            <PaginationLink href="/kepek/1" >1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationPrevious href={`kepek/${props.currentPage - 1}`} />
                        </PaginationItem>
                    </>
                }
                {props.currentPage > 2 &&
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                }

                <PaginationItem>
                    <PaginationLink href={props.currentPage === 1 ? "kepek/1" : `kepek/${props.currentPage - 1}`} isActive={props.currentPage === 1}>
                        {props.currentPage === 1 ? 1 : props.currentPage - 1}
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href={props.currentPage === 1 ? "kepek/2" : props.currentPage === props.pageNumber ? `kepek/${props.pageNumber - 1}` : `kepek/${props.currentPage}`} isActive={props.currentPage !== 1 && props.currentPage !== props.pageNumber}>
                        {props.currentPage === 1 ? 2 : props.currentPage === props.pageNumber ? props.pageNumber - 1 : props.currentPage}
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href={props.currentPage === props.pageNumber ? `kepek/${props.currentPage}` : `kepek/${props.currentPage + 1}`} isActive={props.currentPage === props.pageNumber}>
                        {props.currentPage === props.pageNumber ? props.currentPage : props.currentPage + 1}
                    </PaginationLink>
                </PaginationItem>

                {props.pageNumber - 2 > props.currentPage &&
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                }

                {props.currentPage !== props.pageNumber &&
                    <>
                        <PaginationItem>
                            <PaginationNext href={`kepek/${props.currentPage + 1}`} />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href={`kepek/${props.pageNumber}`}>{ }</PaginationLink>
                        </PaginationItem>
                    </>

                }

            </PaginationContent>
        </PaginationRoot>
    )
}

export default Pagination