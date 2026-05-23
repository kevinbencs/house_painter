
import Form from "@/app/_components/login/form"
import { checkAuth, checkTwoFAToken } from "@/lib/checkAuth";
import { redirect } from "next/navigation";


const Page = async() => {
  const res = await Promise.all([
    checkAuth(),
    checkTwoFAToken()
  ])

  if(res[0].success) redirect('/dashboard');

  if (res[1].res && res[1].twofa !== "") redirect('/login/2fa');

  if(res[1].res && res[1].twofa === "") redirect('/new2fa');

  return (
    <div className="flex justify-center h-screen pt-40">
      <div className=" h-[400px] w-full flex justify-center">
          <Form />
      </div>
    </div>
  )
}

export default Page