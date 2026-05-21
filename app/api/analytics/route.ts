import { handleMongooseError } from "@/lib/mongo";
import PageView from "@/models/PageView";
import {PageViewSchema } from "@/schema/schema";
import{ NextResponse, type NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as {pathname: string, referrer: string | null};

        const res = await PageViewSchema.safeParse({
            pathname: body.pathname,
            referrer: body.referrer
        })

        if (res.error) {
            console.log(res.error.issues);
            return NextResponse.json({ failed: res.error.issues.map((item) => item.message) }, {status: 400})
        }

        const newPageView = new PageView({
            pathname: body.pathname,
            referrer: body.referrer
        })
        
        await newPageView.save();

        return NextResponse.json({ message: "success" }, {status: 200})

    } catch (error) {
        const err = await handleMongooseError(error);
        return NextResponse.json({ error: err }, {status: 500})
    }
}