"use client"
import { loginAction } from "@/action/login"
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
import Link from "next/link"
import { useActionState } from "react"


const Form = () => {
    const [state, action, isPending] = useActionState(loginAction, null)
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Bejelentkezés</CardTitle>
                <CardDescription>
                    Jelszó és email megadásával lépj be a fiókodba
                </CardDescription>

            </CardHeader>
            <CardContent>
                <form action={action}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                disabled={isPending}
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Jelszó</Label>
                                <Link
                                    href="/forgotpassword"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                >
                                    Elfelejtetted a jelszód?
                                </Link>
                            </div>
                            <Input id="password" type="password" required disabled={isPending} />
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

export default Form