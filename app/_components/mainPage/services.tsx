import { getServiceMainPage } from '@/lib/data'
import Image from '@/models/Image';
import { typeBlogMainPage } from '@/typeScriptType/blogServPlace'
import Link from 'next/link'
import { Img } from '@/typeScriptType/img'
import ImgBSP from '../bsp/img';
import Heading from './heading';
import Paragraph from './paragraph';



const Services = async () => {
  const data: typeBlogMainPage[] = await getServiceMainPage();

  const imgData: (Img | null)[] = await Promise.all(data.map((item) => Image.findById(item.image)))
  return (
    <section className='mb-40 '>
      <Heading text='Szolgáltatások'/>
      <section className='mb-10 flex flex-wrap gap-5'>
        {data.map((item, i) => <Link className='mb-10' key={`main-page-${item._id}`} href={`/szolgaltatas/${item.heading.replaceAll(' ', '-')}`}>
        <div>
          {(imgData[i] !== undefined && imgData[i] !== null) && <ImgBSP url={imgData[i].newUrl} detail={imgData[i].detail} />}
          <h3>{item.heading}</h3>
        </div>
      </Link>)}
      </section>
      <Paragraph text1='Szolgáltatásokról az alábbi ' text2=' többet megtudhat.' linkHref='/szolgaltatasok' linkText='linken'/>
    </section>
  )
}

export default Services