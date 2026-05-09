import * as z from "zod"


export const loginSchema = z.object({
    email: z.email({message: "Email-t kötelező megadni"}),
    password: z.string({message: 'Jeszót kötelezó megadni'})
})

export const newPasswordSchema = z.object({
    password: z.string().refine((val) => {
        const lowerCase = /[a-z]/.test(val);
        const upperCase = /[A-Z]/.test(val);
        const numb = /[0-9]/.test(val);
        const length = val.length > 10;

        return lowerCase && upperCase && numb && length;
    }, {message: "A jelszónak tartalmaznia kell egy számot, egy nagy batűt és egy kis betűt, valamint legalább 10 karater hosszúnak kell lennie."}),
    passwordConfirm: z.string()
}).refine((data) => {
    return data.password === data.passwordConfirm
}, {message: "A két jelszónak meg kell egyeznie."})


export const blogServPlaceSchema = z.object({
    heading: z.string({message: 'Címet kötelező megadni'}),
    text:  z.string({message: 'Szöveget kötelező megadni'}),
    keywords:  z.array(z.string({message: "Kulcsszavakat kötelező megadni"})),
    detail: z.string({message: "A leírás megadása kötelező"}),
    image: z.string({message: "Egy kép id-jének megadása kötelező"})
})

export const deleteSchema = z.string({message: "_id megadása kötelező"})