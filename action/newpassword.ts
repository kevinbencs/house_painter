"use server"

import { loginSchema } from "@/schema/schema"
import Admin from "@/models/Admin"
import { checkAuth } from "@/lib/checkAuth"


type ActionState = { message: string } | { error: string } | null | {failed: string[]}

export const sendEmail = async (_prevState: ActionState, formData: FormData) => {
    try {
        return {message: "success"}
    } catch (error) {
        console.error(error)
        return {error: "Failed login"}
    }
}

export const changePassword = async (_prevState: ActionState, formData: FormData) => {
    try {
       const auth = await checkAuth()

        const password = formData.get('password');
        const passwordConfirm = formData.get('passwordConfirm')

        const res = loginSchema.safeParse({
            password,
            passwordConfirm
        })

        if(res.error){
            console.log(res.error.issues);
            return {failed: res.error.issues.map((item) => item.message)}
        }

        const id = "sdjfiesafjiefewofm"

        const admin = await Admin.findByIdAndUpdate(id,{
            password
        })

        return {message: "success"}
    } catch (error) {
        console.error(error)
        return {error: "Failed login"}
    }
}