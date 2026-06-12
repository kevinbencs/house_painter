import Main from '@/app/_components/image/main'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Képek',
  description: 'Képek a szobafestésről, tapétázásról és egyéb felújításai munkálatokról.',
  keywords: ['szobafestés', 'tapétázás', "szobafestés képek", "tapétázás képek"],
  openGraph: {
    siteName: 'Budafestő',
    locale: 'hu_HU',
    type: 'website',
    images: [{ url: "/api/images", alt: 'Budafestő - Képek' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Képek",
    description: 'Képek a szobafestésről, tapétázásról és egyéb felújításai munkálatokról.',
    images: [{ url: "/api/images", alt: 'Budafestő - Képek' }],
  },

}




const Page = async ({ params }: { params: Promise<{ page: string }> }) => {


  return (
    <section className='mb-40'>
      <h1 className='text-3xl mb-10'>Képek</h1>
      <Suspense fallback={<div>...Betöltés</div>}>
        <Main params={params} />
      </Suspense>
    </section>


  )
}

export default Page