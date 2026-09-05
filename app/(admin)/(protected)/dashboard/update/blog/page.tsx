import UpdatePagesList from "@/app/_components/dashboard/updatePagesList"
import { checkAuth } from "@/lib/checkAuth";
import { redirect } from "next/navigation";
import { BSP, BSPClientList, BSPGetUpdateList } from "@/typeScriptType/blogServPlace";
import Blog from "@/models/Blog";
import { connection } from "next/server";
import { getBlogDashboardData } from "@/lib/data";


const Page = async () => {
  await connection()
  /*const auth = await checkAuth()

  if (auth.error) redirect('/');*/

  const list = await getBlogDashboardData()

  return (
    <div className="w-full">
      <h1 className="text-3xl mb-2">Blogok</h1>
      <UpdatePagesList list={list} page="blog" />
    </div>
  )
}

export default Page