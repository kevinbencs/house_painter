import { NextRequest, NextResponse } from "next/server";
import Image from "@/models/Image";


type ImageModel = {
  blobUrl: string,
  newUrl: string,
  detail: string,
  show: boolean,
  _id: string
}

export async function GET(req: NextRequest) {

    try {
        const imgs: ImageModel[] = await Image.find() 


        return NextResponse.json({success: imgs}, {status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({ "error": "Server error." }, {status: 500})
    }
    
}