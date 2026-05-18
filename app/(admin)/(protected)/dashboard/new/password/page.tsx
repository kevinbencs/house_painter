import NewPassword from "@/app/_components/newpassword/newPassword"
import { checkAuth } from "@/lib/checkAuth";
import { redirect } from "next/navigation";

const Page = async() => {
  const auth = await checkAuth()

  if (auth.error) redirect('/');

  return (
      <div className="flex justify-center h-screen pt-40 w-full">
        <div className=" h-[300px] w-full flex justify-center">
          <NewPassword url="" />
        </div>
      </div>

  )
}

export default Page