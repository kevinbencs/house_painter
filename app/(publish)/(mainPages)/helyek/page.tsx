import ImgBSP from '@/app/_components/bsp/img'
import Image from '@/models/Image'
import Service from '@/models/Service'
import { BSPPublicPagesList } from '@/typeScriptType/blogServPlace'
import { Img } from '@/typeScriptType/img'
import { cacheLife, cacheTag } from 'next/cache'
import Link from 'next/link'

const page = async () => {
  "use cache"
  cacheTag("place-list");
  cacheLife("hours")

  const data: BSPPublicPagesList[] = await Service.find({ visibility: false }, { id: 1, heading: 1, image: 1, visibility: 1 })

  const imgData: (Img | null)[] = await Promise.all(data.map((item) => Image.findById(item.image)))


  return (
    <section className='mb-10'>
      <h1 className='text-3xl mb-20 text-center'>Ahol jelen vagyok szobafestőként</h1>
      <ul>
        {data.map((item, i) => <li key={"blog-" + String(item._id)}>
          <Link className="hover:text-gray-500 flex gap-2 pb-2 border-black w-full border-b mb-6" href={`blog/${item.heading.replaceAll(" ", "-")}`}>
            <div className="max-w-20 min-w-20 overflow-hidden">
              {imgData[i] !== null && <ImgBSP url={imgData[i].newUrl} detail={imgData[i].detail} />}
            </div>

            <h2 className='font-semibold'>{item.heading}</h2>
          </Link>
        </li>)}
      </ul>
    </section>
  )
}

export default page