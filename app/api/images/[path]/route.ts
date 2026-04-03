import { NextRequest, NextResponse } from "next/server";
import { get } from '@vercel/blob';


export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string }> }) {
  try {

    const { path } = await params;

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ "error": "BLOB_READ_WRITE_TOKEN is missed." });
    }

    const result = await get(path,
      {
        access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN
      });

    if (result?.statusCode !== 200) {
      return NextResponse.json( {error: 'Not found'}, { status: 404 });
    }

    return new NextResponse(result.stream, {
      headers: {
        'Content-Type': result.blob.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })


  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Server error" }, {status: 500});
  }
}


