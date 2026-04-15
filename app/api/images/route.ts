import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";


export async function POST(req: NextRequest) {
    try {

        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            return NextResponse.json({ "error": "BLOB_READ_WRITE_TOKEN is missed." });
        }

        const form = await req.formData();
        const file = form.get('file') as File;

        const blob = await put(file.name, file, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN
        });

        return NextResponse.json(blob);
    } catch (error) {
        console.log(error)

        return NextResponse.json({ "error": "Server error." }, {status: 500})
    }
}