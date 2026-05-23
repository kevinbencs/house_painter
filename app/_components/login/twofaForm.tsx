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
import { useActionState, useEffect } from "react"
import { useLogged } from "../loggedContext/isLoggedContext"


const TwoFAForm = () => {
    const [state, action, isPending] = useActionState(loginTwoFAAction, null);
    const { setLogged } = useLogged();
    const router = useRouter();
    useEffect(() => {
        if (state?.redirect) {
            if (state.redirect === "/dashboard") {
                setLogged(true);
            }
            router.push(state.redirect)
        }
    }, [state?.redirect])


    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>2fa bejelentkezés</CardTitle>
                <CardDescription>
                    Add meg a 2fa kódot
                </CardDescription>

            </CardHeader>
            <form action={action}>
                <CardContent>

                    {state?.error && <div className="mb-2 mt-2 text-red-600">{state.error}</div>}
                    {state?.failed && <div className="mb-2 mt-2 text-red-600">{state.failed.map((item) => <div key={item}>{item}</div>)}</div>}
                    <div className="flex flex-col gap-6">

                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="code">Kód</Label>
                            </div>
                            <Input id="code" type="password" required name="optName" disabled={isPending} />
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