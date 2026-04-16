"use server"

export const writeBlog = async () => {
    try {
        return {message: ""}
    } catch (error) {
        console.error(error)
        return {error: ""}
    }
}