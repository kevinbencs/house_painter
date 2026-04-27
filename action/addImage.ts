"use server"

import { put } from "@vercel/blob";
import Image from "@/models/Image";
import { handleMongooseError } from "@/lib/mongo";

type ActionState = null | {error: string} | {message: string} | undefined

export const AddImage = async (_prevState: ActionState, formData: FormData) => {
    try {
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            return { error: "BLOB_READ_WRITE_TOKEN is missed." };
        }


        const file = formData.get('image') as File;
        const alt = formData.get('image-alt') as String;
        const url = formData.get('image-url') as String;

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