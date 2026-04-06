"use server"

export const logout = async () => {
    try {
        return {message: "Success"}
    } catch (error) {
        console.error(error);

        return {error: "Failed logout"}
    }
}