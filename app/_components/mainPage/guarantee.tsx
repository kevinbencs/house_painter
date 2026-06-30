"use client"

import { useScrollReveal } from "./useScrollReveal";

export default function Guarantee() {
    const { ref, isVisible } = useScrollReveal();
    return (
        <section className={`mb-40  p-5 pt-20 bg-mist-900 text-white  pb-10 rounded-2xl  reveal ${isVisible ? 'active' : ''}`} ref={ref}>
            <h2 className="mb-10 text-3xl">Amit garantálok</h2>
            <div>
                <ul>
                    <li className="mb-5 list-item list-disc pl-5 ml-5"> <span className="font-bold text-lg"> Precíz, igényes kivitelezés:</span> Minden munkát úgy végzek el, mintha a saját otthonomon dolgoznék. Fontos számomra a részletekre való odafigyelés és a tartós végeredmény.</li>
                    <li className="mb-5 list-item list-disc pl-5 ml-5"> <span className="font-bold text-lg"> Pontos határidők:</span> Tiszteletben tartom ügyfeleim idejét. A megbeszélt időpontokat és határidőket betartom.</li>
                    <li className="mb-5 list-item list-disc pl-5 ml-5"> <span className="font-bold text-lg"> Tiszta munkavégzés:</span> A bútorok, padlók és egyéb felületek megfelelő takarásáról gondoskodom.</li>
                    <li className="mb-5 list-item list-disc pl-5 ml-5"> <span className="font-bold text-lg"> Korrekt árak, rejtett költségek nélkül:</span> Átlátható árajánlatot készítek, így Ön előre tudja, milyen költségekre számíthat.</li>
                    <li className="mb-5 list-item list-disc pl-5 ml-5"> <span className="font-bold text-lg"> Személyre szabott megoldások:</span> Legyen szó lakásról, családi házról, irodáról vagy üzlethelyiségről, az Ön igényeihez igazodva dolgozom.</li>
                    <li className="mb-5 list-item list-disc pl-5 ml-5"> <span className="font-bold text-lg"> Budapest teljes területén elérhető:</span> Gyors kiszállással vállalok munkát a főváros minden kerületében.</li>
                </ul>
            </div>
        </section>
    )
}