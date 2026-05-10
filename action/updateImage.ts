"use server"

import Image from "@/models/Image";
import { handleMongooseError } from "@/lib/mongo";
import { ActionState } from "@/typeScriptType/form";


export const updateImage = async (_prevState: ActionState, formData: FormData) => {
    try {

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