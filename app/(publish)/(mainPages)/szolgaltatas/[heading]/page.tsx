import { BSPPublicPagesList, BSPRender } from "@/typeScriptType/blogServPlace"
import { notFound } from "next/navigation"
import type { Metadata, ResolvingMetadata } from 'next';
import { Img } from '@/typeScriptType/img';
import { connectToMongo } from "@/lib/mongo";
import Service from "@/models/Service";
import { getServiceByHeading } from "@/lib/data";
import Image from "@/models/Image"
import Link from "next/link";
import ImgBSP from "@/app/_components/bsp/img";
import { Suspense } from "react";
import ChooseTypeOfTextItem from "@/app/_components/bsp/blogRender";

export async function generateMetadata(
  { params }: { params: Promise<{ heading: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {

  const { heading } = await params


  const data: BSPRender | null = await getServiceByHeading(decodeURIComponent(heading))

  if (data === null) return {}

  const imgData: (Img | null) = await Image.findById(data.image)



  return {
    title: decodeURIComponent(heading.replaceAll('-', ' ')),
    keywords: data.keywords.split(';'),
    description: data.detail,
    openGraph: {
      locale: 'hu_HU',
      title: decodeURIComponent(heading.replaceAll('-', ' ')),
      description: data.detail,
      type: 'website',
      url: `${process.env.URL}/blog/${heading}`,
      images: [
        {
          url: process.env.URL + '/img' + imgData?.newUrl,
          alt: imgData?.detail
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: decodeURIComponent(heading.replaceAll('-', ' ')),
      description: data.detail,
      images: [
        {
          url: process.env.URL + '/img' + imgData?.newUrl,
          alt: imgData?.detail
        }
      ],
    },

  }
}

export async function generateStaticParams() {
  await connectToMongo()

  const data = await Service.find({}, { heading: 1 })

  if (data.length === 0) return ([{ heading: '__placeholder__' }])
  return data.map((item) => ({ heading: item.heading.replaceAll(" ", "-") }))
}


const PageContent = async ({ params }: { params: Promise<{ heading: string }> }) => {
  const { heading } = await params;

  if (heading === '__placeholder__') notFound()



  const data= await getServiceByHeading(decodeURIComponent(heading.replaceAll('-', ' ')))

  if (data === null) notFound();



  const base = process.env.URL;

  const url = `${base}/szolgaltatas/${heading}`;



  const imgData: (Img | null) = await Image.findById(data.image)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: decodeURIComponent(heading.replaceAll('-', ' ')),
        serviceType: decodeURIComponent(heading.replaceAll('-', ' ')),
        description: data.detail,
        url,
        image: base + '/img' + imgData?.newUrl,
        provider: { '@id': `${base}/#business` },
        areaServed: { '@type': 'City', name: 'Budapest' },
        ...({
          offers: {
            '@type': 'Offer',
            url: `${base}/arak`,
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              priceCurrency: 'HUF',
              unitCode: 'MTK',
              unitText: 'm²',
            },
          },
        }),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Főoldal', item: base },
          { '@type': 'ListItem', position: 2, name: 'Szolgáltatások', item: `${base}/szolgaltatas` },
          { '@type': 'ListItem', position: 3, name: decodeURIComponent(heading.replaceAll('-', ' ')), item: url },
        ],
      },
    ],
  };
  return (
    <article className='mb-10 mt-10'>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className='text-3xl mb-20 text-center'>{decodeURIComponent(heading.replaceAll('-', ' '))}</h1>
      <div className="lg:pl-[calc(50%-450px)] lg:pr-[calc(50%-450px)] pl-2 pr-2">
        {data.text.split('$').map((s: string) => <ChooseTypeOfTextItem key={data._id} s={s} />)}
      </div>
    </article>
  )
}




const page = async ({ params }: { params: Promise<{ heading: string }> }) => {

  return (
    <Suspense fallback={<div className='text-center mt-10'>Töltődik...</div>}>
      <PageContent params={params} />
    </Suspense>
  )

}

export default page