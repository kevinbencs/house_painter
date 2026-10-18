"use client"

import GuaranteeElement from "@/app/_components/mainPage/guaranteeElement"
import { useState } from "react"


const Content = (props: {
    data: {
        id: string;
        title: string;
        text: string;
    }[]
}) => {
    const [visible, setVisible] = useState<string>('')
    return (
        <ul className='lg:pl-[calc(50%-450px)] lg:pr-[calc(50%-450px)] pl-2 pr-2'>
            {props.data.map((item) => <li key={item.id} className="bg-mist-900 text-white mb-1 "> <GuaranteeElement text={item.text} title={item.title} id={item.id} setVisible={setVisible} visible={visible} />  </li>)}
        </ul>
    )
}

export default Content