import DynamicPagesForm from "@/app/_components/dashboard/dynamicPagesForm"
import { addService } from "@/action/addService"
import { checkAuth } from "@/lib/checkAuth";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import Service from "@/models/Service";

const page = async ({ params }: { params: Promise<{ year: string, month: string, day: string, title: string }> }) => {

  /*const auth = await checkAuth()

  if (auth.error) redirect('/');*/

  await connection()
  const par = await params
  const title = par.title.replaceAll('-', ' ')
  const data = await Service.findOne({heading: title})

  

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
      <h1 className="text-3xl mb-2">Szolgáltatás szerkesztése</h1>
      <DynamicPagesForm  res={res} serverAction={addService} />
    </div>
  )
}

export default page