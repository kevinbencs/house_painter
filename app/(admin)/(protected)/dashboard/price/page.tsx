import MainElement from '@/app/_components/dashboard/price/mainElement'
import { getCategory, getPriceData } from '@/lib/data'
import { Categories, ElementOfPrice, MongoData } from '@/typrScirptType/price'



const Page = async () => {
  
  const res: MongoData[] = await getPriceData()

  const cat: Categories[] = await getCategory()

  const catArr = cat.map((i) => i._id)

  const oneDArr = res.map((item) => ({
    _id: String(item._id),
    name: item.name,
    price: String(item.price),
    category: item.category,
    categories: catArr,
    unitOfMea: item.unitOfMea
  }))

  const data: ElementOfPrice[][] = [];

  for (let i = 0; i < catArr.length; i++) {
    data.push([])
    for (let j = 0; j < oneDArr.length; j++) {
      if (catArr[i] === oneDArr[j].category) {
        data[i].push(oneDArr[j])
      }
    }
  }



  return (
    <div className='w-full'>
      <MainElement data={data} />
    </div>
  )
}

export default Page