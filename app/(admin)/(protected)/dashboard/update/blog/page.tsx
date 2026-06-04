import UpdatePagesList from "@/app/_components/dashboard/updatePagesList"
import { checkAuth } from "@/lib/checkAuth";
import { redirect } from "next/navigation";
import { BSP, BSPClientList, BSPGetUpdateList } from "@/typeScriptType/blogServPlace";
import Blog from "@/models/Blog";
import { connection } from "next/server";


const Page = async () => {
  await connection()
  /*const auth = await checkAuth()

  if (auth.error) redirect('/');*/

  const res: BSPGetUpdateList[] = await Blog.find({}, { _id: 1, heading: 1, visibility: 1, createdAt: 1 })

  const list: BSPClientList[] = res.map((item) => ({ id: String(item._id), title: item.heading, visibility: item.visibility, year: new Date(item.createdAt).getFullYear(), month: new Date(item.createdAt).getMonth(), day: new Date(item.createdAt).getDay() }))


  return (
    <div className="w-full">
      <h1 className="text-3xl mb-2">Blogok</h1>
      <UpdatePagesList list={list} page="blog" />
    </div>
  )
}

export default Page