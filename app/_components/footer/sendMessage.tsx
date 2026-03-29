
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"



const SendMessage = () => {
  return (

    <form className="w-full lg:w-[50%] lg:max-w-[700px]">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Név</FieldLabel>
          <Input id="name" placeholder="Név" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email"
            type="email"
            placeholder="nev@valami.com"
            required
          />

        </Field>
        <FieldLabel htmlFor="message">Üzenet</FieldLabel>
        <Textarea id="message" placeholder="Írja ide az üzenetét." required />
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

export default SendMessage