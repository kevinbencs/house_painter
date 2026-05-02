"use client"

import { ForwardedRef, MouseEventHandler, Ref, RefObject } from "react"

const Element = (props: {catRef: RefObject<HTMLInputElement | null>, setCatInput: (catInput:string) => void, setOptClass:(optClass: string) => void, item:string}) => {
    

    const chooseCategory = () => {

        props.setCatInput(props.item)
        props.setOptClass('h-0');
        props.catRef.current?.blur()
    }


    return (
        <li  className="w-full border-b-white border-b-2 cursor-pointer" >
            <div onMouseDown={(e) => {e.preventDefault() ;chooseCategory()}} className="w-full p-1 text-left" onFocus={() => { props.setOptClass('h-52'); }} onBlur={() => { props.setOptClass('h-0'); }} tabIndex={0}>{props.item}</div>
        </li>
    )
}

export default Element