import { connectToMongo } from "@/lib/mongo"
import Place from "@/models/Place"
import { PlaceRender } from "@/typeScriptType/blogServPlace"
import { notFound } from "next/navigation"
import type { Metadata, ResolvingMetadata } from 'next';
import { Img } from '@/typeScriptType/img';
import { getImgById, getPlaceByHeading } from "@/lib/data"
import { cacheLife, cacheTag } from "next/cache"
import Services from "@/app/_components/services/services"
import HowWork from "@/app/_components/howwork/howwork"
import ChooseTypeOfTextItem from "@/app/_components/bsp/placeRender"
import HeadingImgServerCompt from "@/app/_components/dashboard/place/headingImgServerComp"


export async function generateMetadata(
  { params }: { params: Promise<{ heading: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  'use cache'
  const { heading } = await params
  cacheLife('days')


  const data: PlaceRender | null = await getPlaceByHeading(decodeURIComponent(heading.replaceAll('-', ' ')))

  if (data === null) return {}

  const imgData: (Img | null) = await getImgById(data.image)



  return {
    title: data.heading,
    keywords: data.keywords.split(';'),
    description: data.detail,
    openGraph: {
      title: data.heading,
      description: data.detail,
      url: `${process.env.URL}/blog/${heading}`,
      images: [
        {
          url: '/api/images/' + imgData?.newUrl,
          alt: imgData?.detail
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.heading,
      description: data.detail,
      images: [
        {
          url: '/api/images/' + imgData?.newUrl,
          alt: imgData?.detail
        }
      ],
    },

  }
}

export async function generateStaticParams() {

  await connectToMongo()

  const data = await Place.find({}, { heading: 1 })

  if (data.length === 0) return ([{ heading: '__placeholder__' }])
  return data.map((item) => ({ heading: item.heading }))
}



const page = async ({ params }: { params: Promise<{ heading: string }> }) => {
  'use cache'

  const { heading } = await params;

  if (heading === '__placeholder__') notFound()

  cacheTag('place-' + heading)
  cacheLife('days')

  const data: PlaceRender | null = await getPlaceByHeading(decodeURIComponent(heading.replaceAll('-', ' ')))


  if (data === null) notFound();
  return (
    <section>
      <div className="lg:flex gap-10 lg:justify-center bg-mist-900  text-white lg:content-center m-5 mb-20 p-10">
        <div className="hidden lg:block lg:max-w-[30%] ">

          <HeadingImgServerCompt id={data.image} />

        </div>

        <section className="lg:max-w-[40%]">
          <h1 className=' text-5xl mb-10 text-center lg:text-left font-bold leading-normal'>{data.heading}</h1>
          <p>{data.headingParahg}</p>
        </section>
      </div>

      <div className="lg:pl-[calc(50%-600px)] lg:pr-[calc(50%-600px)] pl-2 pr-2">


        {data.text.split('\n').filter((item: string) => item !== '' && item !== null && typeof(item) !== undefined).map((item: string) => <ChooseTypeOfTextItem key={'place-'+item[10]} s={item}/>)}  

      </div>
      <div className="m-2 lg:ml-[30px] lg:mr-[30px]">
        <Services />
      </div>

      <div className="m-2 lg:ml-[10%] lg:mr-[10%] xl:ml-[20%] xl:mr-[20%]">
        <HowWork />
      </div>

    </section >
  )
}

export default page