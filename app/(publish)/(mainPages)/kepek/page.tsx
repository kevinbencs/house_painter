import ImagePage from '@/app/_components/image/imageContent'
import Pagination from '@/app/_components/image/pagination'
import { getNumbOfImag, getTwentyImg } from '@/lib/data'
import { cacheLife, cacheTag } from 'next/cache'


const Page = async () => { 

  const [pageNumb, Img] = await Promise.all([
    getNumbOfImag(),
    getTwentyImg(1)
  ])

  return (
    <>
      <section className='mb-40'>
        <h1 className='text-3xl mb-20 text-center'>Képek szobafestésről, felújításról</h1>
        <ImagePage img={Img} />
        <Pagination pageNumber={pageNumb} currentPage={1} />
      </section>
      
    </>
  )
}

export default Page