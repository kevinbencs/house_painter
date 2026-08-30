"use server"

import { checkAuth } from "@/lib/checkAuth";
import { chooseTypeOfTextItem } from "@/lib/checkTextBSP";
import { handleMongooseError } from "@/lib/mongo";
import Place from "@/models/Place";
import {  placeSchemaId } from "@/schema/schema";
import { updateTag } from "next/cache";


export const updatePlace = async ( formData: FormData) => {
    try {
        const authRes = await checkAuth();

        if (authRes.error) return { error: "Kérlek jelentkezz be." };

        const heading = (formData.get('heading') as string ?? '').replaceAll('\r','');
        const text = (formData.get('text') as string ?? '').replaceAll('\r','');
        const detail = (formData.get('detail') as string ?? '').replaceAll('\r','');
        const keywords = (formData.get('keywords') as string ?? '').replaceAll('\r','');
        const image = (formData.get('image') as string ?? '').replaceAll('\r','');
        const _id = (formData.get('_id') as string ?? '').replaceAll('\r','');
        const headingParahg = (formData.get('paragh' ?? '') as string).replaceAll('\r','');

        const res = placeSchemaId.safeParse({
            heading,
            text,
            detail,
            keywords,
            image,
            _id,
            paragh: headingParahg
        })

        if (res.error?.issues) {
            console.log(res.error.issues)
            return { failed: res.error.issues.map((item) => item.message) }
        }

        const textArr = text.split("\n")
        for (let i = 0; i < textArr.length; i++) {
            const mess = chooseTypeOfTextItem(textArr[i])
            if (mess.indexOf('Error') > -1) return { error: mess }
        }

        const old = await Place.findById(_id)

        const place = await Place.findByIdAndUpdate(_id, {
            detail,
            heading,
            text,
            keywords,
            image
        })

        if (!place) return { error: "A hely nem található." };

        updateTag('place-list')
        updateTag('place-footer')
        updateTag('place-' + old.heading.slice(0,old.heading.indexOf('.')+9).replaceAll(" ", "-"))
        updateTag('place-page-' + old.heading.slice(0,old.heading.indexOf('.')+9).replaceAll(" ", "-"))

        return { message: "A település módosítva" }
    } catch (error) {

        const err = await handleMongooseError(error)
        return { error: err }
    }
}