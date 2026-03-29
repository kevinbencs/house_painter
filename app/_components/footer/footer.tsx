import LinksDescription from "./linksDescription"
import SendMessage from "./sendMessage"

const Footer = () => {
  return (
    <footer>
      <div className="flex justify-center m-2">
        <SendMessage/>
      </div>
      <div className="mt-2 pr-[5%] pl-[5%]  bg-gray-800 text-white  pt-10 pb-10 flex justify-center">
        <LinksDescription/>
      </div>
    </footer>
  )
}

export default Footer