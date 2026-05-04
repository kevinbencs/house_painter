
import { MongoData } from "@/typeScriptType/price"
import Prices from "./prices"



const Section = (props: {arrOfEl: MongoData[]}) => {
  return (
    <section className="mb-10">
        <h2 className="mb-3 border-b-3 border-black text-xl">{props.arrOfEl[0].category}</h2>
        {props.arrOfEl.filter((item) => item._id!=item.category).map((item) => <Prices unitOfMea={item.unitOfMea}  key={item._id+'-price'} name={item.name} price={String(item.price)}/>)}
    </section>
  )
}

export default Section