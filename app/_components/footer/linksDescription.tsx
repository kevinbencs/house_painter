import Link from "next/link"


const LinksDescription = () => {
  return (
    <div className="max-w-[1000px]  flex  flex-col flex-wrap gap-10 md:gap-x-40  content-center md:flex-row  md:justify-between">
      <section className="flex flex-col ">
        <Link href="/impresszium">Impresszium</Link>
        <Link href="/sutik">Sütik</Link>
        <Link href="/kerdesek">GYIK</Link>
        <Link href="/adatvedelem">Adatvédelmi tájékoztató</Link>
      </section>
      <article>
        <h3><Link href='/helyek'>Ahol jelen vagyunk</Link></h3>
        <section>

        </section>
      </article>
      <article>
        <h3><Link href="/szolgaltatas">Szolgáltatásaim</Link></h3>
      </article>
    </div>
  )
}

export default LinksDescription