import ChooseTypeOfTextItem from '@/app/_components/bsp/blogRender';
import { getBlogByHeading } from '@/lib/data';
import { connectToMongo } from '@/lib/mongo';
import Blog from '@/models/Blog';
import Image from '@/models/Image';
import { BSPRender } from '@/typeScriptType/blogServPlace';
import { Img } from '@/typeScriptType/img';
import type { Metadata, ResolvingMetadata } from 'next';
import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';



export async function generateMetadata(
  { params }: { params: Promise<{ heading: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  'use cache'
  const { heading } = await params
  cacheLife('days')

  const data: BSPRender | null = await getBlogByHeading(decodeURIComponent(heading))

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
          url: process.env.URL + '/api/images' + imgData?.newUrl,
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
          url: process.env.URL + '/api/images' + imgData?.newUrl,
          alt: imgData?.detail
        }
      ],
    },

  }
}

export async function generateStaticParams() {
  await connectToMongo()

  const data = await Blog.find({}, { heading: 1 })

  if (data.length === 0) return ([{ heading: '__placeholder__' }])
  return data.map((item) => ({ heading: item.heading }))
}

const Page = async ({ params }: { params: Promise<{ heading: string }> }) => {
  'use cache'
  const { heading } = await params;

  if (heading === '__placeholder__') notFound()
  cacheTag('blog-'+heading)
  cacheLife('days')


  const data: BSPRender | null = await getBlogByHeading(decodeURIComponent(heading))

  if (data === null) notFound();

  return (
    <section>
      <h1>{decodeURIComponent(heading.replaceAll('-', ' '))}</h1>
      <div className="lg:pl-[calc(50%-450px)] lg:pr-[calc(50%-450px)] pl-2 pr-2">
        {data.text.split('$').map((s: string) => <ChooseTypeOfTextItem key={data._id} s={s} />)}
      </div>

    </section>
  )
}

export default Page