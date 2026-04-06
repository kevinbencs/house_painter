"use server"


type ActionState = { message: string } | { error: string } | null

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
        return {message: "success"}
    } catch (error) {
        console.error(error)
        return {error: "Failed login"}
    }
}