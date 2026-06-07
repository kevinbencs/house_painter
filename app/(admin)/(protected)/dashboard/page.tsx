import Step1 from '@/app/_components/dashboard/main/chart';
import PieChartDefaultIndex from '@/app/_components/dashboard/main/pie';
import { checkAuth } from '@/lib/checkAuth';
import Blog from '@/models/Blog';
import PageView from '@/models/PageView';
import Place from '@/models/Place';
import Service from '@/models/Service';
import { ChartType, ChartType2, PieType } from '@/typeScriptType/dashboard';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { connection } from 'next/server'

const page = async () => {
  await connection();
  /*const auth = await checkAuth()

  if (auth.error) redirect('/');*/

  await connection();


  const res = await Promise.all([
    PageView.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            referrer: "$referrer"
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    Blog.find({}, { _id: 1, heading: 1, createdAt: 1 }).limit(2),
    Place.find({}, { _id: 1, heading: 1, createdAt: 1 }).limit(2),
    Service.find({}, { _id: 1, heading: 1, createdAt: 1 }).limit(2)
  ])



  const perDay: ChartType[] = Object.entries(
    res[0].reduce((acc, { _id, count }: { _id: { date: string }, count: number }) => {
      acc[_id.date] = (acc[_id.date] ?? 0) + count;
      return acc;
    }, {} as Record<string, number>)
  ).map(([date, count]) => ({ date, count })) as ChartType[];

  const perReferrer: PieType[] = Object.entries(
    res[0].reduce((acc, { _id, count }: { _id: { referrer: string }, count: number }) => {
      acc[_id.referrer] = (acc[_id.referrer] ?? 0) + count;
      return acc;
    }, {} as Record<string, number>)
  ).map(([referrer, count]) => ({ referrer, count })) as PieType[];



  return (
    <div className='w-full'>
      <div className='flex gap-10'>
        <Step1 data={perDay.map((item) => ({ name: item.date, amt: 2400, Látogatottság: item.count }))} />
        <PieChartDefaultIndex data={perReferrer.map((item) => ({ name: (item.referrer === null || item.referrer ==='null') ? "Keresők": item.referrer, value: item.count }))} />
      </div>
      <section>
        <h2>Utoljára elkészített oldalak</h2>
        <div className='flex gap-2 flex-col'>
          <div>
            {res[1].map((item) => <Link href={"/"+item.heading.replaceAll(" ","-")} target='_blank' key={String(item._id) + 'dashboard'}>{item.heading}</Link>)}
          </div>

          <div>
            {res[2].map((item) => <Link href={"/"+item.heading.replaceAll(" ","-")} target='_blank' key={String(item._id) + 'dashboard'}>{item.heading}</Link>)}
          </div>
          <div>
            {res[3].map((item) => <Link href={"/"+item.heading.replaceAll(" ","-")} target='_blank' key={String(item._id) + 'dashboard'}>{item.heading}</Link>)}
          </div>
        </div>
      </section>
    </div>
  )
}

export default page