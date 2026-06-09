import ImagePage from '@/app/_components/image/imageContent'
import Pagination from '@/app/_components/image/pagination'
import { getNumbOfImag, getTwentyImg } from '@/lib/data'
import { notFound } from 'next/navigation'

const Main = async ({ params }: { params: Promise<{ page: string }> }) => {

    const { page } = await params

    if (isNaN(Number(page)) || Number(page) <= 0) notFound()

    const [pageNumb, Img] = await Promise.all([
        getNumbOfImag(),
        getTwentyImg(Number(page))
    ])

    if (Img.length === 0) notFound



    return (
        <>
            <ImagePage img={Img} />
            <Pagination pageNumber={pageNumb} currentPage={Number(page)} />
        </>
    )
}

export default Main