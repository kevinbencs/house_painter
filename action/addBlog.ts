"use server"

import { BSP } from "@/typeScriptType/blogServPlace"

export const addBlog = async (_prevState: BSP, formData: FormData) => {
    try {
        return {message: ""}
    } catch (error) {
        console.error(error)
        return {error: ""}
    }
}