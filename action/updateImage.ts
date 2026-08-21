"use server"

import Image from "@/models/Image";
import { handleMongooseError } from "@/lib/mongo";
import { ActionState } from "@/typeScriptType/form";
import { checkAuth } from "@/lib/checkAuth";
import { imageIdSchema } from "@/schema/schema";
import { updateTag } from "next/cache";
import { getAllImg,  } from "@/lib/data";


export const updateImage = async (_prevState: ActionState, formData: FormData) => {
    const _id = formData.get('_id');
    const detail = formData.get('detail');
    const newUrl = formData.get('newUrl');
    const show = formData.get('image-visibility');
    try {

        const authRes = await checkAuth();

        if (authRes.error) return { error: "Kérlek jelentkezz be.", fieldData: [_id, detail, newUrl, show] };



        const res = imageIdSchema.safeParse({
            _id,
            newUrl,
            detail,
            show,
        })

        if (res.error?.issues) {
            console.log(res.error.issues)
            return { failed: res.error.issues.map((item) => item.message), fieldData: [_id, detail, newUrl, show] }
        }

        await Image.findByIdAndUpdate(_id, {
            detail,
            newUrl,
            show: show === 'on' ? true : false
        })

        updateTag('img-id-' + _id)
        updateTag('main-page-images')


        const allImg = await getAllImg()

        for (let i = 0; i <= allImg.length; i++) {
            if (_id === allImg[i]._id) {
                const page = Math.ceil(i / 20);
                updateTag('img-data-' + String(page))
                updateTag('image-site-' + String(page))
            }
        }


        return { message: "Kép adatai módosítva" }
    } catch (error) {

        const err = await handleMongooseError(error)
        return { error: err, fieldData: [_id, detail, newUrl, show] }
    }
}