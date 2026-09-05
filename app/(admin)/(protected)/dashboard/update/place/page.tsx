import UpdatePagesList from "@/app/_components/dashboard/updatePagesList"
import { checkAuth } from "@/lib/checkAuth";
import { redirect } from "next/navigation";
import { BSPClientList, BSPGetUpdateList } from "@/typeScriptType/blogServPlace";
import Place from "@/models/Place";
import { connection } from "next/server";
import { getBPlaceDashboardData } from "@/lib/data";


const Page = async () => {
  await connection()
  /*const auth = await checkAuth()

  if (auth.error) redirect('/');*/

  
  const list = await getBPlaceDashboardData()

  return (
    <div className="w-full">
      <h1 className="text-3xl mb-2">Helyek</h1>
      <UpdatePagesList list={list} page="place" />
    </div>
  )
}

export default Page