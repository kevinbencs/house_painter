"use server"

import { checkAuth } from "@/lib/checkAuth";
import { handleMongooseError } from "@/lib/mongo";
import Blog from "@/models/Blog";
import { deleteSchema } from "@/schema/schema";
import { updateTag } from "next/cache";

export const displayBlog = async (_id: string) => {
    try {
        const authRes = await checkAuth();

        if (authRes.error) return { error: "Kérlek jelentkezz be." };

        const res = deleteSchema.safeParse(_id);
        if (res.error?.issues) {
            console.log(res.error.issues)
            return { failed: res.error.issues.map((item) => item.message) }
        }

        const blog = await Blog.findByIdAndUpdate(_id, {
            visibility: true
        })

        if (!blog) return { error: "A blog nem található." };

        updateTag('blog-list');
        updateTag('main-page-blogs');
        updateTag('blog-' + blog.heading.replaceAll(" ", "-"))
        updateTag('blog-page-' + blog.heading.replaceAll(" ", "-"))

        return { message: "Blog visszaállítva." }

    } catch (error) {
        const err = await handleMongooseError(error);

        return { error: err }
    }
}