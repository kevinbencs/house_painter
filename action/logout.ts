"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const logout = async () => {
    try {
        const cookieStore = await cookies();

        cookieStore.delete("longAuthToken")
        cookieStore.delete("shortAuthToken")

        redirect('/')
    } catch (error) {
        console.error(error);

        return {error: "Failed logout"}
    }
}