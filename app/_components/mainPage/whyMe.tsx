'use client'


import { useScrollReveal } from "./useScrollReveal";

const WhyMe = () => {
    const { ref, isVisible } = useScrollReveal();
    return (
        <section className={`text-center mb-40  p-5 pt-20 bg-mist-900 text-white  pb-10 rounded-2xl  reveal ${isVisible ? 'active' : ''}`} ref={ref}>
            <h2 className="text-4xl mb-20">Miért válasszon engem?</h2>
            <p className="text-center mb-30">Több éves tapasztalattal vállalok szobafestési, mázolási kisebb és nagyobb felújítási munkákat Budapest egész területén. Célom, hogy ügyfeleim gyorsan, tisztán és kiváló minőségben megvalósított munkát kapjanak, rejtett költségek és kellemetlen meglepetések nélkül.</p>
            
        </section>

    )
}

export default WhyMe