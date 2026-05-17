import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers';
import jwt from "jsonwebtoken"

export const middleware = async (req: NextRequest) => {

    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith('/dashboard')) {

        try {
            const cookie = await cookies();

            const longToken = cookie.get("longAuthToken")

            if (!longToken || !longToken.value) {
                console.log("Session error on dashboard");
                return NextResponse.redirect(new URL('/', req.url))
            }

            const res = jwt.verify(longToken.value, process.env.JWT_SECRET_Long!)

        } catch (error) {
            console.log("Session error on dashboard");
            if (error.name === "TokenExpiredError") {
                return NextResponse.redirect(new URL('/', req.url))
            } else if (error.name === "JsonWebTokenError") {
                return NextResponse.redirect(new URL('/', req.url))
            } else if (error.name === "NotBeforeError") {
                return NextResponse.redirect(new URL('/', req.url))
            }
        }

    }


}