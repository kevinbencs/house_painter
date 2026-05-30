import DynamicPagesForm from "@/app/_components/dashboard/dynamicPagesForm"
import { addService } from "@/action/addService"
import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/checkAuth";
import { connection } from "next/server";


const Page = async () => {
  await connection()
  /*const auth = await checkAuth()

  if (auth.error) redirect('/');*/



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
      <h1 className="text-3xl mb-2">Új szolgáltatás hozzáadása</h1>
      <DynamicPagesForm res={res} serverAction={addService} />
    </div>
  )
}

export default Page