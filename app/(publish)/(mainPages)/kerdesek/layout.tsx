import { Metadata } from "next";

export const metadata: Metadata = {
title: "Gyakran felmerülő kérdések",
  description: "Szobafestés, mázolás, tapétázás és glettelés Budapest mind a 23 kerületében és a környező településeken. Díjtalan felmérés és árajánlat - nézze meg, hol vállalok munkát!",
  keywords: ['gyakori kérdések budapest szobafestés ', 'gyakori kérdések szobafestés', ],
  openGraph: {
    title:  "Gyakran felmerülő kérdések",
    description: 'Szobafestés, mázolás, tapétázás és glettelés Budapest mind a 23 kerületében és a környező településeken. Díjtalan felmérés és árajánlat - nézze meg, hol vállalok munkát!',
    url: process.env.URL+"/kerdesek",
    siteName: 'Bencsfestő',
    locale: 'hu_HU',
    type: 'website',
    images: [{ url: "/images/zold-fal.jpeg", alt: 'Bencsfestő - zöld fal' }],
  },
  twitter: {
    card: 'summary_large_image',
    title:  "Gyakran felmerülő kérdések",

    description: 'Szobafestés, mázolás, tapétázás és glettelés Budapest mind a 23 kerületében és a környező településeken. Díjtalan felmérés és árajánlat - nézze meg, hol vállalok munkát!',
    images: [{ url: "/images/zold-fal.jpeg", alt: 'Bencsfestő - zöld fal' }],
  },
}


export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
        </>
    )
}