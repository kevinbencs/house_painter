"use server"

import { handleMongooseError } from "@/lib/mongo"
import Price from "@/models/Price";
import { deleteSchema } from "@/schema/schema";
import { updateTag } from "next/cache";



export const deletePrice = async ( _id: string) => {
    try {
         const res = deleteSchema.safeParse(_id);
        if(res.error?.issues) {
            console.log(res.error.issues)
            return {failed: res.error.issues.map((item) => item.message)}
        }
        
        await Price.findByIdAndDelete(_id);

        updateTag("price-data");
        updateTag("price-cat")

        return {message: "Ár törölve"}
    } catch (error) {
        const Error = await handleMongooseError(error);

        return {error: Error}
    }
}