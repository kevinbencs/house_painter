import Totp from "../../../_components/new2fa/totp"
import { checkAuth, checkTwoFAToken } from "@/lib/checkAuth";
import { redirect } from "next/navigation";



const page = async () => {

  const res = await Promise.all([
    checkAuth(),
    checkTwoFAToken()
  ])

  if(res[0].success) redirect('/dashboard');

  if (res[1].error) redirect('/');

  if(res[1].twofa !== "") redirect("/login/2fa")

  return (
    <div className="flex justify-center mt-5">
        <Totp />
    </div>
  )
}

export default page