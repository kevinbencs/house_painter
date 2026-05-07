import * as z from "zod"


export const loginSchema = z.object({
    email: z.email({message: "Email is required"}),
    password: z.string({message: 'Password is required'})
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