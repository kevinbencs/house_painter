import DynamicPagesForm from "@/app/_components/dashboard/dynamicPagesForm"
import { writeService } from "@/action/writeService"

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
      <DynamicPagesForm params={params} res={res} serverAction={writeService} />
    </div>
  )
}

export default page