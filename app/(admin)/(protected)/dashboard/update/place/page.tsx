import UpdatePagesList from "@/app/_components/dashboard/updatePagesList"
import { checkAuth } from "@/lib/checkAuth";
import { redirect } from "next/navigation";

interface List {
  id: string,
  title: string,
  year: string,
  month: string,
  day: string
}

const Page = async () => {
  const auth = await checkAuth()

  if (auth.error) redirect('/');

  const l = [{
    id: 'w',
    title: "fa",
    year: "ad",
    month: "safd",
    day: "asd"
  }]


  return (
    <div className="w-full"><UpdatePagesList lists={l} page="place" /> </div>
  )
}

export default Page