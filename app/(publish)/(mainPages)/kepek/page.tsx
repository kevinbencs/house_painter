import ImagePage from '@/app/_components/image/imageContent'
import Pagination from '@/app/_components/image/pagination'


const Page = async () => { 

  return (
    <>
      <section>
        <ImagePage img={[]} />
      </section>
      <Pagination pageNumber={20} currentPage={1} />
    </>
  )
}

export default Page