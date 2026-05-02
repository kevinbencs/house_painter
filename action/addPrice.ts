"use server"

import { handleMongooseError } from "@/lib/mongo"
import Price from "@/models/Price"
import { updateTag } from "next/cache"

type ActionState = null | { error: string } | { message: string } | undefined

export const addPrice = async (_prevState: ActionState, formData: FormData) => {
    try {

        const price = formData.get("price");
        const category = formData.get("category");
        const name = formData.get("name");
        const unitOfMea = formData.get("unitOfMea")

        const pr = await new Price({
            name,
            category,
            price,
            unitOfMea
        })

        await pr.save();

        updateTag('price-data');
        updateTag('price-cat')

        return {message: "Ár hozzáadva"}

    } catch (error) {
        const Error = await handleMongooseError(error)
        return { error: Error }
    }
}