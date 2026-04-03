import { NextRequest, NextResponse } from "next/server";


export async function Get(req: NextRequest, res: NextResponse) {
    return NextResponse.json({"kee":"dwe"})
} 