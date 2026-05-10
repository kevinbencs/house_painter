import { NextRequest, NextResponse } from "next/server";
import Image from "@/models/Image";
import { handleMongooseError } from "@/lib/mongo";
import { Img } from "@/typeScriptType/img";


export async function GET(req: NextRequest, ctx: RouteContext<'/api/images/id/[id]'>) {

    try {

        const { id } = await ctx.params as {id: string}

        const img: Img | null = await Image.findById(id)

        if (img == null || !img) return NextResponse.json({ error: "Nincs ilyen kép" }, { status: 404 })

        return NextResponse.json({ success: img }, { status: 200 })
    } catch (error) {
        console.error(error)
        const err = await handleMongooseError(error);
        return NextResponse.json({ "error": err }, { status: 500 })
    }

}