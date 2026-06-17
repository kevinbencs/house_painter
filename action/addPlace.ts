"use server"

import { checkAuth } from "@/lib/checkAuth";
import { chooseTypeOfTextItem } from "@/lib/checkTextBSP";
import { handleMongooseError } from "@/lib/mongo";
import Place from "@/models/Place";
import { PlaceSchema } from "@/schema/schema";
import { updateTag } from "next/cache";

export const addPlace = async ( formData: FormData) => {
     try {
        /*const auth = await checkAuth()

        if (auth.error) return { error: "Kérlek jelentkezz be." };*/
        

        const heading = formData.get('heading') as string;
        const text = formData.get('text') as string;
        const detail = formData.get('detail') as string;
        const keywords = formData.get('keywords') as string;
        const image = formData.get('image') as string;
        const paragh = formData.get('paragh') as string;

        const res = PlaceSchema.safeParse({
            heading,
            text,
            detail,
            keywords,
            image,
            paragh
        })

        if (res.error) {
            console.log(res.error.issues);
            return { failed: res.error.issues.map((item) => item.message) }
        }

        const textArr = text.split("\n")
        for (let i = 0; i < textArr.length; i++) {
            const mess = chooseTypeOfTextItem(textArr[i])
            if (mess.indexOf('Error') > -1) return { error: mess }
        }

        const place= new Place({
            heading,
            text,
            detail,
            image,
            keywords,
            visibility: false,
            paragh
        });

        await place.save();

        updateTag('place-list')


        return {message: "Új hely hozzáadva"}
    } catch (error) {
        const err = await handleMongooseError(error)
        return {error: err}
    }
}