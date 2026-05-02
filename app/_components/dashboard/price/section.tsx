"use client"

import { v4 as uuid } from "uuid"
import ElementContainer from "./elementContainer"

type ElementOfPrice = {
    name: string, 
    category: string, 
    price: string, 
    categories: string[], 
    _id: string
}

const Section = (props: {arrOfEl: ElementOfPrice[]}) => {
  return (
    <section className="mb-10">
        <h2 className="mb-3 border-b-3 border-black text-xl">{props.arrOfEl[0].category}</h2>
        {props.arrOfEl.filter((item) => item._id!=item.category).map((item) => <ElementContainer key={uuid()} name={item.name} _id={item._id} categories={item.categories} category={item.category} price={item.price}/>)}
    </section>
  )
}

export default Section