import Totp from "../../../_components/new2fa/totp"
import { checkTwoFAToken } from "@/lib/checkAuth";
import { redirect } from "next/navigation";



const page = async () => {
  const res = await checkTwoFAToken();

  if (res.error) redirect('/');

  return (
    <div className="flex justify-center mt-5">
        <Totp />
    </div>
  )
}

export default page