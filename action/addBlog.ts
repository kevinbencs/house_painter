"use server"

import { ActionState } from "@/typeScriptType/form"

export const addBlog = async (_prevState: ActionState, formData: FormData) => {
    try {
        return {message: ""}
    } catch (error) {
        console.error(error)
        return {error: ""}
    }
}