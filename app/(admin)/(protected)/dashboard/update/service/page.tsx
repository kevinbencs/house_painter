import UpdatePagesList from "@/app/_components/dashboard/updatePagesList"
import { checkAuth } from "@/lib/checkAuth";
import { redirect } from "next/navigation";
import { BSPClientList, BSPGetUpdateList } from "@/typeScriptType/blogServPlace";
import Service from "@/models/Service";
import { connection } from "next/server";
import { getBServiceDashboardData } from "@/lib/data";

const Page = async () => {
  await connection()
  /*const auth = await checkAuth()

  if (auth.error) redirect('/');*/

 
  const list: BSPClientList[] = await getBServiceDashboardData()


  return (
    <div className="w-full">
      <h1 className="text-3xl mb-2">Szolgáltatások</h1>
      <div className="w-full"><UpdatePagesList list={list} page="service" /> </div>
    </div>

  )
}

export default Page