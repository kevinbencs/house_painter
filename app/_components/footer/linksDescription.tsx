import Link from "next/link"
import SocialMeadia from "./socialMedia"


const LinksDescription = () => {
  return (
    <div className="max-w-[1000px] text-sm    flex  flex-col flex-wrap gap-10 md:gap-x-40  content-center md:flex-row  md:justify-between">
      <section className="flex flex-col ">
        <Link href="/impresszium" className="hover:underline">Impresszium</Link>
        <Link href="/sutik" className="hover:underline">Sütik</Link>
        <Link href="/kerdesek" className="hover:underline">GYIK</Link>
        <Link href="/adatvedelem" className="hover:underline">Adatvédelmi tájékoztató</Link>
      </section>
      <article>
        <h3 className="mb-3"><Link href='/helyek' className="hover:underline">Ahol jelen vagyok</Link></h3>
        <section>

        </section>
      </article>
      <article>
        <h3 className="mb-3"><Link href="/szolgaltatas" className="hover:underline">Szolgáltatásaim</Link></h3>
      </article>
      <article>
        <h3 className="mb-3">Egyéb felületek</h3>
        <SocialMeadia/>
      </article>
    </div>
  )
}

export default LinksDescription