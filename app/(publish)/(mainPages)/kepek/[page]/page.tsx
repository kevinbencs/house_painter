import ImagePage from '@/app/_components/image/imageContent'
import Pagination from '@/app/_components/image/pagination'


const page = ({params}: {params: {page: number}}) => {
  return (
    <>
    <section>
      <ImagePage img={[]}/>
    </section>
    <Pagination page={params.page}/>
    </>
  )
}

export default page