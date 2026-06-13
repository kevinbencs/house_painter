"use client"


import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useForm } from "./formContext"



const SendMessageForm = () => {
  const {ref} = useForm()
  return (
    
    <form className="w-full lg:w-[60%] lg:max-w-[800px] ">
      <div className="text-4xl mb-10">Írjon bizalommal</div>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Név</FieldLabel>
          <Input id="name" name="name" placeholder="Név" required ref={ref}/>
        </Field>
        <Field>
          <Label htmlFor="email">Email</Label>
          <Input id="email"
            name="email"
            type="email"
            placeholder="nev@valami.com"
            required
          />

        </Field>
        <FieldLabel htmlFor="message">Üzenet</FieldLabel>
        <Textarea id="message" placeholder="Írja ide az üzenetét." required name="message"/>
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
            <Button type="submit" size="lg">Küld</Button>

        </Field>
      </FieldGroup>

    </form>

  )
}

export default SendMessageForm