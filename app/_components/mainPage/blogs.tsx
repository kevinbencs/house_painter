import { getBlogMainPage } from '@/lib/data'
import Image from '@/models/Image';
import { typeBlogMainPage } from '@/typeScriptType/blogServPlace'
import Link from 'next/link'
import { Img } from '@/typeScriptType/img'
import ImgBSP from '../bsp/img';
import Heading from './heading';
import Paraghrape from './paragraph';


const Blogs = async () => {
  const data: typeBlogMainPage[] = await getBlogMainPage();

  const imgData: (Img | null)[] = await Promise.all(data.map((item) => Image.findById(item.image)))
  return (
    <section className='mb-40 '>
      <Heading text='Blogok'/>
      <section className='mb-10 flex flex-wrap gap-5'>
      </section>
      {data.map((item, i) => <Link key={`main-page-${item._id}`} href={`/blog/${item.heading.replaceAll(' ', '-')}`}>
        <div>
          {(imgData[i] !== undefined && imgData[i] !== null) && <ImgBSP url={imgData[i].newUrl} detail={imgData[i].detail} />}
          <h3>{item.heading}</h3>
        </div>
      </Link>)}
      <Paraghrape text1='Amennyiben többet szeretne tudni, az alábbi ' text2=' többet megtudhat.' linkHref='/szolgaltatasok' linkText='linken' />
    </section>
  )
}

export default Blogs