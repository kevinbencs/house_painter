"use server"

import { loginSchema } from "@/schema/schema"
import Admin from "@/models/Admin"
import { checkAuth, checkNewPassPageUlr } from "@/lib/checkAuth"
import { ActionState } from "@/typeScriptType/form"
import { handleMongooseError } from "@/lib/mongo"
import jwt from "jsonwebtoken"
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND);

export const sendEmail = async (_prevState: ActionState, formData: FormData) => {
    const email = formData.get("email");
    try {
        const admin = await Admin.findOne({
            email
        });

        if (!admin) return { error: "Invalid email ", fieldData: [email] };

        const token = jwt.sign({ id: String(admin._id) }, process.env.JWT_SECRET_TWOFA!, { expiresIn: "5m" });
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [process.env.EMAIL!],
            subject: 'Árajánlat kérés:',
            html: `<div>Az új jelszó megadásához kattincs az alábbi linkre: https://${process.env.URL}/forgotpassword/${token}</div>`,
        })

        if (error) {
            console.error(error)
            return { error: 'Hiba, próbáld újra', fieldData: [email] };
        }

        return { message: "success" }
    } catch (error) {
        const err = await handleMongooseError(error)
        return { error: err, fieldData: [email] }
    }
}

export const changePassword = async (_prevState: ActionState, formData: FormData) => {
    const password = formData.get('password');
    const passwordConfirm = formData.get('passwordConfirm')
    try {
        const auth = await checkAuth()

        const url = formData.get("url") as string | undefined

        let userId: string;

        if (auth.error) {


            if (!url || url === "") return { error: "Kérlek jelentkezz be.", fieldData: [password, passwordConfirm] };

            const res = await checkNewPassPageUlr(url);

            if (res.error) { return { error: "Kérlek jelentkezz be.", fieldData: [password, passwordConfirm] }; }
            else {
                userId = res.res as string;
            }


        }
        else {
            userId = auth.success as string
        }



        const res = loginSchema.safeParse({
            password,
            passwordConfirm
        })

        if (res.error) {
            console.log(res.error.issues);
            return { failed: res.error.issues.map((item) => item.message), fieldData: [password, passwordConfirm] }
        }


        const admin = await Admin.findByIdAndUpdate(userId, {
            password
        })

        return { message: "Jelszó megváltozott" }
    } catch (error) {
        const err = await handleMongooseError(error)
        return { error: err, fieldData: [password, passwordConfirm] }
    }
}