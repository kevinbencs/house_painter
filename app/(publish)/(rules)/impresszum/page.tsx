import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Impresszum",

  description: "Szolgáltató neve: Bencs Kornél György. Szolgáltató székhelye:...",
  openGraph: {
    title: 'Impresszum"',
    description: 'Szolgáltató neve: Bencs Kornél György. Szolgáltató székhelye:...',
    url: process.env.URL,
    siteName: 'Bencsfestő',
    locale: 'hu_HU',
    type: 'website',
    images: [{ url: "/images/zold-fal.jpeg", alt: 'Bencsfestő - zöld fal' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Impresszum",

    description: 'Szolgáltató neve: Bencs Kornél György. Szolgáltató székhelye:...',
    images: [{ url: "/images/zold-fal.jpeg", alt: 'Bencsfestő - zöld fal' }],
  },
}

const page = () => {
  return (
    <section className="min-h-[50vh]">
      <h1 className='text-2xl mb-12'>Impresszum</h1>
      <ul>
        <li className='mb-2'><span className='font-bold'>Szolgáltató neve:</span> Bencs Kornél György</li>
        <li className='mb-2'><span className='font-bold'>Szolgáltató székhelye:</span> Budapest 1119 Vahot utca 5. 3/9.</li>
        <li className='mb-2'><span className='font-bold'>Email cím:</span> bencskornel@bencsfesto.hu</li>
        <li className='mb-2'><span className='font-bold'>Kamarai tagság:</span> Budapesti Kereskedelmi és Iparkamara</li>
        <li className='mb-2'><span className='font-bold'>E-mail cím szolgáltató:</span> </li>
        <li className='mb-2'><span className='font-bold'>Tárhely szolgáltató adatai:</span>  Vercel Inc., 440 N Barranca Avenue #4133 Covina, CA 91723 United States - <a href="https://vercel.com/legal/privacy-notice" target="_blank" className="hover:underline text-mist-500">adatvédelmi nyilatkozatuk</a> - e-mail címük: <a href="mailto:privacy@vercel.com" className="hover:underline text-mist-500">privacy@vercel.com</a></li>
      </ul>
    </section>
  )
}

export default page