import type { NextRequest, NextFetchEvent } from 'next/server'
import { NextResponse } from 'next/server'
import { checkAuth, checkTwoFATokenProxy } from './checkAuth';



export const middleware = async (req: NextRequest, event: NextFetchEvent) => {

    const pathname = req.nextUrl.pathname;

    const origin = req.nextUrl.origin

    const authRes = await checkAuth()
    const twofaRes = await checkTwoFATokenProxy()

    event.waitUntil(
        fetch(`${origin}/api/analytics`, {
            method: 'POST',
            body: JSON.stringify({ pathname, referrer: null }),
        })
    )


    if (pathname.startsWith('/dashboard')) {

        if (authRes.error) {
            console.log("Session error on dashboard");
            return NextResponse.redirect(new URL('/', req.url))
        }

    }

    if (pathname === "/new2fa" || pathname === "/login/2fa") {
        
            if (!twofaRes.res) {
            console.log("Session error on dashboard");
            return NextResponse.redirect(new URL('/', req.url))
        }
        
    }


    return NextResponse.next()


}