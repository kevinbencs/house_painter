import ImagePage from '@/app/_components/image/imageContent'
import Main from '@/app/_components/image/main'
import Pagination from '@/app/_components/image/pagination'
import { getNumbOfImagPage, getTwentyImg } from '@/lib/data'
import { connectToMongo } from '@/lib/mongo'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'


export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const param = await params
  const page = Number(param.page)


  let canonical = ''
  if (page === 1) canonical = '/Kepek'
  else {
    canonical = `/kepek/${page}`
  }

  return ({
    title: 'Képek - ' + page + ".oldal",
    description: 'Fotók elkészült szobafestési, mázolási és tapétázási munkáimról Budapesten és környékén. Nézze meg, milyen minőségre számíthat!',
    keywords: ['felújítás képek', 'tapétázás', "szobafestés képek", "tapétázás képek"],
    alternates: { canonical },
    openGraph: {
      siteName: 'Bencsfestő',
      url: process.env.URL + '/kepek',
      locale: 'hu_HU',
      type: 'website',
      title: 'Képek - ' + page + ".oldal",
      description: 'Fotók elkészült szobafestési, mázolási és tapétázási munkáimról Budapesten és környékén. Nézze meg, milyen minőségre számíthat!',
      images: [{ url: "/images/zold-fal.jpeg", alt: 'Bencsfestő - zöld fal' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Képek - ' + page + ".oldal",
      description: 'Fotók elkészült szobafestési, mázolási és tapétázási munkáimról Budapesten és környékén. Nézze meg, milyen minőségre számíthat!',
      images: [{ url: "/images/zold-fal.jpeg", alt: 'Bencsfestő - zöld fal' }],
    },
  })
}


export async function generateStaticParams() {

  await connectToMongo()

  const pageNum = await getNumbOfImagPage();

  if (pageNum === 0) return ([{ heading: '__placeholder__' }])

  const pageNumArr: number[] = []

  for (let i = 1; i <= pageNum; i++) {
    pageNumArr.push(i)
  }

  return pageNumArr.map((item) => ({ page: String(item) }))
}



const PageContent = async ({ params }: { params: Promise<{ page: string }> }) => {
  const param = await params

  if (param.page === '__placeholder__') notFound()

  const page = Number(param.page)


  if (page <= 0 || isNaN(page)) notFound()


  const [pageNumb, Img] = await Promise.all([
    getNumbOfImagPage(),
    getTwentyImg(page)
  ])


  if (page > pageNumb) notFound()

  return (
    <section className='mb-40'>
      <h1 className='text-3xl mb-20 text-center mt-10'>Képek szobafestésről, felújításról</h1>
      <div className='lg:pl-[calc(50%-450px)] lg:pr-[calc(50%-450px)] pl-2 pr-2'>
        <ImagePage img={Img} />
        <Pagination pageNumber={pageNumb} currentPage={page} />
      </div>

    </section>


  )
}




const Page = async ({ params }: { params: Promise<{ page: string }> }) => {

  return (
    <Suspense fallback={<div className='text-center mt-10 min-h-[50vh]'>Töltődik...</div>}>
      <PageContent params={params} />
    </Suspense>
  )

}

export default Page