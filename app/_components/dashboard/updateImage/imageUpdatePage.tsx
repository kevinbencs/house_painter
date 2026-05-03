"use client"

import Image from "next/image"
import { ChangeEvent, useActionState, useState } from "react"
import { IoCloseSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateImage } from "@/action/updateImage";
import { Checkbox } from "@/components/ui/checkbox"
import { deleteImage } from "@/action/deleteImage";


interface Img {
    _id: string,
    newUrl: string,
    detail: string,
    show: boolean
}

const ImageUpdatePage = (props: { img: Img[] }) => {
    const [lightBox, setLightBox] = useState<Img>({ newUrl: "", detail: '', _id: "", show: true })
    const [state, action, isPending] = useActionState(updateImage, null)
    const [err, setErr] = useState<string>('')
    const [mess, setMess] = useState<string>('')

    const clickOnImage = async (newUrl: string, detail: string, _id: string, show: boolean) => {
        setLightBox({ newUrl, detail, _id, show });
        document.body.style.overflow = "hidden"
    }


    const closeLightBox = async () => {
        setLightBox({ newUrl: "", detail: "", _id: "", show: true });
        document.body.style.overflow = ""
    }

    const inputChangeHandle = async (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'show') {
            setLightBox({ ...lightBox, show: !lightBox.show });
        }
        else {
            setLightBox({ ...lightBox, [name]: value });
        }
    }


    const deleteImg = async () => {
        try {
            const res = await deleteImage(lightBox._id)

            if (res.error) {
                console.log(res.error);
                setErr("Hiba: " + res.error)
                setTimeout(() => {
                    setErr('')
                }, 5000)
            }

            if (res.message) {
                setMess(res.message)
                setTimeout(() => {
                    setMess('')
                }, 5000)
                props.img = props.img.filter((item) => item._id !== lightBox._id)
                setLightBox({ newUrl: "", detail: '', _id: "", show: true })
            }


        } catch (error) {
            console.log(error);
            setErr("Hiba: próbáld újra")
            setTimeout(() => {
                setErr('')
            }, 5000)
        }

    }
   

    return (
        <>
            {err !== "" &&
                <div className="fixed top-0 pt-2 bg-white text-red-700 text-2xl text-center">{err}</div>
            }
            {mess !== "" &&
                <div className="fixed top-0 pt-2 bg-white text-green-600 text-2xl text-center">{mess}</div>
            }
            <section>
                {props.img.map((item) => <Image className="w-auto h-auto" key={'imageId'+item._id} width={200} height={100} alt={item.detail} src={'/api/images/'+item.newUrl} onClick={() => clickOnImage(item.newUrl, item.detail, item._id, item.show)} />)}
            </section>
            {lightBox._id !== "" &&
                <div className="fixed w-full h-screen top-0 left-0 z-20">
                    <div className="fixed top-0 right-0 m-2 p-4" onClick={closeLightBox}><IoCloseSharp /></div>
                    <div className="flex justify-center items-center">
                        <Image src={lightBox.newUrl} alt={lightBox.detail} />
                        <div>
                            <Button className="text-red-700" onClick={deleteImg}>Törlés</Button>
                            <div>
                                <form action={action}>
                                    <Card className="w-full max-w-sm">
                                        <CardHeader>
                                            <CardTitle>Kéd adatainak megváltoztatása</CardTitle>
                                            {state?.error && <div className="mb-2 mt-2 text-red-600">{state.error}</div>}
                                            {state?.message && <div className="mb-2 mt-2 text-green-600">{state?.message}</div>}
                                        </CardHeader>
                                        <CardContent>

                                            <div className="flex flex-col gap-6">
                                                <div className="mb-5">
                                                    <Label htmlFor="picture-url" className="mb-2">Kép url-je</Label>
                                                    <Input id="picture-url" name="newUrl" type="text" disabled={isPending} required value={lightBox.newUrl} onChange={inputChangeHandle} />
                                                </div>
                                                <div>
                                                    <Label htmlFor="picture-alt" className="mb-2">Kép leírása</Label>
                                                    <Input id="picture-alt" name="detail" type="text" disabled={isPending} required value={lightBox.detail} onChange={inputChangeHandle} />
                                                </div>

                                                <div>
                                                    <Label htmlFor="picture-visibility" className="mb-2">Kép leírása</Label>
                                                    <Checkbox id="picture-visibility" name="show" disabled={isPending} required checked={lightBox.show} onChange={() => setLightBox({ ...lightBox, show: !lightBox.show })} />
                                                </div>

                                                <div className="hidden">
                                                    <Label htmlFor="picture-id" className="mb-2">Kép azonosítója</Label>
                                                    <Input id="picture-id" name="_id" type="text" disabled={isPending} required value={lightBox._id} />
                                                </div>

                                            </div>

                                        </CardContent>
                                        <CardFooter className="flex-col gap-2">
                                            <Button type="submit" className="w-full">
                                                Beküld
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            }

        </>

    )
}

export default ImageUpdatePage