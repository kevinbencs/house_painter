"use server"

import { handleMongooseError } from "@/lib/mongo"
import Price from "@/models/Price"
import { addPriceSchema } from "@/schema/schema"
import { ActionState } from "@/typeScriptType/form"
import { updateTag } from "next/cache"


export const addPrice = async (_prevState: ActionState, formData: FormData) => {
    const price = formData.get("price");
    const category = formData.get("category");
    const name = formData.get("name");
    const unitOfMea = formData.get("unitOfMea")
    try {

        /*const auth = await checkAuth()

        if (auth.error) return { error: "Kérlek jelentkezz be.", fieldData: [price, category, name, unitOfMea] };*/



        const res = addPriceSchema.safeParse({
            price: Number(String(price).replace(/\s/g, '')),
            category,
            name,
            unitOfMea
        })

        if (res.error) {
            console.log(res.error.issues);
            return { failed: res.error.issues.map((item) => item.message), fieldData: [price, category, name, unitOfMea] }
        }

        const pr = await new Price({
            name,
            category,
            price: Number(String(price).replace(/\s/g, '')),
            unitOfMea
        })

        await pr.save();

        updateTag('price-data');
        updateTag('price-cat')

        return { message: "Ár hozzáadva" }

    } catch (error) {

        const Error = await handleMongooseError(error)
        return { error: Error, fieldData: [price, category, name, unitOfMea] }
    }
}