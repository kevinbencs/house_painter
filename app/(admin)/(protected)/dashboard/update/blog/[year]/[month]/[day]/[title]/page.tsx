
import DynamicPagesForm from "@/app/_components/dashboard/dynamicPagesForm"
import { addBlog } from "@/action/addBlog";

const Page = async ({ params }: { params: Promise<{ year: string, month: string, day: string, title: string }> }) => {
  

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
      <DynamicPagesForm params={await params} res={res} serverAction={addBlog} />
    </div>
  )
}

export default Page