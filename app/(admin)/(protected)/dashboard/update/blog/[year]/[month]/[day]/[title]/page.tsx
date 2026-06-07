
import DynamicPagesForm from "@/app/_components/dashboard/dynamicPagesForm"
import { addBlog } from "@/action/addBlog";
import { checkAuth } from "@/lib/checkAuth";
import { redirect } from "next/navigation";
import Blog from "@/models/Blog";
import { connection } from "next/server";

const Page = async ({ params }: { params: Promise<{ year: string, month: string, day: string, title: string }> }) => {
  /*const auth = await checkAuth()

  if (auth.error) redirect('/');*/
  await connection()
  const par = await params
  const title = par.title.replaceAll('-', ' ')
  const data = await Blog.findOne({heading: decodeURIComponent(title)})

  const res = {
    error: undefined,
    failed: undefined,
    data: {
      title: data?.heading || "",
      text: data?.text || "",
      cover_img_id: data?.image || "",
      keyword: data?.keywords.split(";") || [""],
      id: String(data?._id) || "",
      detail: data?.detail || "",
    }
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl mb-2">Blog szerkesztése</h1>
      {data === null && <div className="text-center text-2xl">Nincs ilyen blog</div> } 
      {data && <DynamicPagesForm res={res} serverAction={addBlog} />}
    </div>
  )
}

export default Page