"use client"


import FormElement from "./fomtElement"
import { Button } from "@/components/ui/button"
import Section from "./section"
import { useActionState } from "react"
import { updatePrice } from "@/action/updatePrice"
import { ElementOfPrice } from "@/typeScriptType/price"


const MainElement = (props: {data: ElementOfPrice[][]}) => {

    const [state, action, isPending] = useActionState(updatePrice, null)


    return (
        <>
            <FormElement />
            <form action={action} className="mt-20">
                {state?.error && <div className="mb-2 mt-2 text-red-600">{state.error}</div>}
                {state?.message && <div className="mb-2 mt-2 text-green-600">{state?.message}</div>}
                {props.data.map((item) => <Section key={'cat-'+item[0].category} arrOfEl={item} isPending={isPending}/>)}
                <Button type="submit" disabled={isPending}>
                    Mentés
                </Button>
            </form>
        </>
    )
}

export default MainElement