"use client"

import { logout } from "@/action/logout"
import { useTransition } from "react"
import { CiLogout } from "react-icons/ci";
import { useLogged } from "../loggedContext/isLoggedContext";

const LogoutButton = () => {

  const [isPending, startTransition] = useTransition()
  const { setLink } = useLogged();
  const onClick = () => {
    startTransition(async () => {
      setLink('');
      await logout()
    })
  }
  return (
    <button onClick={onClick} disabled={isPending} className='hover:text-gray-200  flex items-center gap-2 w-full p-2 rounded-xs'  ><CiLogout /> Kilépés</button>
  )
}

export default LogoutButton