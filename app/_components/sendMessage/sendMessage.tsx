"use client"


import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useForm } from "./formContext"
import { useActionState } from "react"
import { sendMessage } from "@/action/sendMessage"



const SendMessageForm = () => {
  const { ref } = useForm()
  const [state, action, isPending] = useActionState(sendMessage, null)
  return (

    <form className="w-full lg:w-[60%] lg:max-w-[800px] " action={action}>
      <div className="text-4xl mb-10">Írjon bizalommal</div>
      {state?.error && <div className="mb-2 mt-2 text-red-600">{state.error}</div>}
      {state?.failed && <div className="mb-2 mt-2 text-red-600">{state.failed.map((item) => <div key={item}>{item}</div>)}</div>}
      {state?.message && <div className="mb-2 mt-2 text-green-600">{state?.message}</div>}
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Név</FieldLabel>
          <Input id="name" name="name" placeholder="Név" required ref={ref} disabled={isPending} />
        </Field>
        <Field>
          <Label htmlFor="email">Email</Label>
          <Input id="email"
            name="email"
            type="email"
            placeholder="nev@valami.com"
            required
            disabled={isPending}
          />

        </Field>
        <FieldLabel htmlFor="message">Üzenet</FieldLabel>
        <Textarea id="message" placeholder="Írja ide az üzenetét." required name="message" disabled={isPending} />
        <Field orientation="horizontal">
          <Checkbox id="terms-checkbox" name="terms-checkbox" required />
          <FieldContent>
            <FieldLabel htmlFor="terms-checkbox">Felhasználási feltételek elfogadása</FieldLabel>
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