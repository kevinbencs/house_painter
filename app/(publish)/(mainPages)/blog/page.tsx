import ImgBSP  from '@/app/_components/bsp/img'
import { getBlogList } from '@/lib/data'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
title: "Blog - tippek szobafestéshez és felújításhoz",
  description: "Hasznos tanácsok szobafestésről, glettelésről és mázolásról: színválasztás, felkészülés a festésre, árak és gyakori hibák, több, mint 20 év tapasztalatával.",
  keywords: ['budapest szobafestés ', 'tisztasági festés budapest és környéke', 'tapétázás budapest'],
  openGraph: {
    title: 'Blog - tippek szobafestéshez és felújításhoz',
    description: 'Hasznos tanácsok szobafestésről, glettelésről és mázolásról: színválasztás, felkészülés a festésre, árak és gyakori hibák, több, mint 20 év tapasztalatával.',
    url: process.env.URL+"/helyek",
    siteName: 'Bencsfestő',
    locale: 'hu_HU',
    type: 'website',
    images: [{ url: "/images/zold-fal.jpeg", alt: 'Bencsfestő - zöld fal' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Blog - tippek szobafestéshez és felújításhoz",

    description: 'Hasznos tanácsok szobafestésről, glettelésről és mázolásról: színválasztás, felkészülés a festésre, árak és gyakori hibák, több, mint 20 év tapasztalatával.',
    images: [{ url: "/images/zold-fal.jpeg", alt: 'Bencsfestő - zöld fal' }],
  },
}


const page = async() => {
 const data = await getBlogList()


  return (
    <section className='mb-10'>
      <h1 className='text-3xl mb-20 text-center mt-10'>Blogok</h1>
      <ul className='flex gap-4 flex-wrap justify-between lg:pl-[calc(50%-450px)] lg:pr-[calc(50%-450px)] pl-2 pr-2'>
        {data.map((item) => <li key={"blog-"+String(item._id)}>
          <Link className="hover:text-gray-100 flex flex-col gap-2 bg-gray-500" href={`blog/${item.heading.replaceAll(" ","-")}`}>
           <ImgBSP  url={item.newUrl} detail={item.detail}/>
          <h2>{item.heading}</h2>
          </Link>
        </li>)}
      </ul>
    </section>
  )
}

export default page