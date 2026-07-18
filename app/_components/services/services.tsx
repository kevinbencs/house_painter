import { FaPaintRoller } from "react-icons/fa";
import { FaScroll } from "react-icons/fa6";
import { RiKnifeBloodFill } from "react-icons/ri";
import { GiLargePaintBrush } from "react-icons/gi";
import { GiBroom } from "react-icons/gi";

const data = [
    {
        id: "ser-1",
        title: "Lakásfestés",
        text: "Teljes lakások, egyedi helyiségek vagy csak egy-egy fal újrafestése. Vállalok tisztasági festést is.",
        icon: <FaPaintRoller />
    },
    {
        id: "ser-2",
        title: "Homlokzatfestés",
        text: "Társasházak és családi házak homlokzatának felújítása, mely különösen fontos, ahol az időjárásnak jobban kitett felületekről van szó.",
        icon: <GiLargePaintBrush />
    },
    {
        id: "ser-3",
        title: "Tapétázás",
        text: "Klasszikus és design tapéták felhelyezése, régi tapéta eltávolítása, aljzat-előkészítés.",
        icon: <FaScroll />
    },
    {
        id: "ser-4",
        title: "Glettelés és gipszkartonozás",
        text: "Egyenetlen falak, repedések javítása.",
        icon: <RiKnifeBloodFill />
    },
    {
        id: "ser-5",
        title: "Festés utáni takarítás",
        text: "Igény esetén elvégezem a bútorok letakarását, védelmét, illetve a munka befejezése után a takarítást is, hogy azonnal birtokba vehesse a megújult teret.",
        icon: <GiBroom />
    }
]


const Services = () => {
    return (
        <section >
            <h2 className="text-3xl mb-10 mt-20 text-center font-bold">Szolgáltatásaim</h2>
            <ul className="flex flex-wrap gap-10 justify-center">
                {data.map((item) => <li key={item.id} className="w-[600px] mb-10 flex items-center flex-col text-white bg-gray-900 p-5 rounded-lg">
                    <h3 className="text-xl mb-5">{item.title}</h3>
                    <div className="text-2xl">{item.icon}</div>
                    <p className="mt-5">{item.text}</p>
                </li>)}
            </ul>
        </section>
    )
}


export default Services