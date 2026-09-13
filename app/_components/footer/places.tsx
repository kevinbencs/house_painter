import { getPlaceFooter } from "@/lib/data";
import { BSPHeading } from "@/typeScriptType/blogServPlace";
import Link from "next/link";


const place = [
    'I. kerület',
    'II. kerület',
    'III. kerület',
    'IV. kerület',
    'V. kerület',
    'VI. kerület',
    'VII. kerület',
    'VIII. kerület',
    'IX. kerület',
    'X. kerület',
    'XI. kerület',
    'XII. kerület',
    'XIII. kerület',
    'XIV. kerület',
    'XV. kerület',
    'XVI. kerület',
    'XVII. kerület',
    'XVIII. kerület',
    'XIX. kerület',
    'XX. kerület',
    'XI. kerület',
    'XII. kerület',
    'XIII. kerület',

]

const Places = async () => {
    let data: BSPHeading[];

    try {
        data = await getPlaceFooter()
    } catch (error) {


        return (
            <div></div>
        )
    }

    const name = data.map(item => item.heading.slice(12, item.heading.indexOf('-') - 12))


    const city = place.map((item) => {
        if (name.indexOf(item) > -1) { let p = data[name.indexOf(item)]; return <Link href={'/helyek/' + p.heading.slice(0, p.heading.indexOf('.') + 9).replaceAll(' ', '-')} className="hover:underline" key={`footer-place-${p._id}`}>{p.heading.slice(12, p.heading.indexOf('-') - 12)}</Link> }
        return <li className="hover:underline" key={`footer-place-${item + '-key'}`}>{item}</li>
    })

    return (
        <div className="flex flex-col md:flex-row gap-5">

            <section className="flex flex-col items-center">
                {city.slice(0, city.length / 2)}
            </section>


            <section className="flex flex-col items-center">
                {city.slice(city.length / 2, city.length)}
            </section>
        </div>

    )
}

export default Places