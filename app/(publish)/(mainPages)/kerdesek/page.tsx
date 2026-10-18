import Content from "@/app/_components/kerdesek/content";
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



const data = [
  {
    id: '1',
    title: 'Tényleg ingyenes az árajánlat?',
    text: 'Igen. Budapest teljes területén és környékén a helyszíni felmérés és az árajánlat elkészítése is díjtalan.',
  },
  {
    id: '2',
    title: 'Kötelez valamire az árajánlat kérése?',
    text: 'Nem. Az árajánlat semmire nem kötelezi. Nyugodtan összehasonlíthatja más ajánlatokkal, és csak akkor egyeztetünk időpontot, ha elfogadja.',
  },
  {
    id: '3',
    title: 'Hogyan készüljek fel a festésre?',
    text: 'Ha teheti, pakolja ki a szekrényeket és a polcokat, és vegye le a falról a képeket, függönyöket. A nagyobb bútorokat a szoba közepére tolom és letakarom, a padlót és a nyílászárókat is védem.',
  },
  {
    id: '4',
    title: 'Mit tartalmaz az árajánlat?',
    text: 'Az árajánlat tételesen tartalmazza az elvégzendő munkákat (például glettelés, festés, mázolás), a felületek nagyságát, a munkadíjat és az anyagköltséget. Így előre pontosan tudja, mire számíthat, rejtett költségek nélkül.',
  },
  {
    id: '5',
    title: 'Mikor kell fizetni?',
    text: 'A munka elvégzése után, az átadáskor kell fizetni, készpénzben vagy átutalással. Az anyagköltségre előleget szoktam kérek. A munkáról számlát adok.',
  },
  {
    id: '6',
    title: 'Mennyi ideig tartanak a munkálatok?',
    text: 'Egy átlagos kétszobás lakás tisztasági festése általában 2-4 nap. A pontos időtartam a felületek állapotától és az elvégzendő munkáktól függ, ezt a felméréskor meg tudom mondani.',
  },
  {
    id: '7',
    title: 'Csak hétköznap dolgozik?',
    text: 'Általában hétköznap dolgozom, de előzetes egyeztetés alapján hétvégén is vállalok munkát.',
  },
  {
    id: '8',
    title: 'Ki szerzi be a festéket és az anyagokat?',
    text: 'Az anyagokat én szerzem be, így biztosan megfelelő minőségű festék kerül a falra. Ha saját festéket szeretne, azt is egyeztethetjük.',
  },
  {
    id: '9',
    title: 'Vállal beázás utáni helyreállítást?',
    text: 'Igen. Beázás után a sérült felületeket helyreállítom és újrafestem. A költséget sok esetben a biztosító fedezi; a kárbejelentéshez szükség esetén árajánlatot is adok.',
  },
  {
    id: '10',
    title: 'Lakhatok a lakásban a festés alatt?',
    text: 'Igen, a munkát helyiségenként is el tudom végezni, így a lakás nagy része közben használható marad.',
  },
  {
    id: '11',
    title: 'Mennyibe kerül a festés?',
    text: 'A részletes árakat az Árak oldalon találja, a pontos összeg a felmérés után derül ki.',
  },
];


const page = () => {
  

  const items = data.filter((q) => q.text.trim() !== '');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((q) => ({
      '@type': 'Question',
      name: q.title,
      acceptedAnswer: { '@type': 'Answer', text: q.text },
    })),
  };

  return (
    <div className="pb-30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className='mt-10 text-center mb-20 text-3xl'>Gyakran felmerülő kérdések</h1>
      <Content data={data}/>
    </div>
  )
}

export default page