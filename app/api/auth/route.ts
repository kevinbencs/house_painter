import { NextRequest, NextResponse } from "next/server";
import { handleMongooseError } from "@/lib/mongo";
import { checkAuth } from "@/lib/checkAuth";

export async function GET(req: NextRequest) {

    try {

        const auth = await checkAuth()

  if (auth.error) return NextResponse.json({ link: '' }, { status: 200 });

        return NextResponse.json({ link: '/dashboard' }, { status: 200 })
    } catch (error) {
        console.error(error)
        const err = await handleMongooseError(error);
        return NextResponse.json({ "error": err }, { status: 500 })
    }

}