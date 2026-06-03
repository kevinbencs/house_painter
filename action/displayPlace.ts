"use server"

import { checkAuth } from "@/lib/checkAuth";
import { handleMongooseError } from "@/lib/mongo";
import Place from "@/models/Place";
import { deleteSchema } from "@/schema/schema";
import { updateTag } from "next/cache";

export const displayPlace = async (_id: string) => {
    try {

        const authRes = await checkAuth();

        if(authRes.error) return { error: "Kérlek jelentkezz be." };


        const res = deleteSchema.safeParse(_id);
        if (res.error?.issues) {
            console.log(res.error.issues)
            return { failed: res.error.issues.map((item) => item.message) }
        }

        await Place.findByIdAndUpdate(_id,{
            hide: false
        })

        updateTag('place-list')

        return {message: "Hely megjelenítve."}

    } catch (error) {
        const Error = await handleMongooseError(error);

        return { error: Error }
    }
}