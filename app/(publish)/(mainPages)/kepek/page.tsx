import ImagePage from '@/app/_components/image/imageContent'
import Pagination from '@/app/_components/image/pagination'
import { getNumbOfImag, getTwentyImg } from '@/lib/data'
import { Metadata } from 'next'
import { cacheLife, cacheTag } from 'next/cache'


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