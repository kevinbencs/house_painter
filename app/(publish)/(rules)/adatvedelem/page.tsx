import { Table, TableBody, TableCell,  TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Adatvédelem",
  description: "Nézze meg, hogy kezelik az adatait az oldalon.",
  keywords: ['adatvédelem budapest szobafestés ', 'adatok kezelése budapest szobafestő', 'adatok kezelése szobafestő budapest'],
  openGraph: {
    title: "Adatvédelem",
    description: 'Nézze meg, hogy kezelik az adatait az oldalon.',
    url: process.env.URL + "/adatvedelem",
    siteName: 'Bencsfestő',
    locale: 'hu_HU',
    type: 'website',
    images: [{ url: "/images/zold-fal.jpeg", alt: 'Bencsfestő - zöld fal' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Adatvédelem",

    description: 'Nézze meg, hogy kezelik az adatait az oldalon.',
    images: [{ url: "/images/zold-fal.jpeg", alt: 'Bencsfestő - zöld fal' }],
  },
}


const page = () => {
  return (
    <>
      <h1 className="text-3xl mb-14 font-bold">Adatkezelési tájékoztató</h1>
      <div className="mb-12">

        <div className="mb-12">
          <h2  className="text-xl mb-6 font-bold">1. Az adatkezelő</h2>
          <ul>
            <li className="list-disc ml-4"><span className="font-bold">Név:</span> Bencs Kornél György</li>
            <li className="list-disc ml-4"><span className="font-bold">Székhely:</span> Budapest 1119, Vahot utca 5. 3/9</li>
            <li className="list-disc ml-4"><span className="font-bold">Adószám:</span> 55719193-1-43</li>
            <li className="list-disc ml-4"><span className="font-bold">E-mail:</span> <a className="hover:underline text-gray-500" href="mailto:bencskornel@bencsfesto.hu">bencskornel@bencsfesto.hu</a></li>
            <li className="list-disc ml-4"><span className="font-bold">Tel:</span> +63-70/</li>
          </ul>
        </div>

        <div className="mb-20">
          <p className="mb-6">Ez a tájékoztató a <Link className="hover:underline text-gray-500" href="/">https://bencsfesto.hu</Link> weboldalon történő adatkezelést mutatja be az Európai Unió általános adatvédelmi rendelete (GDPR, 2016/679/EU rendelet) alapján.</p>

        </div>



        <section className="mb-20">
          <h2 className="text-xl mb-6 font-bold">2. Kapcsolatfelvételi űrlap</h2>
          <p >Ha az űrlapon üzenetet küld, az alábbi adatokat kezelem:</p>

          <ul className="mb-6">
            <li className="list-disc ml-4">név</li>
            <li className="list-disc ml-4">e-mail cím</li>
            <li className="list-disc ml-4">az üzenet tartalma (és az abban önkéntesen megadott további adatok, például cím vagy telefonszám).</li>
          </ul>



          <p className="mb-6">
            Cél: az érdeklődés megválaszolása, felmérés egyeztetése, árajánlat készítése. Jogalap: a GDPR 6. cikk (1) bekezdés (b) pontja - az Ön kérésére a szerződés megkötését megelőzően tett lépések.
          </p>

          <p className="mb-6">
            Időtartam: ha nem jön létre megbízás, az üzenetet [1 évig] őrzöm meg, majd törlöm. Ha megbízás jön létre, az adatokat a szerződés teljesítéséhez és a számviteli, adózási kötelezettségek teljesítéséhez szükséges ideig kezelem.
          </p>

          <p>Az adatok megadása önkéntes, de ezek nélkül nem tudok válaszolni az üzenetére.</p>

        </section>


        <section className="mb-20">
          <h2 className="text-xl mb-6 font-bold">3. Látogatottsági statisztika</h2>

          <p>A weboldal saját, egyszerű statisztikát készít arról, hogy mely oldalakat látogatják, honnan érkeznek a látogatók (hivatkozó oldal) és mikor. IP-címet, sütit vagy más, a látogató azonosítására alkalmas adatot ehhez nem használok, így ezek az adatok nem minősülnek személyes adatnak.</p>

        </section>

        <section className="mb-20">
          <h2 className="text-xl mb-6 font-bold">4. Adattovábbítás az Egyesült Államokba</h2>

          <p className="mb-6">
            A weboldal tárhelyszolgáltatója (Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA) és az űrlapüzeneteket továbbító szolgáltató (Plus Five Five, Inc. - Resend) az Egyesült Államokban működő vállalkozás. Az adattovábbítás az EU-USA adatvédelmi keretrendszer (Data Privacy Framework) alapján történik, amelynek mindkét vállalkozás tanúsított résztvevője.
            </p>

            <p className="mb-6">
              A weboldal megnyitásakor a Vercel szerverei technikai okokból rögzíthetik a látogató IP-címét, a böngésző adatait és a kérés időpontját.
            </p>

          <p className="mb-6">
            Cél: a weboldal működtetése, biztonsága, a hibák és a visszaélések felderítése. Jogalap: a GDPR 6. cikk (1) bekezdés (f) pontja - jogos érdek a weboldal biztonságos működtetéséhez.
          </p>

          <p className="mb-6">
            Időtartam: a naplókat a Vercel rövid ideig, saját szabályai szerint tárolja, majd automatikusan törli.
          </p>


          <p className="mb-6">
            A Vercel az Egyesült Államokban is kezelhet adatokat. Az adattovábbítás az EU-USA adatvédelmi keretrendszer (Data Privacy Framework) alapján történik, amelynek a Vercel tanúsított résztvevője.
          </p>

        </section>


        <section className="mb-20">
          <h2 className="text-xl mb-6 font-bold">5. Adatfeldolgozók</h2>

          <Table className="mb-6">
            <TableHeader className="bg-mist-700 hover:bg-mist-700 rounded-t-lg">
              <TableRow className="bg-mist-700 hover:bg-mist-700 rounded-t-lg">
                <TableHead className="text-white rounded-tl-lg">Adatfeldolgozó</TableHead>
                <TableHead className="text-right text-white rounded-tr-lg">Feladat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              
                <TableRow>
                  <TableCell>Vercel Inc., USA</TableCell>
                  <TableCell className="text-right">tárhely, szervernaplók</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Resend</TableCell>
                  <TableCell className="text-right">az űrlapüzenetek továbbítása e-mailben, levelezés</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>CSB IT Hosting & Consulting Bt. </TableCell>
                  <TableCell className="text-right">e-mail tárhely</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>[MongoDB Inc. - MongoDB Atlas, adatközpont: …]</TableCell>
                  <TableCell className="text-right">adatbázis (látogatottsági adatok tárolása)</TableCell>
                </TableRow>
              
            </TableBody>
          </Table>

          <p className="mb-6">
            Személyes adatot harmadik félnek nem adok el, és marketingcélra nem használok.
          </p>



        </section>


        <section className="mb-20">
          <h2 className="text-xl mb-6 font-bold">6. Sütik</h2>

          <p className="mb-6">
            A weboldal a látogatóknál nem használ sütiket. Részletek: <Link className="hover:underline text-gray-500" href="/sutik">Sütik.</Link>
          </p>

        </section>


        <section className="mb-20">
          <h2 className="text-xl mb-6 font-bold">7. Az Ön jogai</h2>

          <p>
            Ön bármikor kérheti:
          </p>

          <ul className="mb-6">
            <li className="list-disc ml-4">tájékoztatást arról, milyen adatait kezelem,</li>
            <li className="list-disc ml-4">adatai helyesbítését,</li>
            <li className="list-disc ml-4">adatai törlését,</li>
            <li className="list-disc ml-4">az adatkezelés korlátozását,</li>
            <li className="list-disc ml-4">adatai átadását tagolt, géppel olvasható formában (adathordozhatóság),</li>
            <li className="list-disc ml-4">és tiltakozhat a jogos érdeken alapuló adatkezelés ellen.</li>
          </ul>

          <p className="mb-6">
            Kérését a <a className="hover:underline text-gray-500" href="mailto:bencskornel@bencsfesto.hu">bencskornel@bencsfesto.hu</a> címre vagy postán küldheti el. Legkésőbb egy hónapon belül válaszolok.
          </p>

        </section>


        <section className="mb-20">
          <h2 className="text-xl mb-6 font-bold">8. Jogorvoslat</h2>


          <p className="mb-6">
            Ha úgy érzi, hogy megsértettem a személyes adatai védelméhez fűződő jogát, panaszt tehet a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH, 1055 Budapest, Falk Miksa utca 9-11, telefon: +36 1 391 1400, e-mail: <a className="hover:underline text-gray-500" href="mailto:ugyfelszolgalat@naih.hu">ugyfelszolgalat@naih.hu</a>, <a className="hover:underline text-gray-500"href="https://www.naih.hu" target="_blank">www.naih.hu</a>), vagy bírósághoz fordulhat. A pert a lakóhelye szerinti törvényszék előtt is megindíthatja.
          </p>

        </section>

      </div>
    </>
  )
}

export default page