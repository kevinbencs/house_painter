import Blog from '@/models/Blog';
import Image from '@/models/Image';
import { BSP } from '@/typeScriptType/blogServPlace';
import { Img } from '@/typeScriptType/img';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';



export async function generateMetadata(
  { params }: { params: Promise<{ heading: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {

  const { heading } = await params


  const data: BSP | null = await Blog.findOne({
    heading: decodeURIComponent(heading.replaceAll('-', ' '))
  })

  if (data === null) return {}

  const imgData: (Img | null) = await Image.findById(data.image)



  return {
    title: decodeURIComponent(heading.replaceAll('-', ' ')),
    keywords: data.keywords.split(';'),
    description: data.detail,
    openGraph: {
      title: decodeURIComponent(heading.replaceAll('-', ' ')),
      description: data.detail,
      type: 'website',
      publishedTime: res.data?.date,
      url: `${process.env.URL}/blog/${heading}`,
      images: ['/api/images' + imgData?.newUrl],
    },
    robots: {
    index: true,
    follow: true,
    noarchive:false,
    nocache: false,
    noimageindex:false,
    googleBot: {
      index: true,
      follow: true,
      noarchive:false,
      nocache:false,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
  }
}

const page = async ({ params }: { params: Promise<{ heading: string }> }) => {
  await connection();
  const { heading } = await params;

  const data: BSP | null = await Blog.findOne({
    heading: decodeURIComponent(heading.replaceAll('-', ' '))
  })

  if (data === null) notFound();

  return (
    <section>
      <h1>{decodeURIComponent(heading.replaceAll('-', ' '))}</h1>
    </section>
  )
}

export default page