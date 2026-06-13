"use client"
import { useContext, createContext, useRef, RefObject, ReactNode } from 'react'

type FormContextType = {
    ref: RefObject<null | HTMLInputElement>
}


const FormContext = createContext<undefined | FormContextType>(undefined)

export const FormProvided = ({ children }: { children: ReactNode }) => {
    const ref = useRef(null);


    return (
        <FormContext.Provider value={{ ref }}>
            {children}
        </FormContext.Provider>
    )

}

export const useForm = () => {
    const context = useContext(FormContext)

    if (typeof context === 'undefined') {
        throw new Error('useLogged must be use in isLoggedProvider')
    }

    return context;
}