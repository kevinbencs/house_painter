"use server"

export const addPlace = async () => {
    try {
        return {message: ""}
    } catch (error) {
        console.error(error)
        return {error: ""}
    }
}