import { getPlaceFooter } from "@/lib/data";
import { BSPHeading } from "@/typeScriptType/blogServPlace";
import Link from "next/link";


const Services = async () => {
    let data: BSPHeading[];

    try {
        data = await getPlaceFooter()
    } catch (error) {
        console.error('[Footer] Failed to load footer data:', error)

        return (
            <div></div>
        )
    }


    return (
        <div className="flex flex-col md:flex-row">
            <section className="flex flex-col items-center">
                {data.slice(0, data.length / 2).map((item) => <Link href={item.heading.replaceAll(' ', '-')} key={`footer-service-${item._id}`}>{item.heading}</Link>)}
            </section>
            <section className="flex flex-col items-center">
                {data.slice(data.length / 2, data.length).map((item) => <Link href={item.heading.replaceAll(' ', '-')} key={`footer-service-${item._id}`}>{item.heading}</Link>)}
            </section>
        </div>

    )
}

export default Services