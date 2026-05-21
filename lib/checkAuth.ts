import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import Admin from "@/models/Admin";

export const checkAuth = async () => {
    try {
        const cookie = await cookies();

        const tokenShortTime = cookie.get("shortAuthToken");

        const tokenLongTime = cookie.get("longAuthToken");

        if (!tokenShortTime && !tokenLongTime) return { error: "There is no token" }

        if (tokenShortTime) {
            const resShort = await checkJWT(tokenShortTime.value, process.env.JWT_SECRET_Short!)

            if (resShort.res) return { res: resShort };

            if (resShort.error) {
                if (tokenLongTime) {
                    const resLong = await checkJWT(tokenLongTime.value, process.env.JWT_SECRET_Long!)

                    if (resLong.error) return { error: resLong.error };

                    if (resLong.res) {

                        const tokenShortTime = jwt.sign(resLong.res, process.env.JWT_SECRET_Short!, { expiresIn: "5m" });

                        cookie.set(tokenShortTime, "shortAuthToken", {
                            httpOnly: true,
                            secure: true,
                            maxAge: 300,
                        })


                        return { res: resLong.res };
                    }

                }
                else return { error: resShort.error };

            }

        }

        if (tokenLongTime) {
            const resLong = await checkJWT(tokenLongTime.value, process.env.JWT_SECRET_Long!)

            if (resLong.res) {

                const tokenShortTime = jwt.sign(resLong.res, process.env.JWT_SECRET_Short!, { expiresIn: "5m" });

                cookie.set(tokenShortTime, "shortAuthToken", {
                    httpOnly: true,
                    secure: true,
                    maxAge: 300,
                })


                return { success: resLong.res };
            }

            if (resLong.error) return { error: resLong.error }
        }

        return { error: " Error" }

    } catch (error) {
        console.log(error)

        return { error: "Server error" }
    }
}



export const checkNewPassPageUlr = async (url: string) => {
    try {
        const res = await checkJWT(url, process.env.JWT_SECRET_URL!)

        if (res.error) return { error: res.error }

        return { res: res.res }
    } catch (error) {
        console.log(error)

        return { error: "Server error" }
    }
}


export const checkTwoFAToken = async () => {
    try {

        const cookie = await cookies();

        const token2fa= cookie.get("2fa");

        if (!token2fa) return { error: "There is no token" }

        const res= await checkJWT(token2fa.value, process.env.JWT_SECRET_TWOFA!)

        if (res.res) return { res: res };

        return { error: " Error" }
    } catch (error) {
        console.log(error)

        return { error: "Server error" }
    }
}



const checkJWT = async (token: string, secret: string) => {
    try {
        const res = jwt.verify(token, secret) as {id: string}

        const user = await Admin.findById(res.id)

        if (!user) return { error: "There is no admin with this id" }

        return { res: res.id }

    } catch (error) {
        console.log(error)
        if (error.name === "TokenExpiredError") {
            return { error: 'JWT error' };
        } else if (error.name === "JsonWebTokenError") {
            return { error: 'JWT error' };
        } else if (error.name === "NotBeforeError") {
            return { error: 'JWT error' };
        }

        return { error: 'Server error' }
    }
}