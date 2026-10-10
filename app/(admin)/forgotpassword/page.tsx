import EmailForm from "@/app/_components/newpassword/emailForm"


const page = () => {
  return (
    <div className="flex justify-center h-screen pt-40">
      <div className=" h-75 w-full flex justify-center">
        <EmailForm/>
      </div>
    </div>
  )
}

export default page