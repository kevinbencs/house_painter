import DynamicPagesForm from "@/app/_components/dashboard/dynamicPagesForm"
import { writeBlog } from "@/action/writeBlog";


const Page = () => {
  const params= {
    year: "0",
    month: "0",
    day: "0",
    title: ""
  }

  const res = {
    error: undefined,
    failed: undefined,
    data: {
      title: "",
      text: "",
      cover_img_id: "",
      keyword: [],
      id: "",
      detail: "",
    }
  }

  return (
    <div className="w-full">
      <DynamicPagesForm params={params}  res={res} serverAction={writeBlog}/>
    </div>
  )
}

export default Page