import DynamicPagesForm from "@/app/_components/dashboard/dynamicPagesForm"
import { addBlog } from "@/action/addBlog";
import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/checkAuth";


const Page = async () => {
  const auth = await checkAuth();

  if (auth.error) redirect('/');
  const params= {
    year: "0",
    month: "0",
    day: "0",
    title: ""
  }

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
      <DynamicPagesForm params={params}  res={res} serverAction={addBlog}/>
    </div>
  )
}

export default Page