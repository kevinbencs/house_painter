"use client"

import Image from "next/image"
import { useState } from "react"
import { IoCloseSharp } from "react-icons/io5";

interface Img {
    url: string,
    id: string,
    alt: string
}

const ImagePage = (props: { img: Img[] }) => {
    const [lightBox, setLightBox] = useState<Img>({ url: "", alt: '', id: "" })

    const clickOnImage = async (url: string, alt: string, id: string) => {
        setLightBox({ url, alt, id });
        document.body.style.overflow = "hidden"
    }


    const closeLightBox = async () => {
        setLightBox({ url: "", alt: "", id: ""});
        document.body.style.overflow = ""
    }


    return (
        <>
            <section>
                {props.img.map((item) => <Image alt={item.alt} src={item.url} onClick={() => clickOnImage(item.url, item.alt, item.id)} />)}
            </section>
            {lightBox.id !== "" &&
                <div className="fixed w-full h-screen top-0 left-0 z-20">
                    <div className="fixed top-0 right-0 m-2 p-4" onClick={closeLightBox}><IoCloseSharp /></div>
                    <div className="flex justify-center items-center">
                       <Image src={lightBox.url} alt={lightBox.alt} /> 
                    </div>
                    
                </div>
            }

        </>

    )
}

export default ImagePage