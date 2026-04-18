"use server"

export const addService= async () => {
    try {
        return {message: ""}
    } catch (error) {
        console.error(error)
        return {error: ""}
    }
}