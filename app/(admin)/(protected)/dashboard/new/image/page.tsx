import NewImageForm from "@/app/_components/dashboard/updateImage/newImageForm"
import { checkAuth } from "@/lib/checkAuth";
import { redirect } from "next/navigation";


const Page = async () => {
  /*const auth = await checkAuth();

  if (auth.error) redirect('/');*/
  return (
    <>
      <h1 className="text-3xl mb-2">Új kép</h1>
      <NewImageForm />
    </>
  )
}

export default Page