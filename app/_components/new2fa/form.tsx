"use client"

import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { REGEXP_ONLY_DIGITS } from "input-otp"


const Form = () => {
    return (
        <form action="">
            <div className="mb-4">
                <Label className="mb-2" htmlFor="otpId" >6 jegyű kód megadása</Label>

                <InputOTP id="otpId" name="optName" maxLength={6} pattern={REGEXP_ONLY_DIGITS} >
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
            <Button>Mentés</Button>
        </form>
    )
}

export default Form