"use server"

import { handleMongooseError } from "@/lib/mongo"
import Price from "@/models/Price"
import { updateTag } from "next/cache"

type ActionState = null | { message: string } | { error: string } | undefined

export const updatePrice = async (_prevSate: ActionState, formData: FormData) => {
    try {

        const arr = [];
        for (const [key, value] of formData) {
            arr.push(value);
        }

        const newArr = []

        for (let i = 4; i < arr.length; i += 5) {
            const obj: { name: string, _id: string, category: string, price: string ,unitOfMea: string} = { name: "", _id: "", category: "", price: "", unitOfMea: "" };
            obj["_id"] = arr[i] as string;
            obj["name"] = arr[i + 1] as string;
            obj["category"] = arr[i + 2] as string;
            obj["price"] = String(arr[i + 3]).replace(/\s/g, '')
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
        return { error: Error }
    }
}