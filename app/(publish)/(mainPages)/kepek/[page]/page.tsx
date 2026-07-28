import ImagePage from '@/app/_components/image/imageContent'
import Main from '@/app/_components/image/main'
import Pagination from '@/app/_components/image/pagination'
import {  getNumbOfImagPage, getTwentyImg } from '@/lib/data'
import { connectToMongo } from '@/lib/mongo'
import { Metadata } from 'next'
import { cacheTag } from 'next/cache'
import { cacheLife } from 'next/cache'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Képek',
  description: 'Képek a szobafestésről, tapétázásról és egyéb felújításai munkálatokról.',
  keywords: ['szobafestés', 'tapétázás', "szobafestés képek", "tapétázás képek"],
  openGraph: {
    siteName: 'Budafestő',
    locale: 'hu_HU',
    type: 'website',
    images: [{ url: "/api/images", alt: 'Budafestő - Képek' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Képek",
    description: 'Képek a szobafestésről, tapétázásról és egyéb felújításai munkálatokról.',
    images: [{ url: "/api/images", alt: 'Budafestő - Képek' }],
  },

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




const Page = async ({ params }: { params: Promise<{ page: string }> }) => {
  'use cache'

  const param = await params

  if (param.page === '__placeholder__') notFound()

  cacheTag('image-site-' + param.page)
  cacheLife('days')

  const page = Number(param.page)

  

  if (page <= 0 || isNaN(page)) notFound()



  const [pageNumb, Img] = await Promise.all([
    getNumbOfImagPage(),
    getTwentyImg(page)
  ])


  if(page > pageNumb ) notFound()

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

export default Page