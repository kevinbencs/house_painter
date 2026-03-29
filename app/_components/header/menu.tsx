import Link from "next/link"


const Menu = () => {
    return (
        <div className="flex justify-around">
            <Link href="/">Image</Link>
            <div className="flex justify-between gap-4">
                <section className=" flex justify-between gap-4">
                    <Link href="/">Főoldal</Link>
                    <Link href="/kepek">Képek</Link>
                    <Link href="/arak">Árak</Link>
                    <Link href="/kapcsolat">Kapcsolat</Link>
                    <Link href="/blog">Blogok</Link>
                    <Link href="/szolgaltatas">Szolgáltatások</Link>
                </section>
                    <Link href="/dashboard">Dashboard</Link>
            </div>

        </div>
    )
}

export default Menu