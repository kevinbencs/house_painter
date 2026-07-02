"use client"

import { useRef, type Dispatch, type SetStateAction } from "react"
import { FaPlus } from "react-icons/fa6";

const GuaranteeElement = (props: { title: string, text: string, id: string, setVisible: Dispatch<SetStateAction<string>>, visible: string }) => {
    const handleClick = () => {
        if (props.id !== props.visible) {
            props.setVisible(props.id)
        }
        else {
            props.setVisible('')
        }
    }
    return (
        <>
            <button  className="flex w-full justify-between cursor-pointer p-4 lg:p-6 hover:bg-mist-500 focus-visible:outline-4 focus-visible:outline-gray-500" onClick={handleClick} >
                <h3 className="font-bold text-lg ">{props.title}</h3>
                <div className={`${props.id === props.visible ? '-rotate-45' : ''} duration-150`}><FaPlus size={30}/></div>
            </button>
            
            <p className={`${props.id === props.visible ? 'pt-4 pb-4' : 'pt-0 pb-0 h-0'} overflow-hidden pl-4 pr-4 border-t-2 border-t-mist-600 duration-150` }>{props.text}</p>
        </>
    )
}

export default GuaranteeElement