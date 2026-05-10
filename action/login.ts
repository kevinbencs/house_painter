"use server"

import Admin from "@/models/Admin";
import { loginSchema } from "@/schema/schema";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type ActionState = { message: string } | { error: string } | null

export const loginAction = async (_prevState: ActionState, formData: FormData) => {
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

        const passConfirm = await bcrypt.compare(admin.password, password)

        if (!passConfirm) return { error: "Invalid email or password" };

        const tokenShortTime = jwt.sign(admin._id, process.env.JWT_SECRET_URL!, { expiresIn: "5m" });

        cookieStore.set(tokenShortTime, "2fa", {
            httpOnly: true,
            secure: true,
            maxAge: 300,
        })

        redirect('/login/2fa')
    } catch (error) {
        console.error(error)
        return { error: "Failed login" }
    }
}

export const loginTwoFAAction = async (_prevState: ActionState, formData: FormData) => {
    try {

        const cookieStore = await cookies();

        const logCookie = await cookieStore.get("2fa")

        if (!logCookie) redirect('/login');

        const decoded = jwt.verify(logCookie.value, process.env.JWT_SECRET_URL!)

        const user = await Admin.findById(decoded)

        if (!user) redirect('/login')

            

        const tokenLongTime = jwt.sign(decoded, process.env.JWT_SECRET_Long!, { expiresIn: "1h" });

        const tokenShortTime = jwt.sign(decoded, process.env.JWT_SECRET_Short!, { expiresIn: "5m" });



        cookieStore.set(tokenLongTime, "longAuthToken", {
            httpOnly: true,
            secure: true,
            maxAge: 3600,
        })

        cookieStore.set(tokenShortTime, "shortAuthToken", {
            httpOnly: true,
            secure: true,
            maxAge: 300,
        })
        redirect('/dashboard')
    } catch (error) {
        console.error(error)

        if (error.name === "TokenExpiredError") {
            redirect('/login')
        } else if (error.name === "JsonWebTokenError") {
            redirect('/login')
        } else if (error.name === "NotBeforeError") {
            redirect('/login')
        }
        return { error: "Hiba, próbáld újra" }
    }
}