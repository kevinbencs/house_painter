"use server"

import { put } from "@vercel/blob";
import Image from "@/models/Image";
import { handleMongooseError } from "@/lib/mongo";
import { ActionState } from "@/typeScriptType/form";
import { checkAuth } from "@/lib/checkAuth";
import { imageSchema } from "@/schema/schema";
import { updateTag } from "next/cache";
import { getNumbOfImagPage } from "@/lib/data";


export const AddImage = async (_prevState: ActionState, formData: FormData) => {
    const file = formData.get('image');
    const alt = formData.get('image-alt');
    const url = formData.get('image-url');
    try {

        /*const authRes = await checkAuth();

        if (authRes.error) return { error: "Kérlek jelentkezz be.", fieldData: [file, alt, url] };*/



        const res = imageSchema.safeParse({
            newUrl: url,
            detail: alt,
            file: file,
        })

        if (res.error?.issues) {
            console.log(res.error.issues)
            return { failed: res.error.issues.map((item) => item.message), fieldData: [file, alt, url] }
        }


        if (file instanceof File) {

            const index = file?.name.lastIndexOf(".")

            const typeOfImage = file.name.slice(index, file.name.length)

            const isImg = await Image.find({
                newUrl: url + typeOfImage
            })

            if(isImg.length > 0) return {error: "Az url-t már használja egy másik kép.", fieldData: [file, alt, url]}

            const blob = await put(file.name, file, {
                access: 'public',
                token: process.env.BLOB_READ_WRITE_TOKEN,
                addRandomSuffix: true,
            });



            const img = await new Image({
                newUrl: url + typeOfImage,
                blobUrl: blob.pathname,
                detail: alt
            })

            await img.save()
            updateTag('main-page-images')
            updateTag('img-numb')

            const numbOfPage = await getNumbOfImagPage()

            for (let i = 1; i <= numbOfPage; i++) {
                updateTag('img-data-' + String(i))
                updateTag('image-site-' + String(i))
            }



            return { message: "Kép feltöltve" }
        }

        return { error: "Hiányzik a kép", fieldData: [file, alt, url] }

    } catch (error) {
        const err = await handleMongooseError(error)
        return { error: err, fieldData: [file, alt, url] }
    }
}