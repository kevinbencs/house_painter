import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import Admin from "@/models/Admin";

export const checkAuth = async () => {
    try {
        const cookie = await cookies();

        const tokenShortTime = cookie.get("shortAuthToken");

        const tokenLongTime = cookie.get("longAuthToken");

        if (!tokenShortTime && !tokenLongTime) return "error"

        if (tokenShortTime) {
            const resShort = await checkJWT(tokenShortTime.value, process.env.JWT_SECRET_Short!)

            if (resShort.message) return "success";

            if (resShort.error) {
                if (tokenLongTime) {
                    const resLong = await checkJWT(tokenLongTime.value, process.env.JWT_SECRET_Long!)

                    if (resLong.error) return "error";

                    if (resLong.message) {

                        const tokenShortTime = jwt.sign(resLong.message, process.env.JWT_SECRET_Short!, { expiresIn: "5m" });

                        cookie.set(tokenShortTime, "shortAuthToken", {
                            httpOnly: true,
                            secure: true,
                            maxAge: 300,
                        })


                        return "success";
                    }

                }
                else return "error";

            }

        }

        if (tokenLongTime) {
            const resLong = await checkJWT(tokenLongTime.value, process.env.JWT_SECRET_Long!)

            if (resLong.message) {

                const tokenShortTime = jwt.sign(resLong.message, process.env.JWT_SECRET_Short!, { expiresIn: "5m" });

                cookie.set(tokenShortTime, "shortAuthToken", {
                    httpOnly: true,
                    secure: true,
                    maxAge: 300,
                })


                return "success";
            }

            if (resLong.error) return "error"
        }

        return "error";

    } catch (error) {
        console.log(error)

        return "error"
    }
}



export const checkNewPassPageUlr = async (url: string) => {
    try {
        const res = await checkJWT(url, process.env.JWT_SECRET_URL!)

        if(res.error) return "error";

        return "success"
    } catch (error) {
        console.log(error)

        return "error"
    }
}



const checkJWT = async (token: string, secret: string) => {
    try {
        const short = jwt.verify(token, secret)

        const user = await Admin.findById(short)

        if (!user) return { error: "No admin" }

        return { message: short }

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