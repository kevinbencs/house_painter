import Blog from "@/app/_components/dashboard/blog"

const page = ({params}: {params: {year: string, month: string, day: string, title: string}}) => {
  

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
      <Blog params={params}  res={res} />
    </div>
  )
}

export default page