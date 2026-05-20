import TwoFAForm from "@/app/_components/login/twofaForm"
import { checkTwoFAToken } from "@/lib/checkAuth"
import { redirect } from "next/navigation";


const page = async() => {
  const res = await checkTwoFAToken();

  if(res.error) redirect('/');
  
  return (
    <div className="flex justify-center h-screen pt-40">
      <div className=" h-[300px] w-full flex justify-center">
        <TwoFAForm/>
      </div>
    </div>
  )
}

export default page