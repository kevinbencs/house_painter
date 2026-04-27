import ImageUpdaetPage from "@/app/_components/dashboard/updateImage/imageUpdaetPage";
import Image from "@/models/Image"

interface Img {
  _id: string,
  newUrl: string,
  detail: string,
  show: boolean
}

const Page = async () => {
  const imgs: Img[] = await Image.find({}, '_id newUrl detail');

  return (
   <section>
     <ImageUpdaetPage  img={imgs} />
   </section>
  )
}

export default Page