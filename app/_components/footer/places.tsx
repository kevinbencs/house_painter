import { getPlaceFooter } from "@/lib/data";
import { BSPHeading } from "@/typeScriptType/blogServPlace";
import { cacheTag } from "next/cache";
import Link from "next/link";


const Places = async () => {
    'use cache'
    cacheTag('kell')
    let data: BSPHeading[];

    try {
        data = await getPlaceFooter()
    } catch (error) {
        

        return (
            <div></div>
        )
    }
    

    return (
        <div className="flex flex-col md:flex-row gap-5">
            <section className="flex flex-col items-center">
                {data.slice(0, data.length / 2).map((item) => <Link href={'/helyek/'+item.heading.replaceAll(' ', '-')} key={`footer-place-${item._id}`}>{item.heading.slice(12, item.heading.indexOf('-')-12)}</Link>)}
            </section>
            <section className="flex flex-col items-center">
                {data.slice(data.length / 2, data.length).map((item) => <Link href={'/helyek/'+item.heading.replaceAll(' ', '-')} key={`footer-place-${item._id}`}>{item.heading.slice(12, item.heading.indexOf('.') + 9)}</Link>)}
            </section>
        </div>

    )
}

export default Places