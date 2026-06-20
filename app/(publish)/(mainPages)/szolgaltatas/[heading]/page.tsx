import { BSPPublicPagesList, BSPRender } from "@/typeScriptType/blogServPlace"
import { notFound } from "next/navigation"
import type { Metadata, ResolvingMetadata } from 'next';
import { Img } from '@/typeScriptType/img';
import { connectToMongo } from "@/lib/mongo";
import Service from "@/models/Service";
import { getServiceByHeading } from "@/lib/data";
import Image from "@/models/Image"
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import ImgBSP from "@/app/_components/bsp/img";

export async function generateMetadata(
  { params }: { params: Promise<{ heading: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  'use cache'
  const { heading } = await params
  cacheLife('days')

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

  const data = await Service.find({}, { heading: 1 })

  if (data.length === 0) return ([{ heading: '__placeholder__' }])
  return data.map((item) => ({ heading: item.heading }))
}




const page = async ({ params }: { params: Promise<{ heading: string }> }) => {
  "use cache"
  const { heading } = await params;

  if (heading === '__placeholder__') notFound()


 
  cacheTag("service-list-"+heading);
  cacheLife("hours")

  const data: BSPPublicPagesList[] = await Service.find({visibility: false},{id: 1, heading: 1, image: 1, visibility: 1})

  const imgData:(Img | null) [] = await Promise.all(data.map( (item) => Image.findById(item.image)))

  if (data === null) notFound();
  return (
    <section className='mb-10'>
      <h1 className='text-3xl mb-20 text-center'>Szobafestési szolgáltatásaim</h1>
      <ul className='flex gap-4 flex-wrap justify-between lg:pl-[calc(50%-450px)] lg:pr-[calc(50%-450px)] pl-2 pr-2'>
        {data.map((item, i) => <li key={"blog-" + String(item._id)}>
          <Link className="hover:text-gray-100 flex flex-col gap-2 bg-gray-500" href={`blog/${item.heading.replaceAll(" ", "-")}`}>
            {imgData[i] !== null && <ImgBSP url={imgData[i].newUrl} detail={imgData[i].detail} />}
            <h2>{item.heading}</h2>
          </Link>
        </li>)}
      </ul>
    </section>
  )
}

export default page