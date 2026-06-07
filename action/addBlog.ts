"use server"

import { checkAuth } from "@/lib/checkAuth";
import { handleMongooseError } from "@/lib/mongo";
import Blog from "@/models/Blog";
import { blogServPlaceSchema } from "@/schema/schema";
import { updateTag } from "next/cache";

export const addBlog = async ( formData: FormData) => {
    try {
        /*const auth = await checkAuth()

        if (auth.error) return { error: "Kérlek jelentkezz be." };*/
        

        const heading = (formData.get('heading') as string).replaceAll('\n','');
        const text = (formData.get('text') as string).replaceAll('\n','');
        const detail = (formData.get('detail') as string).replaceAll('\n','');
        const keywords = (formData.get('keywords') as string).replaceAll('\n','');
        const image = (formData.get('image') as string).replaceAll('\n','');

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

        return {message: "Cikk létrehozva"}
    } catch (error) {
        const err = await handleMongooseError(error)
        return {error: err}
    }
}