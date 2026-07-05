"use client"

import { ImgWithoutBlob } from "@/typeScriptType/img"
import { motion, useScroll, useTransform } from "motion/react"
import { useRef, useState, type MouseEvent, useEffect } from "react"
import { FaWindowClose } from "react-icons/fa";
import { IconContext } from "react-icons";
import Image from "next/image";
import { createPortal } from "react-dom"

export default function ScrollHorizontal({ data }: { data: ImgWithoutBlob[] }) {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    })


    const totalDistance = (5 - 1) * (ITEM_WIDTH + GAP)
    const x = useTransform(scrollYProgress, [0, 1], [0, -totalDistance])

    const [lightBox, setLightBox] = useState<ImgWithoutBlob>({ newUrl: "", detail: '', _id: "", show: true })

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
            <div id="example" className="mb-40">

                <div ref={containerRef} className="scroll-container">
                    <div className="sticky-wrapper">
                        <motion.div className="gallery" style={{ x }}>
                            {data.map((item) => (
                                <div
                                    key={item._id}
                                    className="gallery-item"
                                    onClick={(e) => { e.preventDefault(); clickOnImage(item.newUrl, item.detail, item._id, item.show) }}
                                    style={
                                        {
                                            "--item-color": "var(--hue-1)",
                                            "--item-image": `url(/api/images/${item.newUrl})`,
                                        } as React.CSSProperties
                                    }
                                >
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                <StyleSheet />
            </div>

            {( lightBox._id !== "") && createPortal(
                <div className="fixed w-screen h-screen top-0 left-0 z-20 bg-gray-400/75 " onClick={closeLightBox}>
                    <IconContext.Provider value={{ size: "2em" }}>
                        <div className="fixed top-5 right-5 m-2 p-4 cursor-pointer" ><FaWindowClose /></div>
                    </IconContext.Provider>

                    <div className="flex justify-center items-center h-screen">
                        <Image src={'/api/images/' + lightBox.newUrl} alt={lightBox.detail} width={1000} height={100} className="w-auto h-auto" />
                    </div>

                </div>,
                document.body)
            }

        </>

    )
}

/**
 * ==============   Styles   ================
 */

function StyleSheet() {
    return (
        <style>{`
            body {
                overflow-x: hidden;
            }

            #example {
                height: auto;
                overflow: visible;
            }


            .scroll-container {
                height: 300vh;
                position: relative;
            }

            .sticky-wrapper {
                position: sticky;
                top: 0;
                height: 100vh;
                width: 400px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                overflow: visible;
            }

            .gallery {
                display: flex;
                gap: 30px;
                will-change: transform;
            }

            .gallery-item {
                flex-shrink: 0;
                width: 400px;
                height: 700px;
                border-radius: 12px;
                position: relative;
                overflow: hidden;
                background-image: var(--item-image);
                background-size: cover;
                background-position: center;
            }

            .gallery-item::before {
                content: "";
                position: absolute;
                inset: 0;
                background: linear-gradient(
                    to bottom,
                    transparent 60%,
                    var(--item-color)
                );
                mix-blend-mode: multiply;
            }




            @media (max-width: 600px) {
                .sticky-wrapper {
                    width: 280px;
                }

                .gallery {
                    gap: 15px;
                }

                .gallery-item {
                    width: 280px;
                    height: 400px;
                }
                    
            }

            @media (prefers-reduced-motion: reduce) {
                .gallery {
                    transform: none !important;
                }
                .scroll-container {
                    height: auto;
                }
                .sticky-wrapper {
                    position: relative;
                    height: auto;
                    width: 100%;
                    overflow-x: auto;
                    padding: 50px 0;
                }
            }
        `}</style>
    )
}

const ITEM_WIDTH = 400
const GAP = 30