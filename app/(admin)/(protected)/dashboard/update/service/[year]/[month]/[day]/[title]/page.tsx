import DynamicPagesForm from "@/app/_components/dashboard/dynamicPagesForm"
import { addService } from "@/action/addService"

const page = ({ params }: { params: { year: string, month: string, day: string, title: string } }) => {


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
      <DynamicPagesForm params={params} res={res} serverAction={addService} />
    </div>
  )
}

export default page