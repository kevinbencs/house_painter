"use client"

import  type { Dispatch, SetStateAction } from "react"

const GuaranteeElement = (props: {title: string, text: string, id: string, setVisibility: Dispatch<SetStateAction<string>>, visibility: string}) => {
    const handleClick = () => {
        if(props.id !== props.visibility) {
            props.setVisibility(props.id)
        }
        else{
            props.setVisibility('')
        }
    }
  return (
    <div className="bg-mist-900 text-white">
        <h3 onClick={handleClick} className="font-bold text-lg">{props.title}</h3>
        <p>{props.text}</p>
    </div>
  )
}

export default GuaranteeElement