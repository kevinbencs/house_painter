import { getBlogMainPage } from '@/lib/data'
import Link from 'next/link'
import ImgBSP from '../bsp/img';
import Heading from './heading';
import Paraghrape from './paragraph';


const Blogs = async () => {
  const data= await getBlogMainPage();

  
  return (
    <section className='mb-40 '>
      <Heading text='Blogok'/>
      <section className='mb-10 flex flex-wrap gap-5'>
      </section>
      {data.map((item) => <Link key={`main-page-${item._id}`} href={`/blog/${item.heading.replaceAll(' ', '-')}`}>
        <div>
           <ImgBSP url={item.newUrl} detail={item.detail} />
          <h3>{item.heading}</h3>
        </div>
      </Link>)}
      <Paraghrape text1='Amennyiben többet szeretne tudni, az alábbi ' text2=' többet megtudhat.' linkHref='/blog' linkText='linken' />
    </section>
  )
}

export default Blogs