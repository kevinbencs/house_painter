"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useLogged } from "../loggedContext/isLoggedContext"



const Menu = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const { IsLogged } = useLogged()

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }

        return () => {
            document.body.style.overflow = ""
        }
    }, [isOpen])

    return (
        <div className="flex justify-between md:justify-around items-center">
            <Link href="/">Image</Link>
            <div >
                <label htmlFor="hamburger-menu" className="lg:hidden text-center text-black p-2 rounded bg-gray-50">Menu</label>

                <input type="checkbox" name="hamburger-menu" className="hidden" id="hamburger-menu" onChange={() => setIsOpen(!isOpen)} />
                <div className='fixed z-50 duration-100 inset-0 -translate-y-full lg:translate-y-0 lg:static'>
                    <div className="h-screen w-full bg-black p-2 z-20 lg:z-0 lg:h-auto lg:bg-gray-900 lg:static lg:w-auto">
                        <label htmlFor="hamburger-menu" className="text-black lg:hidden p-2 rounded bg-gray-50">X</label>
                        <section className=" h-full justify-around  flex flex-col lg:static lg:flex-row lg:justify-between lg:gap-4 items-center">
                            <Link className="text-white ease-in-out -top-full relative duration-300 lg:static delay-800 p-px pl-[11px] text-sm font-medium mt-1 mb-1 pr-[11px] hover:underline" href="/">Főoldal</Link>
                            <Link className="text-white ease-in-out -top-full relative duration-300 lg:static delay-800 p-px pl-[11px] text-sm font-medium mt-1 mb-1 pr-[11px] hover:underline" href="/kepek">Képek</Link>
                            <Link className="text-white ease-in-out -top-full relative duration-300 lg:static delay-800 p-px pl-[11px] text-sm font-medium mt-1 mb-1 pr-[11px] hover:underline" href="/arak">Árak</Link>
                            <Link className="text-white ease-in-out -top-full relative duration-300 lg:static delay-800 p-px pl-[11px] text-sm font-medium mt-1 mb-1 pr-[11px] hover:underline" href="/kapcsolat">Kapcsolat</Link>
                            <Link className="text-white ease-in-out -top-full relative duration-300 lg:static delay-800 p-px pl-[11px] text-sm font-medium mt-1 mb-1 pr-[11px] hover:underline" href="/blog">Blogok</Link>
                            <Link className="text-white ease-in-out -top-full relative duration-300 lg:static delay-800 p-px pl-[11px] text-sm font-medium mt-1 mb-1 pr-[11px] hover:underline" href="/szolgaltatas">Szolgáltatások</Link>
                            {IsLogged &&
                                <>
                                    <Link className="text-white ease-in-out -top-full relative duration-300 lg:static delay-800 p-px pl-[11px] text-sm font-medium mt-1 mb-1 pr-[11px] hover:underline" href="/dashboard">Dashboard</Link>
                                    <div className=" ease-in-out -top-full relative duration-300 lg:static delay-100">Time</div>
                                </>
                            }

                        </section>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Menu