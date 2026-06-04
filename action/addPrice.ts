"use server"

import { handleMongooseError } from "@/lib/mongo"
import Price from "@/models/Price"
import { addPriceSchema } from "@/schema/schema"
import { ActionState } from "@/typeScriptType/form"
import { updateTag } from "next/cache"


export const addPrice = async (_prevState: ActionState, formData: FormData) => {
    try {

        /*const auth = await checkAuth()

        if (auth.error) return { error: "Kérlek jelentkezz be." };*/

        const price = Number(String(formData.get("price")).replace(/\s/g, ''));
        const category = formData.get("category");
        const name = formData.get("name");
        const unitOfMea = formData.get("unitOfMea")

        const res = addPriceSchema.safeParse({
            price,
            category,
            name,
            unitOfMea
        })

        if (res.error) {
            console.log(res.error.issues);
            return { failed: res.error.issues.map((item) => item.message) }
        }

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