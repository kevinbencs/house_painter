import ImgBSP  from '@/app/_components/bsp/img'
import Blog from '@/models/Blog'
import Image from '@/models/Image'
import { BSPPublicPagesList } from '@/typeScriptType/blogServPlace'
import { Img } from '@/typeScriptType/img'
import { cacheLife, cacheTag } from 'next/cache'
import Link from 'next/link'

const page = async() => {
  "use cache"
  cacheTag("blog-list");
  cacheLife("hours")

  const data: BSPPublicPagesList[] = await Blog.find({hide: false},{id: 1, heading: 1, image: 1, hide: 1})

  const imgData:(Img | null) [] = await Promise.all(data.map( (item) => Image.findById(item.image)))


  return (
    <section className='mb-10'>
      <h1 className='text-3xl mb-20'>Blogok</h1>
      <ul className='flex gap-4 flex-wrap justify-between '>
        {data.map((item, i) => <li key={"blog-"+String(item._id)}>
          <Link className="hover:text-gray-100 flex flex-col gap-2 bg-gray-500" href={`blog/${item.heading.replaceAll(" ","-")}`}>
          { imgData[i] !== null  && <ImgBSP  url={imgData[i].newUrl} detail={imgData[i].detail}/>}
          <h2>{item.heading}</h2>
          </Link>
        </li>)}
      </ul>
    </section>
  )
}

export default page