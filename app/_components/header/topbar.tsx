import { getServiceTopBar } from "@/lib/data";
import { BSPHeading } from "@/typeScriptType/blogServPlace"
import Link from "next/link";


const TopBar = async () => {
  
  let data: BSPHeading[];

  try {
    data = await getServiceTopBar()
  } catch (error) {
    console.error('[Topbar] Failed to load topbar data:', error)
    return(<div></div>)
  }

  return (
    <div className='hidden  lg:block bg-zinc-950 pr-5 pl-5 pt-2  text-gray-400 pb-2'>

        <nav >
          <ul className=" text-xs pt-0 pb-0 flex justify-center">
            {data.map((item) => <Link href={item.heading.replaceAll(' ','-')} key={`topbar-service-${item._id}`}>{item.heading}</Link> )}
          </ul>
        </nav>

        
      </div>
  )
}

export default TopBar