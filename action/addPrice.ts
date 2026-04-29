"use server"

import { handleMongooseError } from "@/lib/mongo"
import Price from "@/models/Price"

type ActionState = null | { error: string } | { message: string } | undefined

export const addPrice = async (_prevState: ActionState, formData: FormData) => {
    try {

        const price = formData.get("price");
        const category = formData.get("category");
        const name = formData.get("name");

        const pr = await new Price({
            name,
            category,
            price
        })

        await pr.save();

        return {message: "Ár hozzáadva"}

    } catch (error) {
        const Error = await handleMongooseError(error)
        return { error: Error }
    }
}