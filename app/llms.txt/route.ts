import { getNumbOfImagPage } from '@/lib/data'
import Blog from '@/models/Blog';
import Place from '@/models/Place';
import Service from '@/models/Service';
import { NextResponse } from 'next/server'

export async function GET() {
    const [numOfImg, blogs, services, places] = await Promise.all([getNumbOfImagPage(),Blog.find({},{heading: 1, detail: 1}), Service.find({},{heading: 1, detail: 1}), Place.find({},{heading: 1, detail: 1}) ]);

    const placesContent = places.map((item: {heading: string, detail: string}) => `- [${item.heading}]((${process.env.URL}/${item.heading.slice(0,item.heading.indexOf('.')+9).replaceAll(" ", "-")}): ${item.detail}`)
    const blogsContent = blogs.map((item: {heading: string, detail: string}) => `- [${item.heading}]((${process.env.URL}/${item.heading.replaceAll(" ", "-")}): ${item.detail}`)
    const servicesContent = services.map((item: {heading: string, detail: string}) => `- [${item.heading}]((${process.env.URL}/${item.heading.replaceAll(" ", "-")}): ${item.detail}`)
    
    const pageOfImg: string[] = [];
    for(let i=1; i<= Math.ceil(numOfImg/20); i++){
        pageOfImg.push(
            `- [Képek](${process.env.URL}/kepek/${i}): Néhány kép látható a szobafestésekről, tapétázásokról és egyéb szolgáltatásokról.`
        );
    }


    const content = `# Budapesti szobafestő oldal

> Rövid leírás Bencs Kornél szobafestő ${process.env.URL} oldaláról.


Az oldal a szobafestő weboldala. Az oldalon fellelhető szolgáltatások elsősorban Budapestre és környékére koncentrálódnak.

## Oldalak
- [Kezdőlap](${process.env.URL}/): A budapesti szobafestő weboldalának kezdőlapja, melyen fellelhető néhány kép, szolgáltatás, blog és egyéb a vállalkozás szempontjából fontos információ.
- [Képek](${process.env.URL}/kepek): Néhány kép látható a szobafestésekről, tapétázásokról és egyéb szolgáltatásokról.
${pageOfImg.join('\n')}
- [Árak](${process.env.URL}/arak): A szolgáltatások (festés, tapétázás, stb.) árai vannak itt feltűntetve.
- [Kapcsolat](${process.env.URL}/kapcsolat): Kapcsolatfelvételi lehetőségekről lehet itt olvasni.
- [Helyek ahol dolgozom](${process.env.URL}/helyek): Azoknak a településeknek a felsorolása látható, amelyekre elsősorban koncentrálódnak a szolgáltatások.
${placesContent.join('\n')}
- [Blogok](${process.env.URL}/blog): Blog oldalak felsorolása található meg.
${blogsContent.join('\n')}
- [Szolgáltatások](${process.env.URL}/szolgaltatas): A vállalkozás szolgáltatásairól néhány felsorolás látható.
${servicesContent.join('\n')}
- [Adatvédelem](${process.env.URL}/adatvedelem): Adatvédelmi tájékoztató.
- [Impresszium](${process.env.URL}/impresszium): Az impresszium található itt.
- [Sütik](${process.env.URL}/sutik): Az oldalon használt sütikről lehet olvasni.
- [Gyakori kérdések](${process.env.URL}/kerdesek): A gyakran feltett kérdések és azokra adott válaszok olvashatók.
`
    return new NextResponse(content, {
        headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    })
}