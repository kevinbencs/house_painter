
import DynamicPagesForm from "@/app/_components/dashboard/dynamicPagesForm"
import { addPlace } from "@/action/addPlace"
import { checkAuth } from "@/lib/checkAuth";
import { redirect } from "next/navigation";
import Place from "@/models/Place";



const page = async ({ params }: { params: Promise<{ title: string }> }) => {
  const auth = await checkAuth()

  if (auth.error) redirect('/');


  const par = await params
  const title = par.title
  const data = await Place.findOne({ heading: { $regex: decodeURIComponent(title).replaceAll('-', ' ').replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" }}).lean()


  const res = {
    error: undefined,
    failed: undefined,
    data: {
      title: data.heading,
      text: data.text,
      cover_img_id: data.image,
      keyword: data.keywords.split(";"),
      id: String(data._id),
      detail: data.detail,
    }
  }


  return (
    <div className="w-full">
      <h1 className="text-3xl mb-2">Hely szerkesztése</h1>
      <DynamicPagesForm  res={res} serverAction={addPlace} />
    </div>
  )
}

export default page