"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"


const Menu = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

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
        <div className="flex justify-between md:justify-around">
            <Link href="/">Image</Link>
            <div >
                <label htmlFor="hamburger-menu" className="lg:hidden text-center text-black p-2 rounded bg-gray-50">Menu</label>

                <input type="checkbox" name="hamburger-menu" className="hidden" id="hamburger-menu" onChange={() => setIsOpen(!isOpen)}/>
                <div className='fixed z-50 duration-100 inset-0 -translate-y-full lg:translate-y-0 lg:static'>
                    <div className="h-screen w-full bg-black p-2 z-20 lg:z-0 lg:h-auto lg:bg-gray-900 lg:static lg:w-auto">
                        <label htmlFor="hamburger-menu" className="text-black lg:hidden p-2 rounded bg-gray-50">X</label>
                        <section className=" h-full justify-around  flex flex-col lg:static lg:flex-row lg:justify-between lg:gap-4 items-center">
                            <Button variant="link" className=" ease-in-out -top-full relative duration-300 lg:static delay-800"><Link className="text-white " href="/">Főoldal</Link></Button>
                            <Button variant="link" className=" ease-in-out -top-full relative duration-300 lg:static delay-700"><Link className="text-white" href="/kepek">Képek</Link></Button>
                            <Button variant="link" className=" ease-in-out -top-full relative duration-300 lg:static delay-600"><Link className="text-white" href="/arak">Árak</Link></Button>
                            <Button variant="link" className=" ease-in-out -top-full relative duration-300 lg:static delay-500"><Link className="text-white" href="/kapcsolat">Kapcsolat</Link></Button>
                            <Button variant="link" className=" ease-in-out -top-full relative duration-300 lg:static delay-400"><Link className="text-white" href="/blog">Blogok</Link></Button>
                            <Button variant="link" className=" ease-in-out -top-full relative duration-300 lg:static delay-300"><Link className="text-white" href="/szolgaltatas">Szolgáltatások</Link></Button>
                            <Button variant="link" className=" ease-in-out -top-full relative duration-300 lg:static delay-200"><Link className="text-white" href="/dashboard">Dashboard</Link></Button>
                            <div className=" ease-in-out -top-full relative duration-300 lg:static delay-100">Time</div>
                        </section>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Menu