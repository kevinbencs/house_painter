"use server"

import Image from "@/models/Image";
import { handleMongooseError } from "@/lib/mongo";

type ActionState = null | {error: string} | {message: string} | undefined

export const updateImage = async (_prevState: ActionState, formData: FormData) => {
    try {
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            return { error: "BLOB_READ_WRITE_TOKEN is missed." };
        }


        const _id = formData.get('image-id') as String;
        const detail = formData.get('image-alt') as String;
        const newUrl = formData.get('image-url') as String;
        const show = formData.get('image-visibility') as String;


        await Image.findByIdAndUpdate(_id,{
            detail,
            newUrl,
            show
        })

        return {message: "Kép adatai módosítva"}
    } catch (error) {

        const Error = await handleMongooseError(error)
        return {error: Error}
    }
}