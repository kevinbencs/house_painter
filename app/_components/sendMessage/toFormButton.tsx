"use client"

import { Button } from "@/components/ui/button"
import { useForm } from "./formContext"


const ToFormButton = () => {
    const {ref} = useForm()
    
    const handleClick = () => {
        
        ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
            ref.current?.focus()
        },500)
        
    }

    return (
        <Button size="lg" onClick={handleClick} >Űrlap</Button>
    )
}

export default ToFormButton