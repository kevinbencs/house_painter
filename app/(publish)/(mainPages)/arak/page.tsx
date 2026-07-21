import Section from "@/app/_components/price/section"
import { getCategory, getPriceData } from "@/lib/data"
import { MongoData } from "@/typeScriptType/price"
import type { Metadata } from 'next'
import { cacheLife, cacheTag } from "next/cache"

export const metadata: Metadata = {
  title: 'Árak',
  description: 'Szobafestés árak Budapesten és környékén',
  keywords: ['budapest szobafestés árak','budapesten szobafestés árak', 'szobafestés árak', 'tisztasági festés árak', 'tapétázás árak budapest'],
  openGraph: {
    title: 'Árak - Budapest szobafestés',
    description: 'Szobafestés árak Budapesten és környékén',
    url: '',
    images: [
      {
        url: '', // Must be an absolute URL
        width: 800,
        height: 600,
      },
      {
        url: '', // Must be an absolute URL
        width: 1800,
        height: 1600,
        alt: 'My custom alt',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Árak',
    description: 'Árak - Budapest szobafestés',
    images: {
      url: '',
      alt: 'Next.js Logo',
    }
  },
  pinterest: {
    richPin: true,
  },
}

const Page = async () => {
  'use cache'
  cacheTag('price-page')
  cacheLife('hours')


  const [res, cat] = await Promise.all([
    getPriceData(),
    getCategory()
  ])


  const catArr = cat.map((i) => i._id)



  const data: MongoData[][] = [];

  for (let i = 0; i < catArr.length; i++) {
    data.push([])
    for (let j = 0; j < res.length; j++) {
      if (catArr[i] === res[j].category) {
        data[i].push(res[j])
      }
    }
  }

  return (
    <>
      <h1 className="text-3xl mb-10 text-center mt-10">Szobafestés árak</h1>
      <div className="mb-40 lg:pl-[calc(50%-450px)] lg:pr-[calc(50%-450px)] pl-2 pr-2">
        {data.map((item) => <Section key={'price-cat-' + item[0].category} arrOfEl={item} />)}
      </div>

    </>
  )
}

export default Page