"use client"

import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useActionState } from "react";
import { setNewTwoFA } from "@/action/change2FA";
import { Input } from "@/components/ui/input";


const Form = (props: {secret: string}) => {
    const [state, action, isPending] =useActionState(setNewTwoFA,null)


    return (
        <form action={action}>
            <div className="mb-4">
                {state?.error && <div className="mb-2 mt-2 text-red-600">{state.error}</div>}
                {state?.failed && <div className="mb-2 mt-2 text-red-600">{state.failed.map((item) => <div key={item}>{item}</div>)}</div>}
                <Label className="mb-2" htmlFor="otpId" >6 jegyű kód megadása</Label>

                <InputOTP id="otpId" name="optName" maxLength={6} pattern={REGEXP_ONLY_DIGITS} disabled={isPending}>
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
                <Input value={props.secret} readOnly type="password" className="hidden" name="secretName"/>
            </div>
            <Button disabled={isPending}>Mentés</Button>
        </form>
    )
}

export default Form