"use client"

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { v4 as uuid } from "uuid";
import Element from "./element";


const formatChange = (value: string) => {
    const digits = value.replace(/\D/g, '');

    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

const ElementContainer = (props: { name: string, category: string, price: string, categories: string[], _id: string }) => {
    const [catInput, setCatInput] = useState<string>(props.category)
    const [name, setName] = useState(props.name);
    const [price, setPrice] = useState(formatChange(props.price))
    const [optClass, setOptClass] = useState<string>('h-0')
    const catRef = useRef<null | HTMLInputElement>(null);



    return (
        <li className="flex gap-4 mb-4 border-b-2 pb-2">
            <Input type="text" name={`id-${props._id}`} id={props._id} readOnly value={props._id} className="hidden" required />
            <Input type="text" name={`name-${props._id}`} id={`name-${props._id}`} value={name} onChange={e => setName(e.target.value)} required />
            <div className="relative w-full">
                <Input ref={catRef} type="text" name={`category-${props._id}`} id={`category-${props._id}`} value={catInput} onChange={e => setCatInput(e.target.value)} onFocus={() => setOptClass('h-52')} onBlur={() => setOptClass('h-0')} required />
                <ul className={` ${optClass} overflow-y-scroll absolute sidebar z-10  w-full duration-100 bg-gray-500`}  >
                    {props.categories.map((item) => <Element catRef={catRef} item={item} setCatInput={setCatInput} setOptClass={setOptClass} key={uuid()} />)}
                </ul>
            </div>

            <Input type="text" name={`price-${props._id}`} id={`price-${props._id}`} value={price} onChange={e => { setPrice(formatChange( e.target.value)) }} required />

        </li>

    )
}

export default ElementContainer