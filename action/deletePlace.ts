"use server"

import { checkAuth } from "@/lib/checkAuth";
import { handleMongooseError } from "@/lib/mongo";
import Place from "@/models/Place";
import { deleteSchema } from "@/schema/schema";
import { updateTag } from "next/cache";

export const deletePlace = async (_id: string) => {
    try {

        const authRes = await checkAuth();

        if(authRes.error) return { error: "Kérlek jelentkezz be." };


        const res = deleteSchema.safeParse(_id);
        if (res.error?.issues) {
            console.log(res.error.issues)
            return { failed: res.error.issues.map((item) => item.message) }
        }

        const old = await Place.findById(_id)

        const place = await Place.findByIdAndUpdate(_id,{
            visibility: false
        })

        if (!place) return { error: "A hely nem található." };
        updateTag('place-list')
        updateTag('place-footer')
        updateTag('place-' + old.heading.slice(0,old.heading.indexOf('.')+9).replaceAll(" ", "-"))
        updateTag('place-page-' + old.heading.slice(0,old.heading.indexOf('.')+9).replaceAll(" ", "-"))

        return {message: "Hely törölve."}

    } catch (error) {
        const err = await handleMongooseError(error);

        return { error: err }
    }
}