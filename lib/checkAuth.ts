import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import Admin from "@/models/Admin";
import { handleMongooseError } from "./mongo";

export const checkAuth = async () => {

    const cookie = await cookies();

    const token = cookie.get("AuthToken");


    if (token) {
        const resLong = await checkJWT(token.value, process.env.JWT_SECRET_Long!)

        if (resLong.res) {

            

            return { success: resLong.res };
        }

        if (resLong.error) return { error: resLong.error }
    }

    return { error: " Error" }

}



export const checkNewPassPageUlr = async (url: string) => {

    const res = await checkJWT(url, process.env.JWT_SECRET_URL!)

    if (res.error) return { error: res.error }

    return { res: res.res }

}


export const checkTwoFAToken = async () => {


    const cookie = await cookies();

    const token2fa = cookie.get("2fa");

    if (!token2fa || !token2fa.value) return { error: "There is no token" }

    const res = await checkJWT(token2fa.value, process.env.JWT_SECRET_TWOFA!)

    if (res.res) return { res: res.res, twofa: res.twofa };

    return { error: " Error" }

}



const checkJWT = async (token: string, secret: string) => {
    try {
        const res = jwt.verify(token, secret) as { id: string }

        const user = await Admin.findById(res.id)

        if (!user) return { error: "There is no admin with this id" }

        return { res: res.id, twofa: user.twofa}

    } catch (error: any) {
        console.log(error)
        if (error.name === "TokenExpiredError") {
            return { error: 'JWT error' };
        } else if (error.name === "JsonWebTokenError") {
            return { error: 'JWT error' };
        } else if (error.name === "NotBeforeError") {
            return { error: 'JWT error' };
        }

        const err = await handleMongooseError(error)
        return { error: err }
    }
}


const checkJWTAccess = async (token: string, secret: string) => {
    try {
        const res = jwt.verify(token, secret) as { id: string }

        return { res: res.id}

    } catch (error: any) {
        console.log(error)
        if (error.name === "TokenExpiredError") {
            return { error: 'JWT error' };
        } else if (error.name === "JsonWebTokenError") {
            return { error: 'JWT error' };
        } else if (error.name === "NotBeforeError") {
            return { error: 'JWT error' };
        }

        const err = await handleMongooseError(error)
        return { error: err }
    }
}