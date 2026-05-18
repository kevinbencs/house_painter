import NewImageForm from "@/app/_components/dashboard/updateImage/newImageForm"
import { checkAuth } from "@/lib/checkAuth";
import { redirect } from "next/navigation";


const Page = async() => {
  const auth = await checkAuth();

  if (auth.error) redirect('/');
  return (
    <>
      <NewImageForm/>
    </>
  )
}

export default Page