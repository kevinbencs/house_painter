import { handleMongooseError } from "@/lib/mongo";
import type{ NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as {pathname: string, ip: string};


    } catch (error) {
        const err = await handleMongooseError(error);
        return {error: err}
    }
}