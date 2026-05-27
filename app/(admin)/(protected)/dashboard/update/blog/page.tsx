import UpdatePagesList from "@/app/_components/dashboard/updatePagesList"
import { checkAuth } from "@/lib/checkAuth";
import { redirect } from "next/navigation";
import { BSP, BSPClientList } from "@/typeScriptType/blogServPlace";
import Blog from "@/models/Blog";
import { connection } from "next/server";


const Page = async () => {
  await connection()
  /*const auth = await checkAuth()

  if (auth.error) redirect('/');*/

  const res = await Blog.find({}, { _id: 1, heading: 1, hide: 1, createdAt: 1 })

  res.map((item) => ({id: item._id, title: item.heading, hide: item.hide, year: new Date(item.created).getFullYear() , month:new Date(item.created).getMonth(), day:new Date(item.created).getDay() }))

  const l = [{
    id: 'w',
    title: "fa",
    year: "2026",
    month: "02",
    day: "03",
    hide: false
  }]


  return (
    <div className="w-full"><UpdatePagesList list={l} page="blog" /> </div>
  )
}

export default Page