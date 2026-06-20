"use client"


import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useForm } from "./formContext"
import { useActionState, useEffect, useState } from "react"
import { sendMessage } from "@/action/sendMessage"



const SendMessageForm = () => {
  const { ref } = useForm()
  const [state, action, isPending] = useActionState(sendMessage, null)
  const [shown, setShown] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setShown(true);
    const id = setTimeout(() => {
      setShown(false)
    }, 5000);

    return () => clearTimeout(id);
  }, [state])

  useEffect(() => {

    if (state && state.fieldData && typeof state.fieldData[3] === 'boolean') setChecked(state.fieldData[3])
    else setChecked(false)
  }, [state?.fieldData])



  return (

    <form className="w-full lg:w-[60%] lg:max-w-[800px] " action={action}>
      <div className="text-4xl mb-10">Írjon bizalommal</div>
      {state?.error && <div className="mb-2 mt-2 text-red-600">{state.error}</div>}
      {state?.failed && <div className="mb-2 mt-2 text-red-600">{state.failed.map((item) => <div key={item}>{item}</div>)}</div>}
      {(shown && state?.message) && <div className="mb-2 mt-2 text-green-600">{state?.message}</div>}
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Név</FieldLabel>
          <Input id="name" name="name" placeholder="Név" required ref={ref} disabled={isPending} defaultValue={state && state.fieldData && typeof state.fieldData[0] === 'string'
            ? state.fieldData[0]
            : ''} />
        </Field>
        <Field>
          <Label htmlFor="email">Email</Label>
          <Input id="email"
            name="email"
            type="email"
            placeholder="nev@valami.com"
            required
            disabled={isPending}
            defaultValue={state && state.fieldData && typeof state.fieldData[1] === 'string'
              ? state.fieldData[1]
              : ''}
          />

        </Field>
        <FieldLabel htmlFor="message">Üzenet</FieldLabel>
        <Textarea id="message" placeholder="Írja ide az üzenetét." name="message" disabled={isPending}
          defaultValue={state && state.fieldData && typeof state.fieldData[2] === 'string'
            ? state.fieldData[2]
            : ''}
        />
        <Field orientation="horizontal">
          <Checkbox id="privacy" name="privacy" disabled={isPending} checked={checked} onCheckedChange={(e) => { setChecked(!checked); }} />
          <FieldContent>
            <FieldLabel htmlFor="privacy">Felhasználási feltételek elfogadása</FieldLabel>
            <FieldDescription>
              A checkbox bejelölésével elfogadja a felhasználási feltételeket.
            </FieldDescription>
          </FieldContent>

        </Field>
        <Field>

        </Field>
        <Field  >
          <Button type="submit" disabled={isPending} size="lg">Küld</Button>

        </Field>
      </FieldGroup>

    </form>

  )
}

export default SendMessageForm