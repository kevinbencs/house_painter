'use client'
import { useScrollReveal } from "./useScrollReveal"


const Heading = ({ text }: { text: string }) => {

    const { ref, isVisible } = useScrollReveal();

    return (
        <h2 ref={ref} className={`mb-10 text-center text-3xl reveal ${isVisible ? 'active' : ''}`}>{text}</h2>
    )
}

export default Heading