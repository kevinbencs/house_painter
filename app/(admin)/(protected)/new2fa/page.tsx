import { Suspense } from "react"
import Totp from "./totp"



const page = async () => {


  return (
    <div>
      <Suspense fallback={"...Betölt"}>
        <Totp/>
      </Suspense>
    </div>
  )
}

export default page