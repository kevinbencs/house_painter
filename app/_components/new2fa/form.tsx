"use client"

import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { SyntheticEvent, useState, useTransition } from "react";
import { setNewTwoFA } from "@/action/change2FA";
import { useLogged } from "../loggedContext/isLoggedContext";
import { useRouter } from "next/router";


const Form = (props: {secret: string}) => {

    const { setLogged } = useLogged();
    const router = useRouter();
    const [error, setError] = useState<string>('');
    const [failed, setFailed] = useState<string[]>([]);
    const [ isPending, startTransition] = useTransition()
    const [otp, setOtp] = useState<string>("");


    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        startTransition(async() => {
            const res = await setNewTwoFA(otp, props.secret)

            if(res.error) setError(res.error);

            if(res.failed) setFailed(res.failed);

            if(res.redirect) {
                setLogged(true);
                router.push(res.redirect)
            }
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                {error && <div className="mb-2 mt-2 text-red-600">{error}</div>}
                {failed && <div className="mb-2 mt-2 text-red-600">{failed.map((item) => <div key={item}>{item}</div>)}</div>}
                <Label className="mb-2" htmlFor="otpId" >6 jegyű kód megadása</Label>

                <InputOTP id="otpId" name="optName" maxLength={6} pattern={REGEXP_ONLY_DIGITS} disabled={isPending} value={otp} onChange={(e) => setOtp(e)}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />

                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
            </div>
            <Button disabled={isPending}>Mentés</Button>
        </form>
    )
}

export default Form