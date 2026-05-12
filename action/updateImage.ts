"use server"

import Image from "@/models/Image";
import { handleMongooseError } from "@/lib/mongo";
import { ActionState } from "@/typeScriptType/form";
import { checkAuth } from "@/lib/checkAuth";
import {  imageIdSchema } from "@/schema/schema";


export const updateImage = async (_prevState: ActionState, formData: FormData) => {
    try {

        const authRes = await checkAuth();

        if (authRes.error) return { error: "Kérlek jelentkezz be." };

        const _id = formData.get('image-id') as String;
        const detail = formData.get('image-alt') as String;
        const newUrl = formData.get('image-url') as String;
        const show = formData.get('image-visibility') as String;

        const res = imageIdSchema.safeParse({
            _id,
            newUrl,
            detail,
            show,
        })

        if (res.error?.issues) {
            console.log(res.error.issues)
            return { failed: res.error.issues.map((item) => item.message) }
        }

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