import { getServiceFooter } from "@/lib/data";
import { BSPHeading } from "@/typeScriptType/blogServPlace";
import Link from "next/link";


const Services = async () => {

    const data: BSPHeading[] = await getServiceFooter()

    return (
        <section className="flex md:flex-col items-center justify-center gap-3 md:gap-1 flex-wrap mt-4">
            {data.map((item) => <Link className="hover:underline" href={'/szolgaltatas/' + item.heading.replaceAll(' ', '-')} key={`footer-service-${item._id}`}>{item.heading}</Link>)}
        </section>
    )
}

export default Services