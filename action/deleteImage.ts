"use server"

import { handleMongooseError } from "@/lib/mongo"
import Image from "@/models/Image";
import { del } from "@vercel/blob";
import { deleteSchema } from "@/schema/schema";
import * as z from "zod"
import { updateTag } from "next/cache";
import { getNumbOfImag } from "@/lib/data";

interface Img {
    blobUrl: string,
    newUrl: string,
    detail: string,
    show: boolean,
    _id: string
}

export const deleteImage = async (_id: string) => {
    try {

        /*const auth = await checkAuth()

        if (auth.error) return { error: "Kérlek jelentkezz be." };*/

        const res = deleteSchema.safeParse(_id);
        if (res.error?.issues) {
            console.log(res.error.issues)
            return { failed: res.error.issues.map((item) => item.message) }
        }

        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            return { error: "BLOB_READ_WRITE_TOKEN is missed." };
        }

        const img: Img | null = await Image.findByIdAndDelete(_id);

        if (!img) return { error: "Image is not in the database" }

        const blob = await del(img.blobUrl)

        updateTag('main-page-images')
        updateTag('img-numb')
        updateTag('img-id-'+_id)

        const numbOfImg = await getNumbOfImag()
        const numbOfPage = Math.ceil(numbOfImg / 20)

        for (let i = 1; i <= numbOfPage; i++) {
            updateTag('img-data-' + String(i))
            updateTag('image-site-' + String(i))
        }

        return { message: "Kép törölve." }

    } catch (error) {

        const Error = await handleMongooseError(error);
        return { error: Error }
    }
}