import ImgBSP from '@/app/_components/bsp/img'
import { getPlaceList } from '@/lib/data'
import { Metadata } from 'next'
import Link from 'next/link'


export const metadata: Metadata = {
title: "Szobafestés Budapest minden kerületében és a környező településeken",
  description: "Szobafestés, mázolás, tapétázás és glettelés Budapest mind a 23 kerületében és a környező településeken. Díjtalan felmérés és árajánlat - nézze meg, hol vállalok munkát!",
  keywords: ['budapest szobafestés ', 'tisztasági festés budapest és környéke', 'tapétázás budapest'],
  openGraph: {
    title: 'Szobafestés Budapest minden kerületében és a környező településeken',
    description: 'Szobafestés, mázolás, tapétázás és glettelés Budapest mind a 23 kerületében és a környező településeken. Díjtalan felmérés és árajánlat - nézze meg, hol vállalok munkát!',
    url: process.env.URL+"/helyek",
    siteName: 'Bencsfestő',
    locale: 'hu_HU',
    type: 'website',
    images: [{ url: "/images/zold-fal.jpeg", alt: 'Bencsfestő - zöld fal' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Szobafestés Budapest minden kerületében és a környező településeken",

    description: 'Szobafestés, mázolás, tapétázás és glettelés Budapest mind a 23 kerületében és a környező településeken. Díjtalan felmérés és árajánlat - nézze meg, hol vállalok munkát!',
    images: [{ url: "/images/zold-fal.jpeg", alt: 'Bencsfestő - zöld fal' }],
  },
}


const page = async () => {
  
  const data = await getPlaceList()


  return (
    <section className='mb-10'>
      <h1 className='text-3xl mb-20 text-center mt-10'>Ahol jelen vagyok szobafestőként</h1>
      <ul className='lg:pl-[calc(50%-450px)] lg:pr-[calc(50%-450px)] pl-2 pr-2'>
        {data.map((item) => <li key={"blog-" + String(item._id)}>
          <Link className="hover:text-gray-500 flex gap-2 pb-2 border-black w-full border-b mb-6" href={`helyek/${item.heading.slice(0,item.heading.indexOf('.')+9).replaceAll(" ", "-")}`}>
            <div className="max-w-20 min-w-20 overflow-hidden">
               <ImgBSP url={item.newUrl} detail={item.detail} />
            </div>

            <h2 className='font-semibold'>{item.heading}</h2>
          </Link>
        </li>)}
      </ul>
    </section>
  )
}

export default page