import { handleMongooseError } from "@/lib/mongo";
import PageView from "@/models/PageView";
import {PageViewSchema } from "@/schema/schema";
import type{ NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as {pathname: string, referrer: string | null};

        const res = await PageViewSchema.safeParse({
            pathname: body.pathname,
            referrer: body.referrer
        })

        if (res.error) {
            console.log(res.error.issues);
            return { failed: res.error.issues.map((item) => item.message) }
        }

        const newPageView = new PageView({
            pathname: body.pathname,
            referrer: body.referrer
        })
        
        await newPageView.save();

        return {message: "success"}


    } catch (error) {
        const err = await handleMongooseError(error);
        return {error: err}
    }
}