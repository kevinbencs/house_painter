import ImageUpdatePage from "@/app/_components/dashboard/updateImage/imageUpdatePage";
import { getAllImg } from "@/lib/data";
import { Suspense } from "react";


const Page = async () => {
  const imgs = await getAllImg()

  return (
    <section>
      <Suspense fallback={<div>Betöltés...</div>}>
        <ImageUpdatePage img={imgs} />
      </Suspense>

    </section>
  )
}

export default Page