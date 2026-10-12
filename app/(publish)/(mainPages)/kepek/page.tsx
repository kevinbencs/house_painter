import ImagePage from '@/app/_components/image/imageContent'
import Pagination from '@/app/_components/image/pagination'
import {  getNumbOfImagPage, getTwentyImg } from '@/lib/data'
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Képek',
  description: 'Fotók elkészült szobafestési, mázolási és tapétázási munkáimról Budapesten és környékén. Nézze meg, milyen minőségre számíthat!',

  keywords: ['felújítás képek', 'tapétázás', "szobafestés képek", "tapétázás képek"],
  alternates: {canonical: '/kepek'},
  openGraph: {
    siteName: 'Bencsfestő',
    url: process.env.URL+'/kepek',
    locale: 'hu_HU',
    type: 'website',
    title: "Képek",
    description: 'Fotók elkészült szobafestési, mázolási és tapétázási munkáimról Budapesten és környékén. Nézze meg, milyen minőségre számíthat!',
    images: [{ url: "/images/zold-fal.jpeg", alt: 'Bencsfestő - zöld fal' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Képek",
    description: 'Fotók elkészült szobafestési, mázolási és tapétázási munkáimról Budapesten és környékén. Nézze meg, milyen minőségre számíthat!',
    images: [{ url: "/images/zold-fal.jpeg", alt: 'Bencsfestő - zöld fal' }],
  },

}



const Page = async () => {

  const [pageNumb, Img] = await Promise.all([
   getNumbOfImagPage(),
    getTwentyImg(1)
  ])

  return (
    <>
      <section className='mb-40'>
        <h1 className='text-3xl mb-20 text-center mt-10'>Képek szobafestésről, felújításról</h1>
        <div className='lg:pl-[calc(50%-450px)] lg:pr-[calc(50%-450px)] pl-2 pr-2'>
          <ImagePage img={Img} />
          <Pagination pageNumber={pageNumb} currentPage={1} />
        </div>

      </section>

    </>
  )
}

export default Page