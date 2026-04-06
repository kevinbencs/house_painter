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
import { useActionState } from "react"


const TwoFAForm = () => {
    const [state, action, isPending] = useActionState(loginTwoFAAction, null)
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>2fa bejelentkezés</CardTitle>
                <CardDescription>
                    Add meg a 2fa kódot
                </CardDescription>

            </CardHeader>
            <CardContent>
                <form action={action}>
                    <div className="flex flex-col gap-6">

                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="code">Kód</Label>
                            </div>
                            <Input id="code" type="password" required disabled={isPending} />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full" disabled={isPending}>
                    Belépés
                </Button>
            </CardFooter>
        </Card>
    )
}

export default TwoFAForm 