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
    'XXI. kerület',
    'XXII. kerület',
    'XXIII. kerület',

]

const Places = async () => {
    let data: BSPHeading[];


    data = await getPlaceFooter()

    const name = data.map(item => item.heading.slice(12, item.heading.indexOf(' - ')))


    const city = place.map((item) => {
        if (name.indexOf(item) > -1) { let p = data[name.indexOf(item)]; return <Link href={'/helyek/' + p.heading.slice(0, p.heading.indexOf('.') + 9).replaceAll(' ', '-')} className="hover:underline" key={`footer-place-${p._id}`}>{p.heading.slice(12, p.heading.indexOf(' - ') )}</Link> }
        return <li className=" list-none" key={`footer-place-${item + '-key'}`}>{item}</li>
    })



    return (
        <div className="flex pl-2 pr-2 md:pr-0 mt-4 md:pl-0 flex-col gap-5 items-center md:flex-row md:gap-10">

            <section className="flex justify-center max-h-[284px] md:gap-x-5 md:justify-start  flex-wrap gap-5 md:gap-1 md:flex-col items-center md:items-start">
                {city}
            </section>


            {/*<section className="flex flex-wrap gap-5 md:flex-col md:gap-1 items-center md:items-start">
                {city.slice(city.length / 2, city.length)}
            </section>*/}
        </div>

    )
}

export default Places