"use client"

import { logout } from "@/action/logout"
import { useTransition } from "react"

const LogoutButton = () => {

    const [isPending, startTransition] = useTransition()

    const onClick = () => {
        startTransition(async() => {
            try {
                await logout()
            } catch (error) {
                console.log(error)
            }
        })
    }
  return (
    <button onClick={onClick} disabled={isPending}>Kilépés</button>
  )
}

export default LogoutButton