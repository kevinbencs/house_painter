import Link from "next/link"
import Services from "./services"
import Places from "./places"
import ErrorBoundary from "../../custom-error-boundary"


const LinksDescription = () => {
  return (

    <div className="max-w-[1200px] w-full text-sm pb-10   flex  flex-col flex-wrap gap-10 md:gap-x-40  content-center md:flex-row  md:justify-between">
      <section className="flex flex-col items-center md:items-start">
        <Link href="/adatvedelem" className="hover:underline">Adatvédelmi tájékoztató</Link>
        <Link href="/impresszium" className="hover:underline">Impresszium</Link>
        <Link href="/sutik" className="hover:underline">Sütik</Link>
        <Link href="/kerdesek" className="hover:underline">GYIK</Link>

      </section>

      <div className="flex flex-col flex-wrap gap-10 md:gap-x-14 lg:gap-x-20  content-center md:flex-row w-full md:w-auto">
        <section className="flex flex-col items-center pt-5 pb-5  border-t-2 border-b-2 border-mist-500 w-full md:w-auto md:pt-0 md:pb-0 md:border-0">
          <h3 className="mb-3"><Link href="/szolgaltatas" className="hover:underline">Szolgáltatásaim</Link></h3>
          <ErrorBoundary title="Hiba a szolgáltatásoknál">
            <Services />
          </ErrorBoundary>

        </section>
        <section className="flex flex-col items-center">
          <h3 className="mb-3"><Link href='/helyek' className="hover:underline">Ahol jelen vagyok</Link></h3>
          <ErrorBoundary title="Hiba a helyeknél">
            <Places />
          </ErrorBoundary>

        </section>
        
      </div>

    </div>

  )
}

export default LinksDescription