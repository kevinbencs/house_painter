import TwoFAForm from "@/app/_components/login/twofaForm"
import { checkAuth, checkTwoFAToken } from "@/lib/checkAuth"
import { redirect } from "next/navigation";


const page = async() => {
  const res = await Promise.all([
    checkAuth(),
    checkTwoFAToken()
  ])

  if(res[0].success) redirect('/dashboard');

  if (res[1].error) redirect('/');

  if(res[1].twofa === "") redirect("/new2fa")
  
  return (
    <div className="flex justify-center h-screen pt-40">
      <div className=" h-[300px] w-full flex justify-center">
        <TwoFAForm/>
      </div>
    </div>
  )
}

export default page