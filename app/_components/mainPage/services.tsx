import { getServiceMainPage } from '@/lib/data'
import Image from '@/models/Image';
import { typeBlogMainPage } from '@/typeScriptType/blogServPlace'
import Link from 'next/link'
import { Img } from '@/typeScriptType/img'
import ImgBSP from '../bsp/img';



const Services = async () => {
  const data: typeBlogMainPage[] = await getServiceMainPage();

  const imgData: (Img | null)[] = await Promise.all(data.map((item) => Image.findById(item.image)))
  return (
    <section className='mb-40 flex flex-wrap gap-5'>
      {data.map((item, i) => <Link key={`main-page-${item._id}`} href={`/szolgaltatas/${item.heading.replaceAll(' ', '-')}`}>
        <div>
          {(imgData[i] !== undefined && imgData[i] !== null) && <ImgBSP url={imgData[i].newUrl} detail={imgData[i].detail} />}
          <h2>{item.heading}</h2>
        </div>
      </Link>)}
    </section>
  )
}

export default Services