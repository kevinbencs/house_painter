"use server"

import { handleMongooseError } from "@/lib/mongo"
import Price from "@/models/Price";
import { updateTag } from "next/cache";



export const deletePrice = async ( _id: string) => {
    try {
        await Price.findByIdAndDelete(_id);

        updateTag("price-data");
        updateTag("price-cat")

        return {message: "Ár törölve"}
    } catch (error) {
        const Error = await handleMongooseError(error);

        return {error: Error}
    }
}