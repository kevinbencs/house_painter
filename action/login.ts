"use server"

import { handleMongooseError } from "@/lib/mongo";
import { ipLimiter } from "@/lib/rateLimit";
import { decryptTwoFA, encryptTwoFA } from "@/lib/session";
import Admin from "@/models/Admin";
import { loginSchema, otpTokenSchema2 } from "@/schema/schema";
import { Adm } from "@/typeScriptType/admin";
import { ActionState } from "@/typeScriptType/form";
import bcrypt from "bcrypt"
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { verify } from "otplib";



export const loginAction = async (_prevState: ActionState, formData: FormData) => {
    let secret: string = "";
    const email = formData.get("email");
    const password = formData.get("password");
    try {
        const cookieStore = await cookies();
        const header = await headers()

        const ip = header.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            header.get("x-real-ip") ||
            "unknown"

        try {

            await ipLimiter.consume(ip)


        } catch (error) {
            return ({ error: 'Too many login attempts', fieldData: [email, password] });
        }

        const res = loginSchema.safeParse({
            email,
            password
        });

        if (res.error) {
            console.log(res.error.issues);
            return { failed: res.error.issues.map((item) => item.message), fieldData: [email, password] }
        }

        const admin = await Admin.findOne({
            email
        });

        if (!admin) return { error: "Invalid email or password", fieldData: [email, password] };

        const passConfirm = await bcrypt.compare(String(password), admin.password)

        if (!passConfirm) return { error: "Invalid email or password", fieldData: [email, password] };

        secret = admin.twofa

        const expires = new Date(Date.now() + 1000 * 60 * 10)

        const token2fa = await encryptTwoFA({ id: String(admin._id), expiresAt: expires })

        cookieStore.set("2fa", token2fa, {
            httpOnly: true,
            secure: true,
            maxAge: 600,
            sameSite: 'lax',
            path: '/',
        })

    } catch (error) {
        const err = await handleMongooseError(error)
        return { error: err, fieldData: [email, password] }
    }
    if (!secret) redirect("/new2fa")
    redirect('/login/2fa')
}

export const loginTwoFAAction = async (_prevState: ActionState, formData: FormData) => {
    const cookieStore = await cookies();

    const logCookie = cookieStore.get("2fa")

    if (!logCookie) redirect('/');

    const otp = formData.get('optName')

    let errR: string = "";

    try {


        const decoded = await decryptTwoFA(logCookie.value)

        const user = await Admin.findById(decoded?.id) as Adm
        const token = String(otp)

        if (!user) errR = "/";


        else {
            const valid = otpTokenSchema2.safeParse(otp);

            if (valid.error) {
                console.log(valid.error.issues);
                return { failed: valid.error.issues.map((item) => item.message), fieldData: [otp] }
            }

            const secret = user.twofa

            if (otp === secret) {
                await Admin.findByIdAndUpdate(decoded?.id, { twofa: "" })
                errR = "/new2fa"
            }

            const res = await verify({ secret, token });

            if (!res.valid) return { error: "Hiba, próbáld újra.", fieldData: [otp]  }

            const expires = new Date(Date.now() + 1000 * 60 * 60)

            const jwtToken = await encryptTwoFA({ id: String(user._id), expiresAt: expires })

            cookieStore.delete("2fa")

            cookieStore.set("AuthToken", jwtToken, {
                httpOnly: true,
                secure: true,
                maxAge: 3600,
                sameSite: 'lax',
                path: '/',
            })

        }




    } catch (error: any) {
        const err = await handleMongooseError(error)
        return { error: err , fieldData: [otp] }
    }
    if (errR) redirect(errR)
    redirect('/dashboard')

}
