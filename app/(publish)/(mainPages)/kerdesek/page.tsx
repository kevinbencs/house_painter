"use client"

import GuaranteeElement from "@/app/_components/mainPage/guaranteeElement"
import { useState } from "react"


const data = [
    { id: "1", title: 'Milyen kötelezettségeim vannak az árajánlat kérése után?', text: 'Minden munkát úgy végzek el, mintha a saját otthonomon dolgoznék. Fontos számomra a részletekre való odafigyelés és a tartós végeredmény.' },
    { id: "2", title: 'Hogyan készüljek elő?', text: 'Tiszteletben tartom ügyfeleim idejét. A megbeszélt időpontokat és határidőket betartom.' },
    { id: "3", title: 'Mit tartalmaz az árajánlat?', text: 'A bútorok, padlók és egyéb felületek megfelelő takarásáról gondoskodom.' },
    { id: "4", title: 'Mikor kell fizetni?', text: 'Átlátható árajánlatot készítek, így Ön előre tudja, milyen költségekre számíthat.' },
    { id: "5", title: 'Mennyi ideig tartanak a munkálatok?', text: 'Legyen szó lakásról, családi házról, irodáról vagy üzlethelyiségről, az Ön igényeihez igazodva dolgozom.' },
    { id: "6", title: 'Csak hétköznap dolgoznak?', text: 'Gyors kiszállással vállalok munkát a főváros minden kerületében.' }
]

const page = () => {
  const [visible, setVisible] = useState<string>('')

  return (
    <div>
      <h1 className='mt-10'>Kérdések</h1>
      <ul className='lg:pl-[calc(50%-450px)] lg:pr-[calc(50%-450px)] pl-2 pr-2'>
          {data.map((item) => <li key={item.id} className="bg-mist-900 text-white mb-1 "> <GuaranteeElement text={item.text} title={item.title} id={item.id} setVisible={setVisible} visible={visible} />  </li>)}
      </ul>
    </div>
  )
}

export default page