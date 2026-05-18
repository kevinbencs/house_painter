import ImageUpdatePage from "@/app/_components/dashboard/updateImage/imageUpdatePage";
import { checkAuth } from "@/lib/checkAuth";
import { getAllImg } from "@/lib/data";
import { redirect } from "next/navigation";
import { Suspense } from "react";


const Page = async () => {
  const auth = await checkAuth()

  if (auth.error) redirect('/');

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