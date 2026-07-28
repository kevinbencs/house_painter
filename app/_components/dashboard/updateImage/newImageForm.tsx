"use client"

import { DragEvent, useActionState, useEffect, useRef, useState } from "react"
import { AddImage } from "@/action/addImage"
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
    const [state, action, isPending] = useActionState(AddImage, null)
    const inputRef = useRef<null | HTMLInputElement>(null)
    const [file, setFile] = useState<null | File>(null)

    const handleFile = (e: DragEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const files = e.dataTransfer.files;
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(files[0])
        if(inputRef.current && inputRef.current.files) inputRef.current.files = dataTransfer.files
        setFile(files[0])
    }

    useEffect(() => {
        setFile(null)
    },[state])

    const handleDragOver = (e: DragEvent<HTMLButtonElement>) => {
        e.preventDefault()
    }

    return (
        <div className="flex justify-center w-full">
            <form action={action} className="w-full">

                <Card size="sm" className="mx-auto w-full max-w-125">
                    <CardHeader className="mb-5">
                        <CardTitle>Kép kiválasztása</CardTitle>
                        <CardDescription>
                            Válassz ki egy képet
                        </CardDescription>
                        {state?.error && <div className="mb-2 mt-2 text-red-600">{state.error}</div>}
                        {state?.failed && state.failed.map((item) => <div key={item[8]} className="mb-2 mt-2 text-red-600">{item}</div>)}
                        {state?.message && <div className="mb-2 mt-2 text-green-600">{state?.message}</div>}
                    </CardHeader>
                    <CardContent>
                        <div className="mb-5">
                            <Label htmlFor="picture" className="mb-2">Kép</Label>
                            <button onClick={(e) => { e.preventDefault(); inputRef.current?.click() }} onDragOver={handleDragOver} className="w-full h-56 text-white bg-black flex justify-center items-center rounded-lg font-bold cursor-pointer" onDrop={handleFile}>
                                {file ? (
                                    <p>Kiválasztva: {file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
                                ) : (
                                    <p>Válassz ki egy képet</p>
                                )}
                                
                            </button>
                            <input id="picture" name="image" type="file" accept="image/*" disabled={isPending} required className="hidden" ref={inputRef} />

                        </div>
                        <div className="mb-5">
                            <Label htmlFor="picture-url" className="mb-2">Kép url-je</Label>
                            <Input id="picture-url" name="image-url" type="text" disabled={isPending} required defaultValue={state && state.fieldData && typeof state.fieldData[2] === 'string'
                                ? state.fieldData[2]
                                : ''} />
                        </div>
                        <div>
                            <Label htmlFor="picture-alt" className="mb-2">Kép leírása</Label>
                            <Input id="picture-alt" name="image-alt" type="text" disabled={isPending} required defaultValue={state && state.fieldData && typeof state.fieldData[1] === 'string'
                                ? state.fieldData[1]
                                : ''} />
                        </div>

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