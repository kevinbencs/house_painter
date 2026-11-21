import { getServiceMainPage } from '@/lib/data'
import Link from 'next/link'
import ImgBSP from '../bsp/img';
import Heading from './heading';
import Paragraph from './paragraph';



const Services = async () => {
  const data = await getServiceMainPage();

  return (
    <section className='mb-40 '>
      <Heading text='Szolgáltatások'/>
      <section className='mb-10 flex flex-wrap gap-5'>
        {data.map((item) => <Link className='mb-10' key={`main-page-${item._id}`} href={`/szolgaltatas/${item.heading.replaceAll(' ', '-')}`}>
        <div className='flex flex-col items-center'>
          <ImgBSP url={item.newUrl} detail={item.detail} />
          <h3>{item.heading}</h3>
        </div>
      </Link>)}
      </section>
      <Paragraph text1='Szolgáltatásokról az alábbi ' text2=' többet megtudhat.' linkHref='/szolgaltatas' linkText='linken'/>
    </section>
  )
}

export default Services