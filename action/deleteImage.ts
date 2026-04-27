"use server"

import { handleMongooseError } from "@/lib/mongo"
import Image from "@/models/Image";
import { del } from "@vercel/blob";

interface Img {
    blobUrl: string,
    newUrl: string,
    detail: string,
    show: boolean,
    _id: string
}

export const deleteImage = async (_id: string) => {
    try {

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