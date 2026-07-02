"use client"

import { useState } from "react";
import { useScrollReveal } from "./useScrollReveal";
import GuaranteeElement from "./guaranteeElement";

const data = [
    { id: "1", title: 'Precíz, igényes kivitelezés', text: 'Minden munkát úgy végzek el, mintha a saját otthonomon dolgoznék. Fontos számomra a részletekre való odafigyelés és a tartós végeredmény.' },
    { id: "2", title: 'Pontos határidők', text: 'Tiszteletben tartom ügyfeleim idejét. A megbeszélt időpontokat és határidőket betartom.' },
    { id: "3", title: 'Tiszta munkavégzés', text: 'A bútorok, padlók és egyéb felületek megfelelő takarásáról gondoskodom.' },
    { id: "4", title: 'Korrekt árak, rejtett költségek nélkül', text: 'Átlátható árajánlatot készítek, így Ön előre tudja, milyen költségekre számíthat.' },
    { id: "5", title: 'Személyre szabott megoldások', text: 'Legyen szó lakásról, családi házról, irodáról vagy üzlethelyiségről, az Ön igényeihez igazodva dolgozom.' },
    { id: "6", title: 'Budapest teljes területén elérhető', text: 'Gyors kiszállással vállalok munkát a főváros minden kerületében.' }
]

export default function Guarantee() {
    const [visible, setVisible] = useState<string>('')

    const { ref, isVisible } = useScrollReveal();
    return (
        <section className={`mb-40    reveal ${isVisible ? 'active' : ''}`} ref={ref}>
            <h2 className="mb-5 text-4xl font-bold">Amit garantálok</h2>
            <div>
                <ul>
                    {data.map((item) => <li key={item.id} className="bg-mist-900 text-white mb-1 "> <GuaranteeElement text={item.text} title={item.title} id={item.id} setVisible={setVisible} visible={visible} />  </li>)}
                </ul>
            </div>
        </section>
    )
}