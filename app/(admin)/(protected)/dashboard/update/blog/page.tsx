import UpdatePagesList from "@/app/_components/dashboard/updatePagesList"

interface List {
    id: string,
    title: string,
    year: string,
    month: string,
    day: string
}

const Page = () => {
  const l = [{
    id:'w',
    title: "fa",
    year:"2026",
    month: "02",
    day: "03"
  }]

  
  return (
    <div className="w-full"><UpdatePagesList lists={l} page="blog"/> </div>
  )
}

export default Page