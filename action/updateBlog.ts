"use server"

import { checkAuth } from "@/lib/checkAuth";
import { chooseTypeOfTextItem } from "@/lib/checkTextBSP";
import { handleMongooseError } from "@/lib/mongo";
import Blog from "@/models/Blog";
import { blogServPlaceSchemaId } from "@/schema/schema";

export const updateImage = async ( formData: FormData) => {
    try {
        const authRes = await checkAuth();

        if (authRes.error) return { error: "Kérlek jelentkezz be." };

        const heading = (formData.get('heading') as string).replaceAll('\n', '');
        const text = (formData.get('text') as string).replaceAll('\n', '');
        const detail = (formData.get('detail') as string).replaceAll('\n', '');
        const keywords = (formData.get('keywords') as string).replaceAll('\n', '');
        const image = (formData.get('image') as string).replaceAll('\n', '');
        const _id = (formData.get('_id') as string).replaceAll('\n', '');

        const res = blogServPlaceSchemaId.safeParse({
            heading,
            text,
            detail,
            keywords,
            image,
            _id
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

        await Blog.findByIdAndUpdate(_id, {
            detail,
            heading,
            text,
            keywords,
            image
        })

        return { message: "Blog módosítva" }
    } catch (error) {

        const Error = await handleMongooseError(error)
        return { error: Error }
    }
}