"use client"
import { loginTwoFAAction } from "@/action/login"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { SyntheticEvent,useState, useTransition } from "react"
import { useLogged } from "../loggedContext/isLoggedContext"


const TwoFAForm = () => {
    const [ isPending, startTransition] = useTransition()
    const [otp, setOtp] = useState<string>("")
    const { setLogged } = useLogged();
    const router = useRouter();
    const [error, setError] = useState<string>('')
    const [failed, setFailed] = useState<string[]>([])

   

    const submit = async(e: SyntheticEvent) => {
        e.preventDefault();

        startTransition(async() => {
            const res = await loginTwoFAAction(otp)

            if(res.error) setError(res.error);

            if(res.failed) setFailed(res.failed);

            if(res.redirect) {
                setLogged(true);
                router.push(res.redirect)
            }
        })
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>2fa bejelentkezés</CardTitle>
                <CardDescription>
                    Add meg a 2fa kódot
                </CardDescription>

            </CardHeader>
            <form onSubmit={submit}>
                <CardContent>

                    {error !== "" && <div className="mb-2 mt-2 text-red-600">{error}</div>}
                    {failed.length !== 0 && <div className="mb-2 mt-2 text-red-600">{failed.map((item) => <div key={item}>{item}</div>)}</div>}
                    <div className="flex flex-col gap-6">

                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="code">Kód</Label>
                            </div>
                            <Input id="code" type="password" required name="otpName" disabled={isPending} value={otp} onChange={(e) => setOtp(e.target.value)}/>
                        </div>
                    </div>

                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full" disabled={isPending}>
                        Belépés
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

export default TwoFAForm 