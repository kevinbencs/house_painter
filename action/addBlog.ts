"use server"

import { checkAuth } from "@/lib/checkAuth";
import { chooseTypeOfTextItem } from "@/lib/checkTextBSP";
import { handleMongooseError } from "@/lib/mongo";
import Blog from "@/models/Blog";
import { blogServPlaceSchema } from "@/schema/schema";
import { updateTag } from "next/cache";

export const addBlog = async ( formData: FormData) => {
    try {
        /*const auth = await checkAuth()

        if (auth.error) return { error: "Kérlek jelentkezz be." };*/
        

        const heading = (formData.get('heading') as string).replaceAll('\r','');
        const text = (formData.get('text') as string).replaceAll('\r','');
        const detail = (formData.get('detail') as string).replaceAll('\r','');
        const keywords = (formData.get('keywords') as string).replaceAll('\r','');
        const image = (formData.get('image') as string).replaceAll('\r','');

        const res = blogServPlaceSchema.safeParse({
            heading,
            text,
            detail,
            keywords,
            image
        })

        if (res.error) {
            console.log(res.error.issues);
            return { failed: res.error.issues.map((item) => item.message) }
        }


        const textArr = text.split("\n")
        for (let i = 0; i < textArr.length; i++) {
            const mess = chooseTypeOfTextItem(textArr[i])
            if (mess.indexOf('Error') > -1) return {error: mess}
        }

        const blog = new Blog({
            heading,
            text,
            detail,
            image,
            keywords,
            visibility: false
        });

        await blog.save();

        updateTag('blog-list')

        return {message: "Blog létrehozva"}
    } catch (error) {
        const err = await handleMongooseError(error)
        return {error: err}
    }
}