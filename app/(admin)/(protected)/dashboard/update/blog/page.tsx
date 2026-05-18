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
    year: "2026",
    month: "02",
    day: "03"
  }]


  return (
    <div className="w-full"><UpdatePagesList lists={l} page="blog" /> </div>
  )
}

export default Page