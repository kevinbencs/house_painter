import { notFound } from "next/navigation"
import type { Metadata, ResolvingMetadata } from 'next';
import { connectToMongo } from "@/lib/mongo";
import Service from "@/models/Service";
import { getServiceByHeading } from "@/lib/data";
import { Suspense } from "react";
import ChooseTypeOfTextItem from "@/app/_components/bsp/blogRender";

export async function generateMetadata(
  { params }: { params: Promise<{ heading: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {

  const { heading } = await params


  const data = await getServiceByHeading(decodeURIComponent(heading))

  if (data === null) return {}




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
          url: process.env.URL + '/img' + data.newUrl,
          alt: data.detail
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: decodeURIComponent(heading.replaceAll('-', ' ')),
      description: data.detail,
      images: [
        {
          url: process.env.URL + '/img' + data.newUrl,
          alt: data.detail
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


  const data = await getServiceByHeading(decodeURIComponent(heading))

  if (data === null) notFound();


  const base = process.env.URL;

  const url = `${base}/szolgaltatas/${heading}`;


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
        image: base + '/img' + data.newUrl,
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
      <h1 className='text-5xl mb-20 text-center'>{decodeURIComponent(heading.replaceAll('-', ' '))}</h1>
      <div className="lg:pl-[calc(50%-450px)] lg:pr-[calc(50%-450px)] pl-2 pr-2">
        {data.text.split('\n').filter((item: string) => item !== '' && item !== null && typeof (item) !== undefined).map((item: string) => <ChooseTypeOfTextItem key={'service-' + item.slice(0, 10)} s={item} />)}
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