"use server"

import { ActionState } from "@/typeScriptType/form"
import { verify } from "otplib";
import Admin from "@/models/Admin";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"
import { Adm } from "@/typeScriptType/admin";
import { handleMongooseError } from "@/lib/mongo";
import { otpTokenSchema } from "@/schema/schema";

export const setNewTwoFA = async ( otp: string, secret: string) => {
    try {

        const cookieStore = await cookies();

        const logCookie = cookieStore.get("2fa")

        if (!logCookie) return { redirect: '/login' };

        const decoded = jwt.verify(logCookie.value, process.env.JWT_SECRET_URL!) as { id: string }

        const user = await Admin.findById(decoded.id) as Adm



        if (!user) return { redirect: '/login' }

        const token = otp;

        const valid = otpTokenSchema.safeParse({
            otpCode: token,
            secret: secret
        });

        if (valid.error) {
            console.log(valid.error.issues);
            return { failed: valid.error.issues.map((item) => item.message) }
        }

        const res = await verify({ secret, token });

        if (res.valid) {

            await Admin.findByIdAndUpdate(decoded.id, {
                twofa: secret
            })

            cookieStore.delete("2fa")

            const tokenLongTime = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET_Long!, { expiresIn: "1h" });

            const tokenShortTime = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET_Short!, { expiresIn: "5m" });



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

            return { redirect: '/dashboard' };

        }
        else {
            return { error: "Hiba, próbáld újra." }
        }


    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            console.error(error)
            return { redirect: '/login' }
        } else if (error.name === "JsonWebTokenError") {
            console.error(error)
            return { redirect: '/login' }
        } else if (error.name === "NotBeforeError") {
            console.error(error)
            return { redirect: '/login' }
        }

        const Error = await handleMongooseError(error)
        return { error: Error }
    }

}