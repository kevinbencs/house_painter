import { NextRequest, NextResponse } from "next/server";


interface imageUrl {
    url: string,
    alt: string,
    detail: string,
    _id: string
}

export async function GET(req: NextRequest) {

    try {
        return NextResponse.json({success: []}, {status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({ "error": "Server error." }, {status: 500})
    }
    
}