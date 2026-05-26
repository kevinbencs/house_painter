import UpdatePagesList from "@/app/_components/dashboard/updatePagesList"
import { checkAuth } from "@/lib/checkAuth";
import { redirect } from "next/navigation";
import {  BSPClientList } from "@/typeScriptType/blogServPlace";


const Page = async () => {
  const auth = await checkAuth()

  if (auth.error) redirect('/');

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