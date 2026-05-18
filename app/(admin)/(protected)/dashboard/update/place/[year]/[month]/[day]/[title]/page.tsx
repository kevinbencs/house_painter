
import DynamicPagesForm from "@/app/_components/dashboard/dynamicPagesForm"
import { addPlace } from "@/action/addPlace"
import { checkAuth } from "@/lib/checkAuth";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: Promise<{ year: string, month: string, day: string, title: string }> }) => {
  const auth = await checkAuth()

  if (auth.error) redirect('/');

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
      <DynamicPagesForm params={await params} res={res} serverAction={addPlace} />
    </div>
  )
}

export default page