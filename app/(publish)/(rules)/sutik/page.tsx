import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sütik",
  metadataBase: process.env.URL,
  description: "Sütik felhasználása az oldalon belül.",
  openGraph: {
    title: 'Sütik',
    description: 'Sütik felhasználása az oldalon belül.',
    url: process.env.URL,
    siteName: '',
    locale: 'hu_HU',
    type: 'website',
    images: [{ url: "/images/zold-fal.jpeg", alt: 'Budafestő - festés Budapesten' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sütik",

    description: 'Sütik felhasználása az oldalon belül.',
    images: [{ url: "/images/zold-fal.jpeg", alt: 'Budafestő - Képek' }],
  },
  
  
};

const page = () => {
  return (
    <div>
    <h1 className='text-center text-2xl m-20'>Sütik</h1>
    <div>Az oldal nem használ sütiket.</div>
    </div>
  )
}

export default page