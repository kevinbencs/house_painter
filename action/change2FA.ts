"use server"

import { ActionState } from "@/typeScriptType/form"
import { verify } from "otplib";
import Admin from "@/models/Admin";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"
import { Adm } from "@/typeScriptType/admin";
import { handleMongooseError } from "@/lib/mongo";
import { otpTokenSchema } from "@/schema/schema";

export const setNewTwoFA = async (_pervState: ActionState, formData: FormData) => {
    try {
        
        const cookieStore = await cookies();

        const logCookie = cookieStore.get("2fa")

        if (!logCookie) redirect('/login');

        const decoded = jwt.verify(logCookie.value, process.env.JWT_SECRET_URL!) as {id: string}

        const user = await Admin.findById(decoded.id) as Adm



        if (!user) redirect('/login')

        const token = formData.get('optName') as string;
        const secret = formData.get('secretName') as string

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

            await Admin.findByIdAndUpdate(decoded.id,{
                twofa: secret
            })

            cookieStore.delete("2fa")

            const tokenLongTime = jwt.sign({id: decoded.id}, process.env.JWT_SECRET_Long!, { expiresIn: "1h" });

            const tokenShortTime = jwt.sign({id: decoded.id}, process.env.JWT_SECRET_Short!, { expiresIn: "5m" });



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
        }

        return {error: "Hiba, próbáld újra."}
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
}