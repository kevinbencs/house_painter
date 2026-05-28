import DynamicPagesForm from "@/app/_components/dashboard/dynamicPagesForm"
import { addPlace } from "@/action/addPlace"
import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/checkAuth";


const Page = async() => {
  const auth = await checkAuth();

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
      <DynamicPagesForm  res={res} serverAction={addPlace}/>
    </div>
  )
}

export default Page