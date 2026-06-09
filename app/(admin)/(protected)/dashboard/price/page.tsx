import MainElement from '@/app/_components/dashboard/price/mainElement'
import { checkAuth } from '@/lib/checkAuth'
import { getCategory, getPriceData } from '@/lib/data'
import { Categories, ElementOfPrice, MongoData } from '@/typeScriptType/price'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'



const Page = async () => {
  /*const auth = await checkAuth()

  if (auth.error) redirect('/');*/

  await connection()
  const [res, cat ]: [MongoData[], Categories[]] = await Promise.all([
    getPriceData(),
    getCategory()
  ])


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
      <h1 className="text-3xl mb-2">Árak</h1>
      <MainElement data={data} />
    </div>
  )
}

export default Page