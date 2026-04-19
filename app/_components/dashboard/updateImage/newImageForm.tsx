"use client"

import { useActionState } from "react"
import { addImage } from "@/action/addImage"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"


const NewImageForm = () => {
    const [state, action, isPending] = useActionState(addImage, null)
    return (
        <div className="flex justify-center w-full">
            <form action={action}>

                <Card size="sm" className="mx-auto w-full max-w-sm">
                    <CardHeader>
                        <CardTitle>Kép kiválasztása</CardTitle>
                        <CardDescription>
                            Válassz ki egy képet
                        </CardDescription>
                        {state?.error && <div className="mb-2 mt-2 text-red-600">{state.error}</div>}
                        {state?.message && <div className="mb-2 mt-2 text-green-600">{state?.message}</div>}
                    </CardHeader>
                    <CardContent>
                        <Label htmlFor="picture" className="mb-2">Kép</Label>
                        <Input id="picture" type="file" disabled={isPending}/>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" size="sm" className="w-full" disabled={isPending}>
                            Kép feltöltése
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>

    )
}

export default NewImageForm