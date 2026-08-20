"use server"


import { messageSchema } from "@/schema/schema";
import { ActionState } from "@/typeScriptType/form"
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND);


export const sendMessage = async (_prevState: ActionState, formData: FormData) => {
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");
    const privacy = formData.get("privacy")


    const res = messageSchema.safeParse({
        name,
        email,
        message,
        privacy
    });

    if (res.error?.issues) {
        console.log(res.error.issues)
        return { failed: res.error.issues.map((item) => item.message), fieldData: [name, email, message, privacy === 'on' ? true : false] }
    }

    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [process.env.EMAIL!],
        subject: 'Árajánlat kérés: ' + name,
        html: `<div>${message}</div><div>Név: ${name}</div><div>Email: ${email}</div>`,
    })

    if (error) {
        console.error(error)
        return { error: 'Hiba, próbáld újra', fieldData: [name, email, message, privacy] };
    }

    return { message: "Üzenet elküldve" }


}