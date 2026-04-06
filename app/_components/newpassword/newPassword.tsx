"use client"

import { changePassword} from "@/action/newpassword"
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

const NewPassword = () => {
    const [state, action, isPending] = useActionState(changePassword, null)
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Jelszó megváltoztatása</CardTitle>
                <CardDescription>
                    Add meg az új jelszót
                </CardDescription>

            </CardHeader>
            <CardContent>
                <form action={action}>
                    <div className="flex flex-col gap-6">

                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Jelszó</Label>
                            </div>
                            <Input id="password" type="password" required disabled={isPending} />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password_confirm">Jelszó megerősítése</Label>
                            </div>
                            <Input id="password_confirm" type="password" required disabled={isPending} />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full" disabled={isPending}>
                    Jelszó megváltoztatása
                </Button>
            </CardFooter>
        </Card>
    )
}

export default NewPassword