"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"


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
                <Button variant="outline" className="lg:hidden text-center text-black" onClick={() => { setIsOpen(true) }}>
                    <label htmlFor="hamburger-menu">Menu</label>
                </Button>
                <input type="checkbox" name="hamburger-menu" className="hidden" id="hamburger-menu" />
                <div className='fixed z-50 duration-100 inset-0 -translate-y-full lg:translate-y-0 lg:static'>
                    <div className="h-screen w-full bg-gray-900 p-2 z-20 lg:z-0 lg:h-auto lg:static lg:w-auto">
                        <Button variant="outline" className="text-black lg:hidden" onClick={() => setIsOpen(false)}><label htmlFor="hamburger-menu">X</label></Button>
                        <section className=" h-full justify-around  flex flex-col lg:static lg:flex-row lg:justify-between lg:gap-4">
                            <Button variant="link" className="-translate-y-full relative duration-300 lg:translate-y-0 delay-500"><Link className="text-white " href="/">Főoldal</Link></Button>
                            <Button variant="link" className="-translate-y-full relative duration-300 lg:translate-y-0 delay-600"><Link className="text-white" href="/kepek">Képek</Link></Button>
                            <Button variant="link" className="-translate-y-full relative duration-300 lg:translate-y-0 delay-700"><Link className="text-white" href="/arak">Árak</Link></Button>
                            <Button variant="link" className="-translate-y-full relative duration-300 lg:translate-y-0 delay-800"><Link className="text-white" href="/kapcsolat">Kapcsolat</Link></Button>
                            <Button variant="link" className="-translate-y-full relative duration-300 lg:translate-y-0 delay-900"><Link className="text-white" href="/blog">Blogok</Link></Button>
                            <Button variant="link" className="-translate-y-full relative duration-300 lg:translate-y-0 delay-1000"><Link className="text-white" href="/szolgaltatas">Szolgáltatások</Link></Button>
                            <Button variant="link" className="-translate-y-full relative duration-300 lg:translate-y-0 delay-1100"><Link className="text-white" href="/dashboard">Dashboard</Link></Button>
                        </section>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Menu