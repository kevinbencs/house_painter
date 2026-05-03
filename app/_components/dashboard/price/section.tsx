"use client"

import ElementContainer from "./elementContainer"
import { ElementOfPrice } from "@/typeScriptType/price"



const Section = (props: {arrOfEl: ElementOfPrice[], isPending:boolean}) => {
  return (
    <section className="mb-10">
        <h2 className="mb-3 border-b-3 border-black text-xl">{props.arrOfEl[0].category}</h2>
        {props.arrOfEl.filter((item) => item._id!=item.category).map((item) => <ElementContainer unitOfMea={item.unitOfMea} isPending={props.isPending} key={item._id} name={item.name} _id={item._id} categories={item.categories} category={item.category} price={item.price}/>)}
    </section>
  )
}

export default Section