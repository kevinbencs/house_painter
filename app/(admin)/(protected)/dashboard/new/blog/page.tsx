import Blog from "@/app/_components/dashboard/blog"


const Page = () => {
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
      <Blog params={params}  res={res} />
    </div>
  )
}

export default Page