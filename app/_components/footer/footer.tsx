import { Suspense } from "react"
import Copyright from "./copyright"
import LinksDescription from "./linksDescription"
import SocialMeadia from "./socialMedia"

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white ">
      <div className=" md:pr-[5%] md:pl-[5%]   pt-10 pb-10 flex justify-center">
        <LinksDescription />
      </div>
      <div className="p-5  border-t-2 border-b-2 border-mist-500 ">
        <SocialMeadia />
      </div>

      <div className=" pt-5 ">
        <Suspense>
          <Copyright />
        </Suspense>
      </div>
    </footer>
  )
}

export default Footer