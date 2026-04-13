"use client"

import { sendEmail } from "@/action/newpassword"
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

const EmailForm = () => {
    const [state, action, isPending] = useActionState(sendEmail, null)
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Elfelejtett jelszó</CardTitle>
                <CardDescription>
                    Add meg az email címed
                </CardDescription>

            </CardHeader>
            <CardContent>
                <form action={action}>
                    <div className="flex flex-col gap-6">

                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="code">Email</Label>
                            </div>
                            <Input id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                disabled={isPending} />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full" disabled={isPending}>
                    Küld
                </Button>
            </CardFooter>
        </Card>
    )
}

export default EmailForm