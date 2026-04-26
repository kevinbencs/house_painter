"use server"

import { put } from "@vercel/blob";
import Image from "@/models/Image";

type ActionState = null | {error: string} | {message: string} | undefined

export const AddImage = async (_prevState: ActionState, formData: FormData) => {
    try {
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            return { error: "BLOB_READ_WRITE_TOKEN is missed." };
        }


        const file = formData.get('image') as File;
        const alt = formData.get('image-alt') as String;
        const url = formData.get('image-url') as String;

        /*const img = await new Image({

        })*/


        const blob = await put(file.name, file, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN
        });

        console.log(blob.pathname)

        return {message: "Kép feltöltve"}
    } catch (error) {
        console.error(error)
        return {error: "Server error"}
    }
}