import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const middleware = async (req: NextRequest) => {
    const pathname = req.nextUrl.pathname;

    const resAuth = await fetch('/api/isLoggedIn');

    

    if(pathname.startsWith('/dashboard') && resAuth.status !== 200) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    //return NextResponse.redirect(new URL('/', req.url))
}