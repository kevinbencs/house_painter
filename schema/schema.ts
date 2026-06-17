import * as z from "zod"


export const loginSchema = z.object({
    email: z.email({message: "Email-t kötelező megadni"}),
    password: z.string().min(1,{message: 'Jeszót kötelezó megadni'})
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
    heading: z.string().min(1,{message: 'Címet kötelező megadni'}),
    text:  z.string().min(1,{message: 'Szöveget kötelező megadni'}),
    keywords: z.string().min(1,{message: "Kulcsszavakat kötelező megadni"}),
    detail: z.string().min(1,{message: "A leírás megadása kötelező"}),
    image: z.string().min(1,{message: "Egy kép id-jének megadása kötelező"})
})


export const PlaceSchema = z.object({
    heading: z.string().min(1,{message: 'Címet kötelező megadni'}),
    text:  z.string().min(1,{message: 'Szöveget kötelező megadni'}),
    keywords: z.string().min(1,{message: "Kulcsszavakat kötelező megadni"}),
    detail: z.string().min(1,{message: "A leírás megadása kötelező"}),
    image: z.string().min(1,{message: "Egy kép id-jének megadása kötelező"}),
    paragh: z.string().min(1,{message: "A cím alatti leírás megadása kötelező"}),
})


export const blogServPlaceSchemaId = z.object({
    heading: z.string().min(1,{message: 'Címet kötelező megadni'}),
    text:  z.string().min(1,{message: 'Szöveget kötelező megadni'}),
    keywords: z.string().min(1,{message: "Kulcsszavakat kötelező megadni"}),
    detail: z.string().min(1,{message: "A leírás megadása kötelező"}),
    image: z.string().min(1,{message: "Egy kép id-jének megadása kötelező"}),
    _id: z.string().min(1,{message: "Az oldal id-jének megadása kötelező"}),
})


export const placeSchemaId = z.object({
    heading: z.string().min(1,{message: 'Címet kötelező megadni'}),
    text:  z.string().min(1,{message: 'Szöveget kötelező megadni'}),
    keywords: z.string().min(1,{message: "Kulcsszavakat kötelező megadni"}),
    detail: z.string().min(1,{message: "A leírás megadása kötelező"}),
    image: z.string().min(1,{message: "Egy kép id-jének megadása kötelező"}),
    _id: z.string().min(1,{message: "Az oldal id-jének megadása kötelező"}),
    paragh: z.string().min(1,{message: "A cím alatti leírás megadása kötelező"}),
})


export const imageIdSchema = z.object({
    newUrl:  z.string().min(1,{message: 'Az url megadása kötelező'}),
    show: z.string().min(1,{message: "Láthatóság megadása kötelező"}),
    detail: z.string().min(1,{message: "A leírás megadása kötelező"}),
    _id: z.string().min(1,{message: "Az oldal id-jének megadása kötelező"}),
})

export const imageSchema = z.object({
    newUrl:  z.string().min(1,{message: 'Az url megadása kötelező'}),
    file: z.string().min(1,{message: "Láthatóság megadása kötelező"}),
    detail: z.file({message: "A kép megadása kötelező"}),
})

export const deleteSchema = z.string({message: "_id megadása kötelező"})

export const otpTokenSchema = z.object({
    secret: z.string().min(1,{message: "A secret megadása kötelező"}).min(1),
    otpCode: z.string().min(1,{message: "A Kód megadása kötelező"}).length(6)
}) 

export const otpTokenSchema2 =  z.string({message: "A Kód megadása kötelező"}).min(1);

export const PageViewSchema = z.object({
    pathname: z.string().min(1, {message: "Pathname megadása kötelező"}),
    referrer: z.union([z.string(), z.null()])
})

export const addPriceSchema = z.object({
    price: z.int().gte(1,{message: "Az ár megadása kötelező"}),
    category: z.string().min(1,{message: "Kategória megadása kötelező"}),
    name: z.string().min(1,{message:"A név megadása kötelező"}),
    unitOfMea: z.string().min(1, {message: "A mértékegység megadása kötelező"})
})

export const updatePriceSchema = z.object({
    price: z.int().gte(1,{message: "Az ár megadása kötelező"}),
    category: z.string().min(1,{message: "Kategória megadása kötelező"}),
    _id: z.string().min(1,{message: "Kategória megadása kötelező"}),
    name: z.string().min(1,{message:"A név megadása kötelező"}),
    unitOfMea: z.string().min(1, {message: "A mértékegység megadása kötelező"})
})


export const messageSchema = z.object({
    email: z.email({message: "Email-t kötelező megadni"}),
    name: z.string().min(1,{message: 'Nevet kötelezó megadni'}),
    message: z.string().min(1,{message: 'Üzenetet kötelezó megadni'})
})