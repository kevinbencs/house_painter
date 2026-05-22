"use server"

import { handleMongooseError } from "@/lib/mongo";
import Admin from "@/models/Admin";
import { loginSchema, otpTokenSchema2 } from "@/schema/schema";
import { Adm } from "@/typeScriptType/admin";
import { ActionState } from "@/typeScriptType/form";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verify } from "otplib";



export const loginAction = async (_prevState: ActionState, formData: FormData) => {
    let secret: string = "";
    try {
        const cookieStore = await cookies();

        const email = formData.get("email");
        const password = formData.get("password") as string;

        const res = loginSchema.safeParse({
            email,
            password
        });

        if (res.error) {
            console.log(res.error.issues);
            return { failed: res.error.issues.map((item) => item.message) }
        }

        const admin = await Admin.findOne({
            email
        });



        if (!admin) return { error: "Invalid email or password" };

        const passConfirm = await bcrypt.compare(password, admin.password)

        if (!passConfirm) return { error: "Invalid email or password" };

        secret = String(admin.twofa)

        const token2fa = jwt.sign({ id: String(admin._id) }, process.env.JWT_SECRET_TWOFA!, { expiresIn: "10m" });

        cookieStore.set("2fa", token2fa, {
            httpOnly: true,
            secure: true,
            maxAge: 600,
        })

    } catch (error) {

        const Error = await handleMongooseError(error)
        return { error: Error }
    }
    if (secret === "") redirect("/new2fa")
    redirect('/login/2fa')
}

export const loginTwoFAAction = async (_prevState: ActionState | { redirect: string }, formData: FormData) => {
    try {

        const cookieStore = await cookies();

        const logCookie = cookieStore.get("2fa")

        if (!logCookie) redirect('/login');

        const decoded = jwt.verify(logCookie.value, process.env.JWT_SECRET_URL!) as { id: string }

        const user = await Admin.findById(decoded.id) as Adm

        if (!user) redirect('/login')

        const token = formData.get('optName') as string;

        const valid = otpTokenSchema2.safeParse(token);

        if (valid.error) {
            console.log(valid.error.issues);
            return { failed: valid.error.issues.map((item) => item.message) }
        }

        const secret = user.twofa

        if (token === secret) {
            await Admin.findByIdAndUpdate(decoded.id, { twofa: "" })
            return { redirect: "/new2fa" }
        }

        const res = await verify({ secret, token });

        if (!res.valid) return { error: "Hiba, próbáld újra." }

        const tokenLongTime = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET_Long!, { expiresIn: "1h" });

        const tokenShortTime = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET_Short!, { expiresIn: "5m" });

        cookieStore.delete("2fa")

        cookieStore.set("longAuthToken", tokenLongTime, {
            httpOnly: true,
            secure: true,
            maxAge: 3600,
        })

        cookieStore.set("shortAuthToken", tokenShortTime, {
            httpOnly: true,
            secure: true,
            maxAge: 300,
        })



    } catch (error) {
        if (error.name === "TokenExpiredError") {
            console.error(error)
            redirect('/login')
        } else if (error.name === "JsonWebTokenError") {
            console.error(error)
            redirect('/login')
        } else if (error.name === "NotBeforeError") {
            console.error(error)
            redirect('/login')
        }

        const Error = await handleMongooseError(error)
        return { error: Error }
    }

    redirect('/dashboard')
}