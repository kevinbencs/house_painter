"use server"

type ActionState = null | {error: string} | {message: string} | undefined

export const addImage = async (_prevState: ActionState, formData: FormData) => {
    try {
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            return { error: "BLOB_READ_WRITE_TOKEN is missed." };
        }

        return {message: "Kép feltöltve"}
    } catch (error) {
        console.error(error)
        return {error: "Server error"}
    }
}