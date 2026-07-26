import { getNumbOfImag } from '@/lib/data'
import Blog from '@/models/Blog';
import Place from '@/models/Place';
import Service from '@/models/Service';
import { NextResponse } from 'next/server'

export async function GET() {
    const [numOfImg, blogs, services, places] = await Promise.all([getNumbOfImag(),Blog.find({},{heading: 1, detail: 1}), Service.find({},{heading: 1, detail: 1}), Place.find({},{heading: 1, detail: 1}) ]);

    const placesContent = places.map((item) => `- [${item.heading}](${item.heading.slice(0,item.heading.indexOf('.')+9).replaceAll(" ", "-")}): ${item.detail}`)
    const blogsContent = blogs.map((item) => `- [${item.heading}](${item.heading.replaceAll(" ", "-")}): ${item.detail}`)
    const servicesContent = services.map((item) => `- [${item.heading}](${item.heading.replaceAll(" ", "-")}): ${item.detail}`)
    
    const pageOfImg: string[] = [];
    for(let i=1; i<= Math.ceil(numOfImg/20); i++){
        pageOfImg.push(
            `- [Képek](https://${process.env.URL}/kepek/${i}): Néhány kép látható a szobafestésekről, tapétázásokról és egyéb szolgáltatásokról.`
        );
    }


    const content = `# Budapesti szobafestő oldal

> Rövid leírás az oldalról.


Az oldal a szobafestő weboldala. Az oldalon fellelhető szolgáltatások elsősorban Budapestre és környékére koncentrálódnak.

## Oldalak
- [Kezdőlap](https://${process.env.URL}/): A budapesti szobafestő weboldalának kezdőlapja, melyen fellelhető néhány kép, szolgáltatás, blog és egyéb a vállalkozás szempontjából fontos információ.
- [Képek](https://${process.env.URL}/kepek): Néhány kép látható a szobafestésekről, tapétázásokról és egyéb szolgáltatásokról.
${pageOfImg}
- [Árak](https://${process.env.URLL}arak): A szolgáltatások (festés, tapétázás, stb.) árai vannak itt feltűntetve.
- [Kapcsolat](https://${process.env.URLL}/kapcsolat): Kapcsolatfelvételi lehetőségekről lehet itt olvasni.
- [Helyek ahol dolgozom](https://${process.env.URL}/helyek): Azoknak a településeknek a felsorolása látható, amelyekre elsősorban koncentrálódnak a szolgáltatások.
${placesContent}
- [Blogok](https://${process.env.URL}/blog): Blog oldalak felsorolása található meg.
${blogsContent}
- [Szolgáltatások](https://${process.env.URL}/szolgaltatas): A vállalkozás szolgáltatásairól néhány felsorolás látható.
${servicesContent}
- [Adatvédelem](https://${process.env.URL}/adatvedelem): Adatvédelmi tájékoztató.
- [Impresszium](https://${process.env.URL}/impresszium): Az impresszium található itt.
- [Sütik](https://${process.env.URL}/sutik): Az oldalon használt sütikről lehet olvasni.
- [Gyakori kérdések](https://${process.env.URL}/kerdesek): A gyakran feltett kérdések és azokra adott válaszok olvashatók.
`
    return new NextResponse(content, {
        headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    })
}