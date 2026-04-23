import DynamicPagesForm from "@/app/_components/dashboard/dynamicPagesForm"
import { addService } from "@/action/addService"

const page = async ({ params }: { params: Promise<{ year: string, month: string, day: string, title: string }> }) => {


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
      <DynamicPagesForm params={await params} res={res} serverAction={addService} />
    </div>
  )
}

export default page