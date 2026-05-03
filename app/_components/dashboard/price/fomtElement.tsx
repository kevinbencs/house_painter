"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addPrice } from "@/action/addPrice"

const FormElement = () => {

    const [state, action, isPending] = useActionState(addPrice, null)

    return (
        <div className='flex justify-center'>
            <form action={action}  className="w-full max-w-sm" >
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle>Új ár hozzáadása</CardTitle>
                    </CardHeader>
                    <CardContent>

                        {state?.error && <div className="mb-2 mt-2 text-red-600">{state.error}</div>}
                        {state?.message && <div className="mb-2 mt-2 text-green-600">{state?.message}</div>}
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="category">Kategória</Label>
                                <Input
                                    id="category"
                                    name="category"
                                    type="text"
                                    placeholder="Pl: festés"
                                    required
                                    disabled={isPending}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="name">Név</Label>
                                </div>
                                <Input id="name" type="text" name="name" required disabled={isPending} />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="price">Ár</Label>
                                </div>
                                <Input id="price" name="price" type="number" required disabled={isPending} />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="unitOfMea">Mértékegység</Label>
                                </div>
                                <Input id="unitOfMea" name="unitOfMea" type="text" required disabled={isPending} />
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button type="submit" className="w-full" disabled={isPending}>
                            Mentés
                        </Button>

                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}

export default FormElement