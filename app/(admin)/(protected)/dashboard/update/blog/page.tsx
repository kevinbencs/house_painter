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
    year:"ad",
    month: "safd",
    day: "asd"
  }]

  
  return (
    <div><UpdatePagesList lists={l} page="blog"/> </div>
  )
}

export default Page