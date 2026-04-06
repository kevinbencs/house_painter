import EmailForm from "@/app/_components/forgetpassword/emailForm"


const page = () => {
  return (
    <div className="flex justify-center h-screen pt-40">
      <div className=" h-[300px] w-full flex justify-center">
        <EmailForm/>
      </div>
    </div>
  )
}

export default page