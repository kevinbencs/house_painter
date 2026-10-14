import Section from "@/app/_components/price/section"
import { getCategory, getPriceData } from "@/lib/data"
import { MongoData } from "@/typeScriptType/price"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Árak',
  description: 'Szobafestés, mázolás, tapétázás árak Budapesten és környékén',
  keywords: ['budapest szobafestés árak', 'budapesten szobafestés árak', 'szobafestés árak', 'tisztasági festés árak', 'tapétázás árak budapest'],
  openGraph: {
    title: 'Árak - Budapest szobafestés',
    description: 'Szobafestés, mázolás, tapétázás árak Budapesten és környékén',
    url: process.env.URL+"/arak",
    siteName: 'Bencsfestő',
    locale: 'hu_HU',
    type: 'website',
    images: [{ url: "/images/zold-fal.jpeg", alt: 'Bencsfestő - zöld fal' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Árak - Budapest szobafestés',
    description: 'Szobafestés, mázolás, tapétázás árak Budapesten és környékén',
    images: [{ url: "/images/zold-fal.jpeg", alt: 'Bencsfestő - zöld fal' }],
  },
}

const UNIT_CODES: Record<string, string> = {
  'm2': 'MTK',  // square metre
  'fm': 'MTR',  // running metre
  'db': 'H87',  // piece
};

const base = process.env.URL;

const Page = async () => {

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


  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'OfferCatalog',
        '@id': `${base}/arak#arlista`,
        name: 'Árlista',
        url: `${base}/arak`,

        itemListElement: data.map((catPlusElements) => ({
          '@type': 'OfferCatalog',
          name: catPlusElements[0].name,
          itemListElement: catPlusElements.filter((item) => item._id != item.category).map((item) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: item.name,
              provider: { '@id': `${base}/#business` },
            },
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: item.price,          // number: 1230, not "1230 Ft"
              priceCurrency: 'HUF',
              unitCode: UNIT_CODES[item.unitOfMea],
              unitText: item.unitOfMea === 'Ft/m2' ? 'Ft/m²' : item.unitOfMea,
            },
          })),
        })),

      },

      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Főoldal', item: base },
          { '@type': 'ListItem', position: 2, name: 'Árak', item: `${base}/arak` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <h1 className="text-3xl mb-10 text-center mt-10">Szobafestés árak</h1>
      <div className="mb-40 lg:pl-[calc(50%-450px)] lg:pr-[calc(50%-450px)] pl-2 pr-2">
        {data.map((item) => <Section key={'price-cat-' + item[0].category} arrOfEl={item} />)}
      </div>

    </>
  )
}

export default Page