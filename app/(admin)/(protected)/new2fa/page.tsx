import { Suspense } from "react"
import Totp from "../../../_components/new2fa/totp"



const page = async () => {


  return (
    <div className="flex justify-center mt-5">
      <Suspense fallback={"...Töltés"}>
        <Totp/>
      </Suspense>
    </div>
  )
}

export default page