import Section from "@/app/_components/price/section"
import { getCategory, getPriceData } from "@/lib/data"
import { MongoData } from "@/typeScriptType/price"


const Page = async () => {
  const res = await getPriceData()

  const cat = await getCategory()

  const catArr = cat.map((i) => i._id)


  const data: MongoData[][] = [];

  for (let i = 0; i < catArr.length; i++) {
    data.push([])
    for (let j = 0; j < res.length; j++) {
      if (catArr[i] === res[j].category) {
        data[i].push(res[j])
      }
    }
  }

  return (
    <>
      <h1 className="text-3xl mb-10">Árak</h1>
      <div className="mb-40">
        {data.map((item) => <Section key={'price-cat-' + item[0].category} arrOfEl={item} />)}
      </div>

    </>
  )
}

export default Page