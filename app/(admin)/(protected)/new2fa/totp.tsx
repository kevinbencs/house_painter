import { generateSecret, generate, verify, generateURI } from "otplib";
import { connection } from 'next/server'
import qrcode from "qrcode"



const Totp = async () => {
    await connection()
    const secret = generateSecret();

    // Generate a TOTP token
    const uri = generateURI({
        issuer: "MyService",
        label: "user@example.com",
        secret,
    });
    return (
        <div className="text-xs w-20">
            {qrcode.toString(uri)}
        </div>
    )
}

export default Totp