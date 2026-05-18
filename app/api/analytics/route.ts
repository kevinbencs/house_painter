import { handleMongooseError } from "@/lib/mongo";
import type{ NextRequest } from "next/server";



export async function POST(req: NextRequest) {
    try {
        
    } catch (error) {
        const err = await handleMongooseError(error);
        return {error: err}
    }
}