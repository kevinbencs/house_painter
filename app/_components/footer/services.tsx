import { getServiceFooter } from "@/lib/data";
import { BSPHeading } from "@/typeScriptType/blogServPlace";
import Link from "next/link";


const Services = async () => {

    const data: BSPHeading[] = await getServiceFooter()

    return (
        <section className="flex flex-col items-center">
            {data.map((item) => <Link href={'/szolgaltatas/' + item.heading.replaceAll(' ', '-')} key={`footer-service-${item._id}`}>{item.heading}</Link>)}
        </section>
    )
}

export default Services