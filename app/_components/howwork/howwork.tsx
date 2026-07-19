'use client'
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";

const data = [
  {
    id: 'work-1',
    title: "Kapcsolatfelvétel",
    text: "Röviden elmondja, mire van szüksége (milyen jellegű munka)"
  },
  {
    id: 'work-2',
    title: "Ingyenes helyszíni felmérés",
    text: "Megnézem a helyszínt, felmérem az állapotot, pontos árajánlatot adok."
  },
  {
    id: 'work-3',
    title: "Időpont egyeztetés",
    text: "Közösen megbeszéljük a legmegfelelőbb kezdési dátumot."
  },
  {
    id: 'work-4',
    title: "Kivitelezés",
    text: "Szakszerű, tiszta munkavégzés, folyamatos egyeztetéssel."
  },
  {
    id: 'work-5',
    title: "Átadás",
    text: "Közösen ellenőrizzük az elkészült munkát, majd elvégezem a takarítást."
  },
]

const HowWork = () => {

  const [id, setId] = useState<string>("");

  const handleClick = (itemId: string) => {
    if (id !== itemId) {
      setId(itemId)
    }
    else {
      setId('')
    }
  }
  return (
    <section className={`mb-40 w-full mt-40`}>
      <h2 className="mb-10 text-center text-3xl font-bold">Hogyan zajlik a munkavégzés?</h2>
      <ul>
        {data.map((item) => <li key={item.id} className="bg-mist-900 text-white mb-1 ">
          <button className="flex w-full justify-between cursor-pointer p-4 lg:p-6 hover:bg-mist-500 focus-visible:outline-4 focus-visible:outline-gray-500" onClick={() => handleClick(item.id)} >
            <h3 className="font-bold text-lg ">{item.title}</h3>
            <div className={`${item.id === id ? '-rotate-45' : ''} duration-150`}><FaPlus size={30} /></div>
          </button>
          <p className={`${id === item.id ? 'pt-4 pb-4' : 'pt-0 pb-0 h-0'} overflow-hidden pl-4 pr-4 border-t-2 border-t-mist-600 duration-150`}>{item.text}</p>
        </li>)}
      </ul>
    </section>
  )
}

export default HowWork