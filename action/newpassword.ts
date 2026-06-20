"use server"

import { loginSchema } from "@/schema/schema"
import Admin from "@/models/Admin"
import { checkAuth, checkNewPassPageUlr } from "@/lib/checkAuth"
import { ActionState } from "@/typeScriptType/form"
import { handleMongooseError } from "@/lib/mongo"

export const sendEmail = async (_prevState: ActionState, formData: FormData) => {
    try {
        return { message: "success" }
    } catch (error) {
        console.error(error)
        return { error: "Failed login", fieldData:[''] }
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
        const Error = await handleMongooseError(error)
        return { error: Error, fieldData: [password, passwordConfirm] }
    }
}