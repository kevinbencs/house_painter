"use server"


import { verify } from "otplib";
import Admin from "@/models/Admin";
import { cookies } from "next/headers";
import { Adm } from "@/typeScriptType/admin";
import { handleMongooseError } from "@/lib/mongo";
import { otpTokenSchema } from "@/schema/schema";
import { decryptTwoFA, encryptJWT } from "@/lib/session";
import { redirect } from "next/navigation";

export const setNewTwoFA = async (otp: string, secret: string) => {
    const cookieStore = await cookies();

    const logCookie = cookieStore.get("2fa")

    if (!logCookie) redirect('/');

    let errR: string = ""

    try {

        const decoded = await decryptTwoFA(logCookie.value)

        const user = await Admin.findById(decoded?.id) as Adm

        if (!user) errR = '/'

        else {

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

                await Admin.findByIdAndUpdate(decoded?.id, {
                    twofa: secret
                })

                cookieStore.delete("2fa")

                const expires = new Date(Date.now() + 1000 * 60 * 60)
                const tokenJWT = await encryptJWT({ id: user._id, expiresAt: expires })

                cookieStore.set(tokenJWT, "AuthToken", {
                    httpOnly: true,
                    secure: true,
                    maxAge: 3600,
                })

            }
            else {
                return { error: "Hiba, próbáld újra." }
            }
        }

    } catch (error: any) {

        const err = await handleMongooseError(error)
        return { error: err }
    }

    if(errR !== "") redirect(errR)
    
    redirect('/dashboard')

}