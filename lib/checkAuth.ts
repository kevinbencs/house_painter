import { cookies } from "next/headers"
import Admin from "@/models/Admin";
import { decrypt, decryptTwoFA, decryptURL } from "./session";

export const checkAuth = async () => {

    const cookie = await cookies();

    const token = cookie.get("AuthToken");


    if (token) {
        const res = await decrypt(token.value,)


        if (res?.id) return { res: res.id }

        return { error: 'Error' }
    }

    return { error: " Error" }

}



export const checkNewPassPageUlr = async (url: string) => {

    const res = await decryptURL(url)

    if (res?.id) return { res: res.id}

    return { error: 'Error'}

}


export const checkTwoFAToken = async () => {


    const cookie = await cookies();

    const token2fa = cookie.get("2fa");

    if (!token2fa || !token2fa.value) return { error: "There is no token" }

    const res = await decryptTwoFA(token2fa.value)

    if (res && res.id) {
        const user = await Admin.findById(res.id)
        if (!user) return { error: "There is no admin with this id" }

        return { res: res.id, twofa: user.twofa }
    }

    return { error: " Error" }

}


