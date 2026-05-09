
import NewPassword from "@/app/_components/newpassword/newPassword"


const Page = async ({params}: {params: Promise<{token: string}>}) => {
    const param = await params
    return (
        <div className="flex justify-center h-screen pt-40">
            <div className=" h-[300px] w-full flex justify-center">
                <NewPassword url={param.token}/>
            </div>
        </div>
    )
}

export default Page