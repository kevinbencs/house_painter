import { getBlogMainPage } from '@/lib/data'
import Image from '@/models/Image';
import { typeBlogMainPage } from '@/typeScriptType/blogServPlace'
import Link from 'next/link'
import { Img } from '@/typeScriptType/img'
import ImgBSP from '../bsp/img';
import Heading from './heading';


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
      <p className='text-center'>Amennyiben többet szeretne tudni, az alábbi <Link href={'/szolgaltatasok'} className='bg-mauve-900 text-white p-1 hover:underline rounded-md'>linken</Link> többet megtudhat.</p>
    </section>
  )
}

export default Blogs