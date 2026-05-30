import UpdatePagesList from "@/app/_components/dashboard/updatePagesList"
import { checkAuth } from "@/lib/checkAuth";
import { redirect } from "next/navigation";
import { BSPClientList, BSPGetUpdateList } from "@/typeScriptType/blogServPlace";
import Service from "@/models/Service";
import { connection } from "next/server";

const Page = async () => {
  await connection()
  /*const auth = await checkAuth()

  if (auth.error) redirect('/');*/

  const res: BSPGetUpdateList[] = await Service.find({}, { _id: 1, heading: 1, hide: 1, createdAt: 1 })

  const list: BSPClientList[] = res.map((item) => ({ id: String(item._id), title: item.heading, hide: item.hide, year: new Date(item.createdAt).getFullYear(), month: new Date(item.createdAt).getMonth(), day: new Date(item.createdAt).getDay() }))


  return (
    <div className="w-full">
      <h1 className="text-3xl mb-2">Szolgáltatások</h1>
      <div className="w-full"><UpdatePagesList list={list} page="service" /> </div>
    </div>

  )
}

export default Page