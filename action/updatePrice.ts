"use server"

import { handleMongooseError } from "@/lib/mongo"
import Price from "@/models/Price"
import { updatePriceSchema } from "@/schema/schema"
import { ActionState } from "@/typeScriptType/form"
import { updateTag } from "next/cache"


export const updatePrice = async (_prevSate: ActionState, formData: FormData) => {
    try {

        /*const auth = await checkAuth()

        if (auth.error) return { error: "Kérlek jelentkezz be." };*/

        const arr = [];
        for (const [key, value] of formData) {
            arr.push(value);
        }

        for (let i = 4; i < arr.length; i += 5) {
            const _id = arr[i]
            const name = arr[i + 1] 
            const category = arr[i + 2] 
            const price = Number(String(arr[i + 3]).replace(/\s/g, ''))
            const unitOfMea = arr[i+4]

            const res = updatePriceSchema.safeParse({
                _id,
                category,
                name,
                price,
                unitOfMea
            })
        }

        const newArr = []

        for (let i = 4; i < arr.length; i += 5) {
            const obj: { name: string, _id: string, category: string, price: number ,unitOfMea: string} = { name: "", _id: "", category: "", price: 0, unitOfMea: "" };
            obj["_id"] = arr[i] as string;
            obj["name"] = arr[i + 1] as string;
            obj["category"] = arr[i + 2] as string;
            obj["price"] = Number(String(arr[i + 3]).replace(/\s/g, ''))
            obj["unitOfMea"] = String(arr[i+4])

            newArr.push(obj);
        }

        await Price.bulkWrite(newArr.map((item) => ({
            replaceOne: {
                filter: { _id: item._id },
                replacement: { name: item.name, category: item.category, price: item.price, unitOfMea: item.unitOfMea }
            }
        })))

        updateTag('price-data');
        updateTag('price-cat')
        
        return { message: "Mentve" }

    } catch (error) {
        const Error = await handleMongooseError(error);
        return { error: Error, fieldData:[''] }
    }
}