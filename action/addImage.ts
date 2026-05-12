"use server"

import { put } from "@vercel/blob";
import Image from "@/models/Image";
import { handleMongooseError } from "@/lib/mongo";
import { ActionState } from "@/typeScriptType/form";
import { checkAuth } from "@/lib/checkAuth";
import { imageSchema } from "@/schema/schema";


export const AddImage = async (_prevState: ActionState, formData: FormData) => {
    try {

        const authRes = await checkAuth();

        if (authRes.error) return { error: "Kérlek jelentkezz be." };

        const file = formData.get('image') as File;
        const alt = formData.get('image-alt') as String;
        const url = formData.get('image-url') as String;

        const res = imageSchema.safeParse({
            newUrl: url,
            detail: alt,
            file: file,
        })

        if (res.error?.issues) {
            console.log(res.error.issues)
            return { failed: res.error.issues.map((item) => item.message) }
        }

        const blob = await put(file.name, file, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
            addRandomSuffix: true,
        });

        const index = blob.pathname.lastIndexOf(".")

        const typeOfImage = blob.pathname.slice(index, blob.pathname.length)

        const img = await new Image({
            newUrl: url+typeOfImage,
            blobUrl: blob.pathname,
            detail: alt
        })

        await img.save()


        return {message: "Kép feltöltve"}
    } catch (error) {

        const Error = await handleMongooseError(error)
        return {error: Error}
    }
}