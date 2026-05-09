"use server"

import { handleMongooseError } from "@/lib/mongo"
import Image from "@/models/Image";
import { del } from "@vercel/blob";
import { deleteSchema } from "@/schema/schema";
import * as z from "zod"

interface Img {
    blobUrl: string,
    newUrl: string,
    detail: string,
    show: boolean,
    _id: string
}

export const deleteImage = async (_id: string) => {
    try {

        const res = deleteSchema.safeParse(_id);
        if(res.error?.issues) {
            console.log(res.error.issues)
            return {failed: res.error.issues.map((item) => item.message)}
        }
       
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            return { error: "BLOB_READ_WRITE_TOKEN is missed." };
        }

        const img: Img | null = await Image.findByIdAndDelete(_id);

        if (!img) return { error: "Image is not in the database" }

        const blob = await del(img.blobUrl)

        return {message: "Kép törölve."}

    } catch (error) {
        
        const Error = await handleMongooseError(error);
        return { error: Error }
    }
}