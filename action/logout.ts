"use server"

import { cookies } from "next/headers";

export const logout = async () => {
    try {
        const cookieStore = await cookies();

        cookieStore.delete("longAuthToken")
        cookieStore.delete("shortAuthToken")

        return {message: "Success"}
    } catch (error) {
        console.error(error);

        return {error: "Failed logout"}
    }
}