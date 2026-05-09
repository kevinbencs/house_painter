"use client"

import { Img } from "@/typeScriptType/img";
import Image from "next/image"
import { MouseEvent, useState } from "react"
import { FaWindowClose } from "react-icons/fa";
import { IconContext } from "react-icons";



const ImagePage = (props: { img: Img[] }) => {
    const [lightBox, setLightBox] = useState<Img>({ newUrl: "", detail: '', _id: "", show: true })

    const clickOnImage = async (newUrl: string, detail: string, _id: string, show: boolean) => {
        setLightBox({ newUrl, detail, _id, show });
        document.body.style.overflow = "hidden"
    }


    const closeLightBox = async (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        setLightBox({ newUrl: "", detail: "", _id: "", show: true });
        document.body.style.overflow = ""
    }


    return (
        <>
            <section className="flex gap-4 flex-wrap mb-20">
                {props.img.filter(item => item.show === true).map((item) => <Image loading="eager" className="w-auto h-auto cursor-pointer" width={200} height={100} key={"img-key-" + item._id} alt={item.detail} src={'/api/images/' + item.newUrl} onClick={(e) => { e.preventDefault(); clickOnImage(item.newUrl, item.detail, item._id, item.show) }} />)}
            </section>
            {lightBox._id !== "" &&
                <div className="fixed w-full h-screen top-0 left-0 z-20 bg-gray-400/75 " onClick={closeLightBox}>
                    <IconContext.Provider value={{ size: "2em" }}>
                        <div className="fixed top-5 right-5 m-2 p-4 cursor-pointer" ><FaWindowClose /></div>
                    </IconContext.Provider>

                    <div className="flex justify-center items-center h-screen">
                        <Image src={'/api/images/' + lightBox.newUrl} alt={lightBox.detail} width={1000} height={100} className="w-auto h-auto" />
                    </div>

                </div>
            }

        </>

    )
}

export default ImagePage