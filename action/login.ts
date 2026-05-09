"use server"

import Admin from "@/models/Admin";
import { loginSchema } from "@/schema/schema";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";

type ActionState = { message: string } | { error: string } | null

export const loginAction = async (_prevState: ActionState, formData: FormData) => {
    try {
        const email = formData.get("email");
        const password= formData.get("password") as string;

        const res = loginSchema.safeParse({
            email,
            password
        });

        if(res.error){
            console.log(res.error.issues);
            return {failed: res.error.issues.map((item) => item.message)}
        }

        const admin = await Admin.findOne({
            email
        });

        if (!admin) return {error: "Invalid email or password"};

        const passConfirm = await bcrypt.compare(admin.password, password)

        if (!passConfirm) return {error: "Invalid email or password"};

        if(!process.env.JWT_SECRET_Long) return {error: "JWT_SECRET_Long is missing."};
        if(!process.env.JWT_SECRET_Short) return {error: "JWT_SECRET_Short is missing."};

        const tokenLongTime = jwt.sign(admin._id, process.env.JWT_SECRET_Long ,{expiresIn: "1h"});

        const tokenShortTime = jwt.sign(admin._id, process.env.JWT_SECRET_Short,{expiresIn: "5m"});

        const cookieStore = await cookies();

        cookieStore.set(tokenLongTime, "longAuthToken",{
            httpOnly: true,
            secure: true,
            maxAge: 3600,
        })

        cookieStore.set(tokenShortTime, "shortAuthToken",{
            httpOnly: true,
            secure: true,
            maxAge: 300,
        })

        return {message: "success"}
    } catch (error) {
        console.error(error)
        return {error: "Failed login"}
    }
}

export const loginTwoFAAction = async (_prevState: ActionState, formData: FormData) => {
    try {
        return {message: "success"}
    } catch (error) {
        console.error(error)
        return {error: "Failed login"}
    }
}