'use client'
import Image from "next/image"
import Link from "next/link"
import { useScrollReveal } from "./useScrollReveal"
import { ImgWithoutBlob } from "@/typeScriptType/img"
import Heading from "./heading"


const Images = ({data} : {data: ImgWithoutBlob[]}) => {
  
  const {ref, isVisible} = useScrollReveal();
  
  return (
    <section 
      className={`  mb-40`}>
      <Heading text="Néhány kép a munkáimról"/>
      <section className='mb-10 flex flex-wrap gap-5 justify-center'>
        {data.map((item) => <div className="w-full max-w-[400px]" key={`main-page-${item._id}`} >
         <Image className="w-full" src={'/api/images/'+item.newUrl} alt={item.detail} width={200} height={100} />
        </div>)}
      </section>

      <p className='text-center'>Több képet a <Link href={'/kepek'} className='bg-mauve-900 text-white p-1 hover:underline rounded-md'>linkre</Link> kattintva láthat</p>
    </section>
  )
}

export default Images