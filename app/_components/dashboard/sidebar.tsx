"use client"

import Link from "next/link"
import LogoutButton from "./logoutButton"
import { v4 as uuidv4 } from "uuid"
import { usePathname } from "next/navigation"
import { FaPencil } from "react-icons/fa6";
import { FaWallet } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";
import { FaFileImage } from "react-icons/fa";
import { IoIosImages } from "react-icons/io";
import { FaMap } from "react-icons/fa";
import { FaPaintRoller } from "react-icons/fa";

const Links = [
  {url: "/dashboard", text: 'Dashboard', img: <MdDashboard />},
  {url: "/dashboard/2fa", text: '2FA', img: <FaLock />},
  {url: "/dashboard/new/password", text: 'Új jelszó', img: <MdOutlinePassword />},
  {url: "/dashboard/new/image", text: 'Új Kép hozzáadása', img: <FaFileImage />},
  {url: "/dashboard/price", text: 'Árak', img: <FaWallet />},
  {url: "/dashboard/new/blog", text: 'Új blog', img: <FaPencil />},
  {url: "/dashboard/update/image", text: 'Képek szerkesztése', img: <IoIosImages />},
  {url: "/dashboard/new/service", text: 'Új szolgáltatás írása', img: <FaPaintRoller />},
  {url: "/dashboard/new/place", text: 'Új hely hozzáadása', img: <FaMap />},
]

const Sidebar = () => {
  const pathname = usePathname()
  return (
    <section className="flex flex-col items-start justify-between bg-gray-900 p-10 text-gray-400 rounded pb-4 text-sm min-w-[251px]">
      {Links.map((item) => <Link className={`hover:text-gray-200  flex items-center gap-2 w-full p-2 rounded-xs ${pathname === item.url ? 'text-white' : ''}`} key={uuidv4()} href={item.url}>{item.img} {item.text}</Link> )}
        <LogoutButton/>
    </section>
  )
}

export default Sidebar