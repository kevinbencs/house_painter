"use server"

import { checkAuth } from "@/lib/checkAuth";
import { handleMongooseError } from "@/lib/mongo";
import Blog from "@/models/Blog";
import { blogServPlaceSchema } from "@/schema/schema";
import { ActionState } from "@/typeScriptType/form";


export const updateImage = async (_prevState: ActionState, formData: FormData) => {
    try {
        const authRes = await checkAuth();

        const heading = formData.get('heading') as string;
        const text = formData.get('text') as string;
        const detail = formData.get('detail') as string;
        const keywords = formData.get('keywords') as string;
        const image = formData.get('image') as string;
        const _id = formData.get('_id') as string;

        const res = blogServPlaceSchema.safeParse({
            heading,
            text,
            detail,
            keywords,
            image
        })

        if (res.error?.issues) {
            console.log(res.error.issues)
            return { failed: res.error.issues.map((item) => item.message) }
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