"use client"

import { logout } from "@/action/logout"
import { useTransition } from "react"
import { CiLogout } from "react-icons/ci";
import { useLogged } from "../loggedContext/isLoggedContext";

const LogoutButton = () => {

    const [isPending, startTransition] = useTransition()
    const { setLogged } = useLogged();

    const onClick = () => {
        startTransition(async() => {
            try {
                const res = await logout()

                if(res.redirect){
                    setLogged(false);
                    
                }
            } catch (error) {
                console.log(error)
            }
        })
    }
  return (
    <button onClick={onClick} disabled={isPending} className='hover:text-gray-200  flex items-center gap-2 w-full p-2 rounded-xs'  ><CiLogout /> Kilépés</button>
  )
}

export default LogoutButton