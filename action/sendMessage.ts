"use server"

import { handleMongooseError } from "@/lib/mongo";
import { messageSchema } from "@/schema/schema";
import { ActionState } from "@/typeScriptType/form"
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND);


export const sendMessage = async (_prevState: ActionState, formData: FormData) => {
    try {
        const name = formData.get("name");
        const email = formData.get("email");
        const message = formData.get("message")

        const res = messageSchema.safeParse({
            name,
            email,
            message
        });

        if (res.error?.issues) {
            console.log(res.error.issues)
            return { failed: res.error.issues.map((item) => item.message) }
        }

        const { data, error } = await resend.batch.send({
            from: 'Acme <onboarding@resend.dev>',
            to: ['delivered@resend.dev'],
            subject: 'Árajánlat kérés: ' + name,
            html: `<div>${message}</div><div>Név: ${name}</div><div>Email: ${email}</div>`,
        })

        if (error) {
            console.log(error)
            return {error: 'Hiba, próbáld újra'};
        }

        return {message: "Üzenet elküldve"}


    } catch (error) {
        console.log(error)
        return { error: 'Hiba, próbáld újra' }
    }

}