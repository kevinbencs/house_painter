"use server"

import { checkAuth } from "@/lib/checkAuth";
import { chooseTypeOfTextItem } from "@/lib/checkTextBSP";
import { handleMongooseError } from "@/lib/mongo";
import Blog from "@/models/Blog";
import { blogServPlaceSchemaId } from "@/schema/schema";
import { updateTag } from "next/cache";

export const updateBlog = async ( formData: FormData) => {
    try {
        const authRes = await checkAuth();

        if (authRes.error) return { error: "Kérlek jelentkezz be." };

        const heading = (formData.get('heading') as string ?? '').replaceAll('\r', '');
        const text = (formData.get('text') as string ?? '').replaceAll('\r', '');
        const detail = (formData.get('detail') as string ?? '').replaceAll('\r', '');
        const keywords = (formData.get('keywords') as string ?? '').replaceAll('\r', '');
        const image = (formData.get('image') as string ?? '').replaceAll('\r', '');
        const _id = (formData.get('_id') as string ?? '').replaceAll('\r', '');

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

        const blog = await Blog.findByIdAndUpdate(_id, {
            detail,
            heading,
            text,
            keywords,
            image
        })

        if (!blog) return { error: "A blog nem található." };

        updateTag('blog-list');
        updateTag('main-page-blogs');
        updateTag('blog-'+heading.replaceAll(" ", "-"))
        updateTag('blog-page-'+heading.replaceAll(" ", "-"))
        

        return { message: "Blog módosítva" }
    } catch (error) {

        const err = await handleMongooseError(error)
        return { error: err }
    }
}