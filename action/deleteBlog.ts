"use server"

import { checkAuth } from "@/lib/checkAuth";
import { handleMongooseError } from "@/lib/mongo";
import Blog from "@/models/Blog";
import { deleteSchema } from "@/schema/schema";

export const deleteBlog = async (_id: string) => {
    try {
        const authRes = await checkAuth();

        if(authRes.error) return { error: "Kérlek jelentkezz be." };

        const res = deleteSchema.safeParse(_id);
        if (res.error?.issues) {
            console.log(res.error.issues)
            return { failed: res.error.issues.map((item) => item.message) }
        }

        await Blog.findByIdAndUpdate(_id,{
            hide: true
        })

        return {message: "Blog törölve."}

    } catch (error) {
        const Error = await handleMongooseError(error);

        return { error: Error }
    }
}