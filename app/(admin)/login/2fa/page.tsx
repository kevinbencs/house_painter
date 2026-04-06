import TwoFAForm from "@/app/_components/login/twofaForm"


const page = () => {
  return (
    <div className="flex justify-center h-screen pt-40">
      <div className=" h-[300px] w-full flex justify-center">
        <TwoFAForm/>
      </div>
    </div>
  )
}

export default page