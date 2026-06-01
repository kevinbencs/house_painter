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
    <section>
      <h1>Blogok</h1>
      <ul>
        {data.map((item, i) => <li key={"blog-"+String(item._id)}>
          <Link href={`blog/${item.heading.replaceAll(" ","-")}`}>
          { imgData[i] !== null  && <ImgBSP  url={imgData[i].newUrl} detail={imgData[i].detail}/>}
          <h1>{item.heading}</h1>
          </Link>
        </li>)}
      </ul>
    </section>
  )
}

export default page