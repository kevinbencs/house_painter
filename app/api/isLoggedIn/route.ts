import { checkAuth } from "@/lib/checkAuth";
import {  NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const auth = await checkAuth()

        if (auth.error) return NextResponse.json({ error: "Kérlek jelentkezz be." },{status: 401});

        return NextResponse.json({success: "Be vagy jelentkezve"}, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Server error"}, {status: 500})
    }
    
} 