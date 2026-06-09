import { getServiceFooter } from "@/lib/data";
import { BSPHeading } from "@/typeScriptType/blogServPlace";
import Link from "next/link";


const Services = async () => {
    let data: BSPHeading[];

    try {
        data = await getServiceFooter()
    } catch (error) {
        console.error('[Footer] Failed to load footer data:', error)

        return(
            <div></div>
        )
    }


    return (
        <section className="flex flex-col items-center">
            {data.map((item) => <Link href={item.heading.replaceAll(' ','-')} key={`footer-service-${item._id}`}>{item.heading}</Link> )}
        </section>
    )
}

export default Services