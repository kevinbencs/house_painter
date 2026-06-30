'use client'

import { useScrollReveal } from "./useScrollReveal"
import { ImgWithoutBlob } from "@/typeScriptType/img"
import Heading from "./heading"
import Paragraph from "./paragraph"
import ScrollHorizontal from "./scrollHorizontal"


const Images = ({data} : {data: ImgWithoutBlob[]}) => {
  
  const {ref, isVisible} = useScrollReveal();
  
  return (
    <section 
      className={`  mb-40`}>
      <Heading text="Néhány kép a munkáimról"/>
      <div ref={ref} className={`reveal ${isVisible ? 'active' : ''}`}>
        <ScrollHorizontal data={data}/>
      </div>

      <Paragraph text1='Több képet a ' text2=' kattintva láthat.' linkHref='/kepek' linkText='linkre' />
    </section>
  )
}

export default Images