import { generateSecret, generateURI } from "otplib";
import { connection } from 'next/server'
import qrcode from "qrcode"
import Image from "next/image";
import  Form  from "./form";

const Totp = async () => {
    await connection()
    const secret = generateSecret();

    // Generate a TOTP token
    const uri = generateURI({
        issuer: "MyService",
        label: "user@example.com",
        secret,
    });

    const data = await qrcode.toDataURL(uri);
    return (
        <div className="flex flex-col items-center gap-4">
            <h1>A totp beállításához olvasd be a qr kódot.</h1>
            <Image src={data} width={200} height={200} alt="qr-code" />
            <Form/>
        </div>
    )
}

export default Totp