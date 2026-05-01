"use client"

import { MouseEventHandler, useState } from "react";
import { Input } from "@/components/ui/input";
import { v4 as uuid } from "uuid";


const Element = (props: { name: string, category: string, price: string, categories: string[], _id: string }) => {
    const [catInput, setCatInput] = useState<string>(props.category)
    const [name, setName] = useState(props.name);
    const [price, setPrice] = useState(props.price)
    const [optClass, setOptClass] = useState<string>('h-0')


     const chooseCategory = () => {
            setCatInput("glett")
         /*setTimeout(() => {
             optRef.current?.blur();
             liRef.current?.blur();
             liDivRef.current?.blur();
         }, 0);*/
     }

    return (
        <li className="flex gap-4 mb-2 border-b-2 pb-2">
            <Input type="text" name={`id-${props._id}`} id={props._id} readOnly value={props._id} className="hidden" />
            <Input type="text" name={`name-${props._id}`} id={`name-${props._id}`} value={name} onChange={e => setName(e.target.value)} />
            <div className="relative w-full">
                <Input type="text" name={`category-${props._id}`} id={`category-${props._id}`} value={catInput} onChange={e => setCatInput(e.target.value)} onFocus={() => setOptClass('h-52')} onBlur={() => setOptClass('h-0')} />
                <ul className={` ${optClass} overflow-y-scroll absolute sidebar z-10  w-full duration-100 bg-gray-500`} onFocus={() => setOptClass('h-52')} onBlur={() => { setOptClass('h-0'); }}>
                    {props.categories.length > 0 && props.categories.map((item) => <li key={uuid()} className="w-full border-b-white border-b-2 cursor-pointer" >
                        <button onClick={chooseCategory} className="w-full text-left">{item}</button>
                    </li>)}
                </ul>
            </div>

            <Input type="number" name={`price-${props._id}`} id={`price-${props._id}`} value={price} onChange={e => { setPrice(e.target.value) }} />

        </li>

    )
}

export default Element