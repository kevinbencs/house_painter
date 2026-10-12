import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sütik",

  description: "Az oldalon található sütik leírása.",
  openGraph: {
    title: 'Sütik',
    description: 'Az oldalon található sütik leírása.',
    url: process.env.URL,
    siteName: 'Bencsfestő',
    locale: 'hu_HU',
    type: 'website',
    images: [{ url: "/images/zold-fal.jpeg", alt: 'Bencsfestő - zöld fal' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sütik",

    description: 'Az oldalon található sütik leírása.',
    images: [{ url: "/images/zold-fal.jpeg", alt: 'Bencsfestő - zöld fal' }],
  },


};

const page = () => {
  return (
    <div className="min-h-[50vh]">
      <h1 className=' text-2xl m-20'>Sütik</h1>
      <div>Az oldal nem használ sütiket.</div>
    </div>
  )
}

export default page