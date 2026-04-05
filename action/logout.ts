"use server"

export const logout = async () => {
    try {
        return {message: "Success"}
    } catch (error) {
        console.log(error);

        return {error: "Failed logout"}
    }
}