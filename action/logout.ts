"use server"

import { cookies } from "next/headers";

export const logout = async () => {
    try {
        const cookieStore = await cookies();

        cookieStore.delete("longAuthToken")
        cookieStore.delete("shortAuthToken")

        return {redirect: "/"}
    } catch (error) {
        console.error(error);

        return {error: "Failed logout"}
    }

    
}