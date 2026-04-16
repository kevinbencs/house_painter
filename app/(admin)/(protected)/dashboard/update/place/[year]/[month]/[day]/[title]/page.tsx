
import DynamicPagesForm from "@/app/_components/dashboard/dynamicPagesForm"
import { writePlace } from "@/action/writePlace"

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
      <DynamicPagesForm params={params} res={res} serverAction={writePlace} />
    </div>
  )
}

export default page