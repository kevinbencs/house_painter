"use server"

import { handleMongooseError } from "@/lib/mongo";
import { deleteSchema } from "@/schema/schema";

export const deletePlace = async (_id: string) => {
    try {
        const res = deleteSchema.safeParse(_id);
        if (res.error?.issues) {
            console.log(res.error.issues)
            return { failed: res.error.issues.map((item) => item.message) }
        }

    } catch (error) {
        const Error = await handleMongooseError(error);

        return { error: Error }
    }
}