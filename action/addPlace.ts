"use server"

import { checkAuth } from "@/lib/checkAuth";
import { handleMongooseError } from "@/lib/mongo";
import Place from "@/models/Place";
import { blogServPlaceSchema } from "@/schema/schema";
import { ActionState } from "@/typeScriptType/form"

export const addPlace = async (_prevState: ActionState, formData: FormData) => {
     try {
        const auth = await checkAuth()

        if (auth.error) return { error: "Kérlek jelentkezz be." };
        

        const heading = formData.get('heading') as string;
        const text = formData.get('text') as string;
        const detail = formData.get('detail') as string;
        const keywords = formData.get('keywords') as string;
        const image = formData.get('image') as string;

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

        const blog = new Place({
            heading,
            text,
            detail,
            image,
            keywords
        });

        await blog.save();

        return {message: "Új hely hozzáadva"}
    } catch (error) {
        const err = handleMongooseError(error)
        return {error: err}
    }
}