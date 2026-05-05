import ImagePage from '@/app/_components/image/imageContent'
import Pagination from '@/app/_components/image/pagination'
import { getNumbOfImag, getTwentyImg } from '@/lib/data'

const Main = async ({ params }: { params: Promise<{ page: string }> }) => {

    const { page } = await params

    if(isNaN(Number(page)) || Number(page) <= 0) return(
        <>
            <div>Az oldal nem létezik</div>
        </>
    )

    const Img = await getTwentyImg(Number(page))

    if (Img.length === 0) return(
        <>
            <div>Az oldal nem létezik</div>
        </>
    )

    const pageNumb = await getNumbOfImag()

    return (
        <>
            <ImagePage img={Img} />
            <Pagination pageNumber={pageNumb} currentPage={Number(page)} />
        </>
    )
}

export default Main